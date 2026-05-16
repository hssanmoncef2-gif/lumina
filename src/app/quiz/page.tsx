'use client'

// ============================================================
// LUMINA — /quiz: Full mood quiz page
// ============================================================

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import AtmosphericBackground from '@/components/layout/AtmosphericBackground'
import FloatingParticles from '@/components/ui/FloatingParticles'
import MoodQuiz from '@/components/mood/MoodQuiz'
import { getUser } from '@/lib/auth'
import { useLuminaStore } from '@/store/useAppStore'
import type { QuizResult, MoodId } from '@/types'

export default function QuizPage() {
  const router = useRouter()
  const { setMood, setAmbient } = useLuminaStore()

  const [userId, setUserId]   = useState<string | undefined>(undefined)
  const [started, setStarted] = useState(false)
  const [isDone, setIsDone]   = useState(false)

  useEffect(() => {
    getUser().then(u => { if (u) setUserId(u.id) })
  }, [])

  const handleComplete = useCallback((result: QuizResult) => {
    // Update global store
    setMood(result.primaryMood)

    // Map ambient mode → gradient (simplified; full ambient engine is Phase 5)
    const ambientGradients: Record<string, string> = {
      'ocean-twilight':  'linear-gradient(135deg, #0c2340, #0e3354, #0a1a30)',
      'deep-night':      'linear-gradient(135deg, #0a0618, #0e0a1f, #050310)',
      'foggy-morning':   'linear-gradient(135deg, #1a1535, #2a1f4a, #151030)',
      'golden-hour':     'linear-gradient(135deg, #1a0e05, #2d1a0a, #1a1008)',
      'rainy-night':     'linear-gradient(135deg, #050a1a, #0a0f25, #070c1f)',
      'dusk':            'linear-gradient(135deg, #1a0820, #0f0d25, #0d0818)',
      'night-city':      'linear-gradient(135deg, #080612, #0e0a1f, #0d1535)',
    }
    setAmbient({
      mode: result.recommendedAmbient,
      bgGradient: ambientGradients[result.recommendedAmbient] ?? ambientGradients['night-city'],
    })

    setIsDone(true)
    setTimeout(() => {
      router.push('/')
    }, 1800)
  }, [setMood, setAmbient, router])

  return (
    <main className="relative min-h-dvh overflow-hidden bg-lumina-void">
      {/* Atmospheric BG */}
      <AtmosphericBackground mood={null} />
      <FloatingParticles mood={null} count={14} />

      <div className="relative z-content flex flex-col min-h-dvh">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-safe-top pt-4 pb-2">
          <button
            onClick={() => router.back()}
            className="p-2 text-white/30 hover:text-white/60 transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M14 4l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-light text-white/40"
          >
            mood check-in
          </motion.p>

          <div className="w-9" /> {/* spacer */}
        </div>

        {/* Intro or quiz */}
        <div className="flex-1 flex flex-col items-center justify-center pt-4">
          <AnimatePresence mode="wait">
            {!started && !isDone ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="flex flex-col items-center gap-7 px-6 text-center max-w-xs"
              >
                {/* Icon */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-6xl"
                >
                  🌙
                </motion.div>

                <div className="space-y-3">
                  <h1 className="text-2xl font-light text-white/90">
                    How are you feeling?
                  </h1>
                  <p className="text-sm text-white/40 leading-relaxed font-light">
                    5 questions. No judgment. Just you and this moment.
                  </p>
                </div>

                <button
                  onClick={() => setStarted(true)}
                  className="w-full py-4 rounded-2xl font-medium text-sm text-white/90
                    border border-white/12 transition-all hover:border-white/25 hover:bg-white/6
                    active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.22), rgba(99,102,241,0.18))',
                  }}
                >
                  Begin check-in
                </button>

                <p className="text-xs text-white/20">
                  Takes about 30 seconds
                </p>
              </motion.div>
            ) : isDone ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl"
                >
                  ✨
                </motion.div>
                <p className="text-white/60 font-light text-sm">
                  Taking you home…
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-sm"
              >
                <MoodQuiz userId={userId} onComplete={handleComplete} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  )
}
