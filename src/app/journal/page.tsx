'use client'

// ============================================================
// LUMINA — Journal Home Page
// ============================================================

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AtmosphericBackground from '@/components/layout/AtmosphericBackground'
import FloatingParticles from '@/components/ui/FloatingParticles'
import BottomNav from '@/components/layout/BottomNav'
import JournalEntryCard from '@/components/journal/JournalEntryCard'
import { useJournalEntries } from '@/hooks/useJournal'
import { useLuminaStore } from '@/store/useAppStore'

const DEV_USER_ID = 'dev-user'

export default function JournalPage() {
  const router      = useRouter()
  const { data: session } = useSession()
  const currentMood = useLuminaStore(s => s.currentMood)
  const userId      = (session?.user as any)?.id ?? useLuminaStore.getState().user?.id ?? DEV_USER_ID
  const [isReady, setIsReady] = useState(false)
  const [filter, setFilter]   = useState<'all' | 'favorites'>('all')

  const { entries, isLoading, remove, toggleFav } = useJournalEntries(userId)

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const displayed = filter === 'favorites'
    ? entries.filter(e => e.isFavorite)
    : entries

  const totalWords = entries.reduce((acc, e) => {
    return acc + e.content.split(/\s+/).filter(Boolean).length
  }, 0)

  return (
    <main className="relative min-h-dvh overflow-hidden bg-lumina-void">
      <AtmosphericBackground mood={currentMood} />
      <FloatingParticles mood={currentMood} count={12} />

      <div className="relative z-content flex flex-col min-h-dvh">
        <div className="safe-top" />

        <AnimatePresence>
          {isReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col flex-1 pb-28"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="px-5 pt-4 pb-2 flex items-end justify-between"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-white/30 mb-1" style={{ fontFamily: 'var(--font-sora)' }}>
                    Your Journal
                  </p>
                  <h1 className="text-[24px] font-semibold leading-tight text-dreamy" style={{ fontFamily: 'var(--font-sora)' }}>
                    Your thoughts,<br />your space.
                  </h1>
                </div>

                {/* Write button */}
                <motion.button
                  onClick={() => router.push('/journal/new' as any)}
                  whileTap={{ scale: 0.93 }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[12px] font-medium"
                  style={{
                    background:  'linear-gradient(135deg, rgba(139,92,246,0.55), rgba(168,85,247,0.45))',
                    border:      '0.5px solid rgba(139,92,246,0.35)',
                    color:       'rgba(255,255,255,0.9)',
                    fontFamily:  'var(--font-sora)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <span>✦</span>
                  <span>New entry</span>
                </motion.button>
              </motion.div>

              {/* Stats bar */}
              {entries.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center gap-4 px-5 mt-3 mb-4"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[18px]">📖</span>
                    <div>
                      <p className="text-[16px] font-semibold text-white/80" style={{ fontFamily: 'var(--font-sora)' }}>
                        {entries.length}
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.07em] text-white/30">entries</p>
                    </div>
                  </div>
                  <div className="w-[0.5px] h-7 bg-white/08" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[18px]">✦</span>
                    <div>
                      <p className="text-[16px] font-semibold text-white/80" style={{ fontFamily: 'var(--font-sora)' }}>
                        {totalWords.toLocaleString()}
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.07em] text-white/30">words written</p>
                    </div>
                  </div>
                  <div className="w-[0.5px] h-7 bg-white/08" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[18px]">♥</span>
                    <div>
                      <p className="text-[16px] font-semibold text-white/80" style={{ fontFamily: 'var(--font-sora)' }}>
                        {entries.filter(e => e.isFavorite).length}
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.07em] text-white/30">favorites</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Filter tabs */}
              {entries.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="flex items-center gap-2 px-5 mb-4"
                >
                  {(['all', 'favorites'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="text-[10px] uppercase tracking-[0.09em] px-3.5 py-1.5 rounded-full transition-all"
                      style={{
                        fontFamily:  'var(--font-sora)',
                        background:  filter === f ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                        border:      `0.5px solid ${filter === f ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        color:       filter === f ? 'rgba(196,181,253,0.9)' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {f === 'all' ? 'All entries' : '♥ Favorites'}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Entry list */}
              <div className="px-5 flex-1">
                {isLoading ? (
                  <div className="flex flex-col gap-2.5 mt-2">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="h-24 rounded-2xl animate-pulse"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      />
                    ))}
                  </div>
                ) : displayed.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {displayed.map((entry, i) => (
                      <JournalEntryCard
                        key={entry.id}
                        entry={entry}
                        index={i}
                        onToggleFav={toggleFav}
                        onDelete={remove}
                      />
                    ))}
                  </motion.div>
                ) : entries.length === 0 ? (
                  /* Empty state */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="flex flex-col items-center text-center pt-16 pb-8"
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-5 text-3xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.18), rgba(139,92,246,0.04))',
                        border: '0.5px solid rgba(139,92,246,0.2)',
                      }}
                    >
                      📖
                    </div>
                    <p
                      className="text-[16px] font-medium mb-2"
                      style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sora)' }}
                    >
                      Your journal awaits
                    </p>
                    <p
                      className="text-[13px] leading-relaxed mb-6 max-w-[240px]"
                      style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-nunito)' }}
                    >
                      This is your private space. Write whatever is in your heart — there are no rules here.
                    </p>
                    <motion.button
                      onClick={() => router.push('/journal/new' as any)}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-2xl text-[13px] font-medium"
                      style={{
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.6), rgba(168,85,247,0.5))',
                        border:     '0.5px solid rgba(139,92,246,0.35)',
                        color:      'rgba(255,255,255,0.9)',
                        fontFamily: 'var(--font-sora)',
                      }}
                    >
                      Write your first entry ✦
                    </motion.button>
                  </motion.div>
                ) : (
                  /* No favorites */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center pt-16"
                  >
                    <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-nunito)' }}>
                      No favorites yet. Tap ♡ on any entry.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav />
      </div>
    </main>
  )
}
