'use client'

import { motion } from 'framer-motion'
import type { MoodId } from '@/types'

const MOODS: Array<{
  id: MoodId
  emoji: string
  label: string
  sublabel: string
  activeGradient: string
  glowColor: string
  border: string
}> = [
  { id: 'alive',    emoji: '⚡', label: 'Alive',   sublabel: 'electric', activeGradient: 'linear-gradient(135deg, rgba(52,211,153,0.22), rgba(16,185,129,0.1))',  glowColor: 'rgba(52,211,153,0.5)',   border: 'rgba(52,211,153,0.35)' },
  { id: 'joyful',   emoji: '✨', label: 'Joyful',  sublabel: 'light',    activeGradient: 'linear-gradient(135deg, rgba(251,191,36,0.22), rgba(245,158,11,0.1))',   glowColor: 'rgba(251,191,36,0.5)',   border: 'rgba(251,191,36,0.35)' },
  { id: 'soft',     emoji: '🌸', label: 'Soft',    sublabel: 'tender',   activeGradient: 'linear-gradient(135deg, rgba(249,168,212,0.22), rgba(236,72,153,0.1))',  glowColor: 'rgba(249,168,212,0.5)',  border: 'rgba(249,168,212,0.35)' },
  { id: 'calm',     emoji: '🌊', label: 'Calm',    sublabel: 'still',    activeGradient: 'linear-gradient(135deg, rgba(14,165,233,0.22), rgba(56,189,248,0.1))',   glowColor: 'rgba(14,165,233,0.5)',   border: 'rgba(14,165,233,0.35)' },
  { id: 'drifting', emoji: '🌙', label: 'Adrift',  sublabel: 'floating', activeGradient: 'linear-gradient(135deg, rgba(129,140,248,0.22), rgba(99,102,241,0.1))',  glowColor: 'rgba(129,140,248,0.5)',  border: 'rgba(129,140,248,0.35)' },
  { id: 'healing',  emoji: '🌱', label: 'Healing', sublabel: 'mending',  activeGradient: 'linear-gradient(135deg, rgba(134,239,172,0.22), rgba(74,222,128,0.1))',  glowColor: 'rgba(134,239,172,0.5)',  border: 'rgba(134,239,172,0.35)' },
  { id: 'anxious',  emoji: '🌀', label: 'Anxious', sublabel: 'spinning', activeGradient: 'linear-gradient(135deg, rgba(251,146,60,0.22), rgba(249,115,22,0.1))',   glowColor: 'rgba(251,146,60,0.5)',   border: 'rgba(251,146,60,0.35)' },
  { id: 'heavy',    emoji: '🌧', label: 'Heavy',   sublabel: 'weighted', activeGradient: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(79,70,229,0.1))',    glowColor: 'rgba(99,102,241,0.5)',   border: 'rgba(99,102,241,0.35)' },
]

interface Props {
  currentMood: MoodId | null
  onMoodSelect: (mood: MoodId) => void
}

export default function MoodSelector({ currentMood, onMoodSelect }: Props) {
  return (
    <div className="px-5">
      <div
        className="rounded-[24px] p-4"
        style={{
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <p className="text-[10px] uppercase tracking-[0.14em] mb-3.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
          How does your heart feel right now?
        </p>

        <div className="grid grid-cols-4 gap-2">
          {MOODS.map((mood, i) => {
            const isActive = currentMood === mood.id
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileTap={{ scale: 0.88 }}
                onClick={() => onMoodSelect(mood.id)}
                className="relative flex flex-col items-center gap-1.5 py-3 rounded-[16px] transition-all duration-400"
                style={{
                  border: `1px solid ${isActive ? mood.border : 'rgba(255,255,255,0.07)'}`,
                  background: isActive ? mood.activeGradient : 'rgba(255,255,255,0.02)',
                  boxShadow: isActive ? `0 0 20px ${mood.glowColor}, 0 4px 12px rgba(0,0,0,0.3)` : 'none',
                  transform: isActive ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
                }}
                aria-pressed={isActive}
                aria-label={`Mood: ${mood.label}`}
              >
                <motion.span
                  className="text-[20px] leading-none"
                  animate={isActive ? {
                    scale: [1, 1.2, 1],
                    rotate: mood.id === 'alive' ? [0, 5, -5, 0] : 0,
                  } : { scale: 1 }}
                  transition={{ duration: 2.5, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
                >
                  {mood.emoji}
                </motion.span>
                <span
                  className="text-[9px] font-medium tracking-wide"
                  style={{ color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.35)' }}
                >
                  {mood.label}
                </span>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[8px] tracking-wider"
                    style={{ color: mood.glowColor }}
                  >
                    {mood.sublabel}
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
