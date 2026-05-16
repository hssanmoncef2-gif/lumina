'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AtmosphericBackground from '@/components/layout/AtmosphericBackground'
import FloatingParticles from '@/components/ui/FloatingParticles'
import BottomNav from '@/components/layout/BottomNav'
import { useLuminaStore } from '@/store/useAppStore'
import { useMoodHistory } from '@/hooks/useMoodHistory'
import { toast } from '@/components/ui/Toast'
import { signOut } from '@/lib/auth'
import type { MoodId } from '@/types'

const MOOD_COLORS: Record<MoodId, string> = {
  calm:'#a78bfa', drifting:'#60a5fa', soft:'#f9a8d4', alive:'#34d399',
  heavy:'#6366f1', anxious:'#fb923c', joyful:'#fbbf24', healing:'#86efac',
}
const MOOD_LABELS: Record<MoodId, string> = {
  calm:'Calm', drifting:'Drifting', soft:'Soft', alive:'Alive',
  heavy:'Heavy', anxious:'Anxious', joyful:'Joyful', healing:'Healing',
}
const DAY_LABELS = ['S','M','T','W','T','F','S']

export default function ProfilePage() {
  const router      = useRouter()
  const { data: session } = useSession()
  const currentMood = useLuminaStore((s) => s.currentMood)
  const setUser     = useLuminaStore((s) => s.setUser)
  const [totalEntries, setTotalEntries] = useState(0)
  const [signingOut,   setSigningOut]   = useState(false)

  const userId      = (session?.user as any)?.id as string | undefined
  const displayName = (session?.user as any)?.displayName || session?.user?.name || 'You'

  useEffect(() => {
    if (!userId) return
    fetch(`/api/journal?userId=${userId}`)
      .then(r => r.json())
      .then((data: any[]) => setTotalEntries(data.length))
      .catch(() => {})
  }, [userId])

  const { history, trend, isLoading: moodLoading } = useMoodHistory(userId ?? null)

  const thirtyDayGrid = useMemo((): (MoodId | null)[] => {
    const grid: (MoodId | null)[] = Array(30).fill(null)
    const today = new Date(); today.setHours(0,0,0,0)
    for (const entry of history) {
      const d = new Date(entry.createdAt); d.setHours(0,0,0,0)
      const daysAgo = Math.round((today.getTime() - d.getTime()) / 86_400_000)
      if (daysAgo >= 0 && daysAgo < 30) grid[29 - daysAgo] = entry.moodId
    }
    return grid
  }, [history])

  const daysTracked = thirtyDayGrid.filter(Boolean).length
  const streak      = trend?.streak ?? 0
  const topMood     = trend?.dominantMood ?? null

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
  thirtyDaysAgo.setHours(0,0,0,0)
  const startDow = thirtyDaysAgo.getDay()

  const handleSignOut = useCallback(async () => {
    setSigningOut(true)
    setUser(null)
    try { localStorage.removeItem('lumina_onboarding_done') } catch {}
    toast.success('Signed out. See you soon 🌙')
    await signOut()
  }, [setUser])

  return (
    <main className="relative min-h-dvh overflow-hidden bg-lumina-void">
      <AtmosphericBackground mood={currentMood} />
      <FloatingParticles mood={currentMood} count={8} />

      <div className="relative z-10 flex flex-col min-h-dvh">
        <div className="px-5" style={{ paddingTop: 'max(env(safe-area-inset-top), 20px)', paddingBottom: '8px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[10px] uppercase tracking-[0.14em] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Your space</p>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-light" style={{ fontFamily: 'var(--font-nunito)', color: 'rgba(255,255,255,0.88)' }}>{displayName}</h1>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))', border: '0.5px solid rgba(255,255,255,0.12)' }}>🤍</div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-4 mt-2">

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-3 gap-2.5">
            {[
              { label: 'day streak', value: moodLoading ? '–' : streak, emoji: '🔥' },
              { label: 'entries', value: totalEntries, emoji: '📖' },
              { label: 'days tracked', value: moodLoading ? '–' : daysTracked, emoji: '✦' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                className="rounded-[16px] p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                <div className="text-lg mb-1">{stat.emoji}</div>
                <div className="text-xl font-light" style={{ fontFamily: 'var(--font-sora)', color: 'rgba(196,181,253,0.9)' }}>{stat.value}</div>
                <div className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mood calendar */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-[20px] p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-light" style={{ color: 'rgba(255,255,255,0.55)' }}>Last 30 days</p>
              {topMood && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: MOOD_COLORS[topMood] }} />
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.28)' }}>mostly {MOOD_LABELS[topMood]}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1.5">
              {DAY_LABELS.map((d, i) => <div key={i} className="text-center text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDow }).map((_, i) => <div key={`e${i}`} />)}
              {thirtyDayGrid.map((mood, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.012 }}
                  className="aspect-square rounded-[6px] flex items-center justify-center"
                  style={{ background: mood ? `${MOOD_COLORS[mood]}28` : 'rgba(255,255,255,0.03)', border: i === 29 ? '1px solid rgba(255,255,255,0.25)' : '0.5px solid transparent' }}>
                  {mood && <div className="w-2 h-2 rounded-full" style={{ background: MOOD_COLORS[mood], opacity: 0.75 }} />}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-[20px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
            {[
              { emoji: '✉️', label: 'Letters from Lumina', href: '/letters' },
              { emoji: '🫧', label: 'Comfort Mode', href: '/comfort' },
              { emoji: '📖', label: 'My Journal', href: '/journal' },
              { emoji: '✨', label: 'Replay Onboarding', href: '/onboarding' },
            ].map((item, i, arr) => (
              <motion.button key={item.href} onClick={() => router.push(item.href as any)} whileTap={{ scale: 0.99 }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                style={{ borderBottom: i < arr.length - 1 ? '0.5px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span className="text-base">{item.emoji}</span>
                <span className="text-sm font-light flex-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.label}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>→</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Sign out */}
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            onClick={handleSignOut} disabled={signingOut} aria-label="Sign out"
            className="w-full py-3 text-sm font-light rounded-[14px] transition-all"
            style={{ color: signingOut ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', letterSpacing: '0.05em' }}>
            {signingOut ? 'signing out…' : 'sign out'}
          </motion.button>

        </div>
        <BottomNav />
      </div>
    </main>
  )
}
