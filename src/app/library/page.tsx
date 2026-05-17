'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import BottomNav from '@/components/layout/BottomNav'
import AtmosphericBackground from '@/components/layout/AtmosphericBackground'

// ============================================================
// Types
// ============================================================
interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  source: 'supabase' | 'openlibrary' | 'gutenberg'
  description?: string
  genre?: string
  // For Supabase (your own PDFs)
  fileUrl?: string
  // For Gutenberg
  gutenbergId?: number
  // For Open Library
  olKey?: string
}

interface ReadingProgress {
  bookId: string
  pageNumber: number
  totalPages: number
  updatedAt: string
}

// ============================================================
// Supabase config — your own PDFs
// ============================================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const BUCKET = 'books'

// ============================================================
// Mood → genre map
// ============================================================
const MOOD_GENRES: Record<string, string[]> = {
  calm:    ['philosophy', 'poetry', 'nature'],
  healing: ['self-help', 'memoir', 'psychology'],
  joyful:  ['comedy', 'romance', 'adventure'],
  drifting:['mystery', 'fantasy', 'science fiction'],
  anxious: ['mindfulness', 'self-help', 'stoicism'],
  heavy:   ['drama', 'literary fiction'],
  alive:   ['biography', 'motivation', 'adventure'],
  soft:    ['poetry', 'romance', 'art'],
}

const GENRE_FILTERS = [
  { id: 'all',        label: 'All',        emoji: '✦' },
  { id: 'mine',       label: 'My Books',   emoji: '🗂️' },
  { id: 'fiction',    label: 'Fiction',    emoji: '🌌' },
  { id: 'self-help',  label: 'Self-Help',  emoji: '🌱' },
  { id: 'philosophy', label: 'Philosophy', emoji: '🔮' },
  { id: 'poetry',     label: 'Poetry',     emoji: '🕊️' },
  { id: 'mystery',    label: 'Mystery',    emoji: '🌙' },
  { id: 'romance',    label: 'Romance',    emoji: '🌸' },
]

// ============================================================
// Gutenberg curated picks (classics — always free)
// ============================================================
const GUTENBERG_PICKS: Book[] = [
  { id: 'g-1342', title: 'Pride and Prejudice', author: 'Jane Austen', coverUrl: 'https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg', source: 'gutenberg', gutenbergId: 1342, genre: 'romance', description: 'A timeless story of love, class, and misunderstanding.' },
  { id: 'g-11',   title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', coverUrl: 'https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg', source: 'gutenberg', gutenbergId: 11, genre: 'fiction', description: 'Fall down the rabbit hole.' },
  { id: 'g-1080', title: 'A Modest Proposal', author: 'Jonathan Swift', coverUrl: 'https://www.gutenberg.org/cache/epub/1080/pg1080.cover.medium.jpg', source: 'gutenberg', gutenbergId: 1080, genre: 'fiction', description: 'Sharp satire from 1729.' },
  { id: 'g-2701', title: 'Moby Dick', author: 'Herman Melville', coverUrl: 'https://www.gutenberg.org/cache/epub/2701/pg2701.cover.medium.jpg', source: 'gutenberg', gutenbergId: 2701, genre: 'fiction', description: 'An obsessive hunt across the sea.' },
  { id: 'g-84',   title: 'Frankenstein', author: 'Mary Shelley', coverUrl: 'https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg', source: 'gutenberg', gutenbergId: 84, genre: 'fiction', description: 'Creation, ambition, and consequence.' },
  { id: 'g-1661', title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', coverUrl: 'https://www.gutenberg.org/cache/epub/1661/pg1661.cover.medium.jpg', source: 'gutenberg', gutenbergId: 1661, genre: 'mystery', description: 'Elementary, my dear reader.' },
  { id: 'g-5200', title: 'Metamorphosis', author: 'Franz Kafka', coverUrl: 'https://www.gutenberg.org/cache/epub/5200/pg5200.cover.medium.jpg', source: 'gutenberg', gutenbergId: 5200, genre: 'fiction', description: 'Wake up as something else.' },
  { id: 'g-174',  title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', coverUrl: 'https://www.gutenberg.org/cache/epub/174/pg174.cover.medium.jpg', source: 'gutenberg', gutenbergId: 174, genre: 'fiction', description: 'Beauty, corruption, and a haunted portrait.' },
  { id: 'g-345',  title: 'Dracula', author: 'Bram Stoker', coverUrl: 'https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg', source: 'gutenberg', gutenbergId: 345, genre: 'mystery', description: 'The original vampire tale.' },
  { id: 'g-25344',title: 'The Enchanted April', author: 'Elizabeth von Arnim', coverUrl: 'https://www.gutenberg.org/cache/epub/25344/pg25344.cover.medium.jpg', source: 'gutenberg', gutenbergId: 25344, genre: 'romance', description: 'Four women, an Italian castle, and renewal.' },
  { id: 'g-16',   title: 'Peter Pan', author: 'J.M. Barrie', coverUrl: 'https://www.gutenberg.org/cache/epub/16/pg16.cover.medium.jpg', source: 'gutenberg', gutenbergId: 16, genre: 'fiction', description: 'The boy who never grew up.' },
  { id: 'g-4300', title: 'Ulysses', author: 'James Joyce', coverUrl: 'https://www.gutenberg.org/cache/epub/4300/pg4300.cover.medium.jpg', source: 'gutenberg', gutenbergId: 4300, genre: 'fiction', description: 'A single day in Dublin, forever.' },
]

// ============================================================
// Component
// ============================================================
export default function LibraryPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id ?? session?.user?.email ?? ''

  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [myBooks, setMyBooks] = useState<Book[]>([])
  const [progress, setProgress] = useState<Record<string, ReadingProgress>>({})
  const [isLoadingMine, setIsLoadingMine] = useState(false)

  // ── Fetch user's Supabase PDFs ──────────────────────────────
  useEffect(() => {
    fetchMyBooks()
    if (userId) fetchProgress()
  }, [userId])

  async function fetchMyBooks() {
    setIsLoadingMine(true)
    try {
      const res = await fetch(
        `${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_KEY}`,
            apikey: SUPABASE_KEY,
          },
          body: JSON.stringify({ prefix: '', limit: 100, offset: 0 }),
        }
      )
      const files = await res.json()
      if (!Array.isArray(files)) { setIsLoadingMine(false); return }

      const books: Book[] = files
        .filter((f: any) => f.name?.endsWith('.pdf'))
        .map((f: any) => {
          const name = f.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ')
          return {
            id: `sb-${f.name}`,
            title: name,
            author: 'Your Library',
            coverUrl: '',
            source: 'supabase',
            fileUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${f.name}`,
            genre: 'mine',
            description: 'From your personal collection.',
          }
        })
      setMyBooks(books)
    } catch {}
    setIsLoadingMine(false)
  }

  async function fetchProgress() {
    try {
      const res = await fetch(`/api/library/progress?userId=${userId}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        const map: Record<string, ReadingProgress> = {}
        data.forEach((p: any) => { map[p.bookId] = p })
        setProgress(map)
      }
    } catch {}
  }

  // ── Search Open Library ─────────────────────────────────────
  const searchOpenLibrary = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return }
    setIsSearching(true)
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=12&fields=key,title,author_name,cover_i,first_sentence,subject`
      )
      const data = await res.json()
      const books: Book[] = (data.docs ?? []).map((d: any) => ({
        id: `ol-${d.key?.replace('/works/', '') ?? Math.random()}`,
        title: d.title ?? 'Unknown',
        author: d.author_name?.[0] ?? 'Unknown',
        coverUrl: d.cover_i
          ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
          : '',
        source: 'openlibrary',
        olKey: d.key,
        description: d.first_sentence?.value ?? '',
        genre: d.subject?.[0]?.toLowerCase() ?? 'fiction',
      }))
      setSearchResults(books)
    } catch {}
    setIsSearching(false)
  }, [])

  // debounce
  useEffect(() => {
    const t = setTimeout(() => searchOpenLibrary(searchQuery), 500)
    return () => clearTimeout(t)
  }, [searchQuery, searchOpenLibrary])

  // ── Compute displayed books ─────────────────────────────────
  const allStaticBooks: Book[] = [...myBooks, ...GUTENBERG_PICKS]

  const displayBooks: Book[] = searchQuery.trim()
    ? searchResults
    : activeFilter === 'mine'
      ? myBooks
      : activeFilter === 'all'
        ? allStaticBooks
        : allStaticBooks.filter(b => b.genre === activeFilter)

  // ── Open book ───────────────────────────────────────────────
  function openBook(book: Book) {
    const params = new URLSearchParams({
      title:  book.title,
      author: book.author,
      source: book.source,
      ...(book.fileUrl     && { fileUrl: book.fileUrl }),
      ...(book.gutenbergId && { gutenbergId: String(book.gutenbergId) }),
      ...(book.olKey       && { olKey: book.olKey }),
      ...(book.coverUrl    && { coverUrl: book.coverUrl }),
    })
    router.push(`/library/read/${encodeURIComponent(book.id)}?${params}`)
  }

  const progressPct = (bookId: string) => {
    const p = progress[bookId]
    if (!p || !p.totalPages) return 0
    return Math.round((p.pageNumber / p.totalPages) * 100)
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-lumina-void">
      <AtmosphericBackground mood="calm" />

      <div className="relative z-10 flex flex-col min-h-dvh pb-24">
        {/* ── Header ── */}
        <div className="safe-top" />
        <div className="px-5 pt-6 pb-2">
          <h1 className="text-2xl font-semibold text-white/90" style={{ fontFamily: 'var(--font-sora)' }}>
            Library 📚
          </h1>
          <p className="text-xs text-white/40 mt-0.5">Your books. Your pace.</p>
        </div>

        {/* ── Search bar ── */}
        <div className="px-5 mt-3">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.09)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="text-white/30 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search millions of books…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white/80 text-sm placeholder-white/25 outline-none"
              style={{ fontFamily: 'var(--font-sora)' }}
            />
            {isSearching && (
              <div className="w-4 h-4 border border-purple-400/40 border-t-purple-400 rounded-full animate-spin" />
            )}
          </div>
        </div>

        {/* ── Genre filters ── */}
        {!searchQuery && (
          <div className="mt-4 flex gap-2 px-5 overflow-x-auto scrollbar-none">
            {GENRE_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light transition-all"
                style={{
                  fontFamily: 'var(--font-sora)',
                  background: activeFilter === f.id
                    ? 'rgba(139,92,246,0.3)'
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${activeFilter === f.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: activeFilter === f.id ? 'rgba(196,181,253,0.95)' : 'rgba(255,255,255,0.45)',
                }}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Continue reading ── */}
        {!searchQuery && Object.keys(progress).length > 0 && (
          <div className="px-5 mt-5">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Continue Reading</p>
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
              {Object.values(progress).slice(0, 5).map(p => {
                const book = [...myBooks, ...GUTENBERG_PICKS].find(b => b.id === p.bookId)
                if (!book) return null
                return (
                  <button
                    key={p.bookId}
                    onClick={() => openBook(book)}
                    className="flex-shrink-0 flex flex-col rounded-2xl overflow-hidden w-28 text-left"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {book.coverUrl
                      ? <img src={book.coverUrl} alt={book.title} className="w-full h-36 object-cover" />
                      : <div className="w-full h-36 flex items-center justify-center text-3xl" style={{ background: 'rgba(139,92,246,0.15)' }}>📄</div>
                    }
                    <div className="p-2">
                      <p className="text-white/80 text-[10px] font-medium leading-tight truncate">{book.title}</p>
                      <div className="mt-1.5 h-0.5 w-full rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${progressPct(p.bookId)}%`, background: 'rgba(139,92,246,0.7)' }}
                        />
                      </div>
                      <p className="text-white/30 text-[9px] mt-1">p.{p.pageNumber} · {progressPct(p.bookId)}%</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Book grid ── */}
        <div className="px-5 mt-5">
          {searchQuery && (
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
              {isSearching ? 'Searching…' : `${searchResults.length} results`}
            </p>
          )}
          {!searchQuery && !isLoadingMine && activeFilter === 'mine' && myBooks.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📂</p>
              <p className="text-white/40 text-sm">No PDFs uploaded yet.</p>
              <p className="text-white/25 text-xs mt-1">Upload PDFs to your Supabase <code className="opacity-60">books</code> bucket.</p>
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            {displayBooks.map(book => (
              <button
                key={book.id}
                onClick={() => openBook(book)}
                className="flex flex-col rounded-2xl overflow-hidden text-left transition-all active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Cover */}
                <div className="relative w-full aspect-[2/3]">
                  {book.coverUrl
                    ? <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-2"
                        style={{
                          background: book.source === 'supabase'
                            ? 'linear-gradient(135deg,rgba(139,92,246,0.3) 0%,rgba(30,27,75,0.8) 100%)'
                            : 'linear-gradient(135deg,rgba(56,189,248,0.2) 0%,rgba(15,23,42,0.9) 100%)',
                        }}
                      >
                        <span className="text-3xl">{book.source === 'supabase' ? '📄' : '📖'}</span>
                        <p className="text-white/50 text-[9px] px-2 text-center leading-tight line-clamp-3">{book.title}</p>
                      </div>
                    )
                  }
                  {/* Source badge */}
                  <div
                    className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[8px]"
                    style={{
                      background: book.source === 'supabase'
                        ? 'rgba(139,92,246,0.7)'
                        : book.source === 'gutenberg'
                          ? 'rgba(34,197,94,0.6)'
                          : 'rgba(56,189,248,0.6)',
                      color: 'white',
                    }}
                  >
                    {book.source === 'supabase' ? 'Mine' : book.source === 'gutenberg' ? 'Classic' : 'Search'}
                  </div>
                  {/* Progress overlay */}
                  {progress[book.id] && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: 'rgba(139,92,246,0.4)' }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${progressPct(book.id)}%`,
                          background: 'rgba(139,92,246,0.9)',
                        }}
                      />
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-3">
                  <p
                    className="text-white/85 text-xs font-medium leading-tight line-clamp-2"
                    style={{ fontFamily: 'var(--font-sora)' }}
                  >
                    {book.title}
                  </p>
                  <p className="text-white/35 text-[10px] mt-0.5 truncate">{book.author}</p>
                  {progress[book.id] && (
                    <p className="text-purple-300/60 text-[9px] mt-1">
                      p.{progress[book.id].pageNumber} · {progressPct(book.id)}%
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}