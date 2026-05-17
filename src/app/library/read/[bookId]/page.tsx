'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

// ============================================================
// We use PDF.js via CDN — no install needed
// ============================================================
declare global {
  interface Window { pdfjsLib: any }
}

const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

async function fetchGutenbergText(id: number): Promise<string> {
  const res = await fetch(`/api/library/gutenberg?id=${id}`)
  if (!res.ok) throw new Error('Failed')
  const text = await res.text()
  if (text.length < 500) throw new Error('Too short')
  return text
}

// ============================================================
// Component
// ============================================================
export default function ReaderPage() {
  const router = useRouter()
  const params = useParams()
  const search = useSearchParams()
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id ?? session?.user?.email ?? ''

  const bookId   = decodeURIComponent(params.bookId as string)
  const title    = search.get('title') ?? 'Book'
  const author   = search.get('author') ?? ''
  const source   = search.get('source') as 'supabase' | 'openlibrary' | 'gutenberg'
  const fileUrl  = search.get('fileUrl') ?? ''
  const gutId    = search.get('gutenbergId') ? Number(search.get('gutenbergId')) : null
  const coverUrl = search.get('coverUrl') ?? ''

  // PDF state
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const pdfRef      = useRef<any>(null)
  const renderTask  = useRef<any>(null)

  const [currentPage, setCurrentPage]   = useState(1)
  const [totalPages, setTotalPages]     = useState(0)
  const [isLoading, setIsLoading]       = useState(true)
  const [error, setError]               = useState('')
  const [savedPage, setSavedPage]       = useState<number | null>(null)
  const [saveStatus, setSaveStatus]     = useState<'idle' | 'saving' | 'saved'>('idle')
  const [showControls, setShowControls] = useState(true)
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Text mode (Gutenberg)
  const [textContent, setTextContent]   = useState('')
  const [isTextMode, setIsTextMode]     = useState(false)

  // ── Load PDF.js ──────────────────────────────────────────────
  useEffect(() => {
    if (window.pdfjsLib) { initReader(); return }
    const s = document.createElement('script')
    s.src = PDFJS_CDN
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER
      initReader()
    }
    document.head.appendChild(s)
  }, [])

  async function initReader() {
    // Load saved progress first
    if (userId) {
      try {
        const res = await fetch(`/api/library/progress?userId=${userId}`)
        const data = await res.json()
        const found = Array.isArray(data) ? data.find((p: any) => p.bookId === bookId) : null
        if (found) {
          setSavedPage(found.pageNumber)
          setCurrentPage(found.pageNumber)
        }
      } catch {}
    }

    if (source === 'gutenberg' && gutId) {
      await loadGutenbergText(gutId)
    } else if (source === 'supabase' && fileUrl) {
      await loadPDF(fileUrl)
    } else {
      setError('No readable source found for this book.')
      setIsLoading(false)
    }
  }

  async function loadGutenbergText(id: number) {
    setIsTextMode(true)
    setIsLoading(true)
    try {
      const text = await fetchGutenbergText(id)
      const chunks: string[] = []
      for (let i = 0; i < text.length; i += 2000) chunks.push(text.slice(i, i + 2000))
      setTextContent(text)
      setTotalPages(chunks.length)
    } catch (e) {
      setError('Could not load book text. Try again.')
    }
    setIsLoading(false)
  }

  async function loadPDF(url: string) {
    setIsTextMode(false)
    setIsLoading(true)
    try {
      const pdf = await window.pdfjsLib.getDocument({ url }).promise
      pdfRef.current = pdf
      setTotalPages(pdf.numPages)
      setIsLoading(false)
    } catch (e) {
      setError('Could not load PDF. Make sure the file is public in Supabase.')
      setIsLoading(false)
    }
  }

  // ── Render PDF page ──────────────────────────────────────────
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfRef.current || !canvasRef.current || isTextMode) return
    if (renderTask.current) { try { renderTask.current.cancel() } catch {} }

    const page = await pdfRef.current.getPage(pageNum)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const devicePixelRatio = window.devicePixelRatio || 1
    const viewport = page.getViewport({ scale: 1 })

    const containerW = Math.min(window.innerWidth, 600)
    const scale = (containerW / viewport.width) * devicePixelRatio
    const scaledViewport = page.getViewport({ scale })

    canvas.width  = scaledViewport.width
    canvas.height = scaledViewport.height
    canvas.style.width  = `${scaledViewport.width / devicePixelRatio}px`
    canvas.style.height = `${scaledViewport.height / devicePixelRatio}px`

    renderTask.current = page.render({ canvasContext: ctx, viewport: scaledViewport })
    try { await renderTask.current.promise } catch {}
  }, [isTextMode])

  useEffect(() => {
    if (!isLoading && !isTextMode) renderPage(currentPage)
  }, [currentPage, isLoading, isTextMode, renderPage])

  // ── Save progress ────────────────────────────────────────────
  async function saveProgress() {
    if (!userId) return
    setSaveStatus('saving')
    try {
      await fetch('/api/library/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          bookId,
          source,
          pageNumber: currentPage,
          totalPages,
          title,
          coverUrl,
        }),
      })
      setSavedPage(currentPage)
      setSaveStatus('saved')
    } catch {}
    setTimeout(() => setSaveStatus('idle'), 2000)
  }

  // ── Auto-hide controls ───────────────────────────────────────
  function bumpControls() {
    setShowControls(true)
    if (controlsTimer.current) clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => setShowControls(false), 4000)
  }

  useEffect(() => { bumpControls() }, [])

  // ── Text page slice ──────────────────────────────────────────
  const PAGE_SIZE = 2000
  const textPage = textContent.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // ── Navigation helpers ───────────────────────────────────────
  function goNext() {
    if (currentPage < totalPages) { setCurrentPage(p => p + 1); bumpControls() }
  }
  function goPrev() {
    if (currentPage > 1) { setCurrentPage(p => p - 1); bumpControls() }
  }

  return (
    <main
      className="relative min-h-dvh flex flex-col"
      style={{ background: '#0a0812' }}
      onClick={bumpControls}
    >
      {/* ── Top bar ── */}
      <div
        className="fixed top-0 left-0 right-0 z-30 transition-all duration-300"
        style={{
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none',
          background: 'linear-gradient(to bottom, rgba(8,6,18,0.95), transparent)',
          backdropFilter: 'blur(12px)',
          padding: '12px 16px 24px',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/library')}
            className="flex items-center justify-center w-9 h-9 rounded-full text-white/60 hover:text-white/90 transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-white/85 text-sm font-medium truncate" style={{ fontFamily: 'var(--font-sora)' }}>{title}</p>
            <p className="text-white/35 text-[10px] truncate">{author}</p>
          </div>
          {/* Save button */}
          <button
            onClick={saveProgress}
            disabled={saveStatus === 'saving' || !userId}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              fontFamily: 'var(--font-sora)',
              background: saveStatus === 'saved'
                ? 'rgba(34,197,94,0.3)'
                : 'rgba(139,92,246,0.3)',
              border: `1px solid ${saveStatus === 'saved' ? 'rgba(34,197,94,0.5)' : 'rgba(139,92,246,0.5)'}`,
              color: saveStatus === 'saved' ? 'rgba(134,239,172,0.9)' : 'rgba(196,181,253,0.9)',
            }}
          >
            {saveStatus === 'saving' ? '…' : saveStatus === 'saved' ? '✓ Saved' : '🔖 Save'}
          </button>
        </div>
        {/* Progress bar */}
        {totalPages > 0 && (
          <div className="mt-3 h-0.5 bg-white/10 rounded-full mx-1">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(currentPage / totalPages) * 100}%`,
                background: 'rgba(139,92,246,0.8)',
              }}
            />
          </div>
        )}
        {savedPage && savedPage !== currentPage && (
          <button
            onClick={() => setCurrentPage(savedPage)}
            className="mt-1.5 text-[10px] text-purple-300/60 hover:text-purple-300/90 transition-colors"
          >
            Jump to saved page {savedPage}
          </button>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col items-center pt-20 pb-24">
        {isLoading && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3">
            <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
            <p className="text-white/40 text-sm">Loading book…</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 px-8 text-center">
            <p className="text-3xl">😔</p>
            <p className="text-white/60 text-sm">{error}</p>
            <button onClick={() => router.push('/library')} className="text-purple-300/70 text-xs underline">
              Back to Library
            </button>
          </div>
        )}

        {/* PDF canvas */}
        {!isLoading && !error && !isTextMode && (
          <div className="w-full max-w-[600px] px-2">
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl shadow-2xl"
              style={{ background: '#1a1625' }}
            />
          </div>
        )}

        {/* Text mode (Gutenberg) */}
        {!isLoading && !error && isTextMode && (
          <div
            className="w-full max-w-[600px] px-6 py-6 mx-4 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p
              className="text-white/75 text-sm leading-relaxed whitespace-pre-wrap"
              style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', lineHeight: '1.9' }}
            >
              {textPage}
            </p>
          </div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 transition-all duration-300"
        style={{
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none',
          background: 'linear-gradient(to top, rgba(8,6,18,0.97), transparent)',
          backdropFilter: 'blur(12px)',
          padding: '24px 24px 36px',
        }}
      >
        <div className="flex items-center justify-between max-w-[400px] mx-auto">
          {/* Prev */}
          <button
            onClick={goPrev}
            disabled={currentPage <= 1}
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all disabled:opacity-20"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            ‹
          </button>

          {/* Page indicator + jump */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-white/60 text-xs" style={{ fontFamily: 'var(--font-sora)' }}>
              {currentPage} / {totalPages || '…'}
            </p>
            {totalPages > 10 && (
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={e => {
                  const v = Number(e.target.value)
                  if (v >= 1 && v <= totalPages) setCurrentPage(v)
                }}
                className="w-16 text-center bg-transparent border border-white/10 rounded-lg text-white/50 text-xs px-2 py-0.5 outline-none"
              />
            )}
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            disabled={currentPage >= totalPages}
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all disabled:opacity-20"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            ›
          </button>
        </div>
      </div>
    </main>
  )
}