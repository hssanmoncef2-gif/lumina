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
        className="relative rounded-[28px] p-5 overflow-hidden"
        style={{
          background:
            'linear-gradient(160deg, rgba(255,234,206,0.045) 0%, rgba(232,168,140,0.025) 60%, rgba(220,180,160,0.02) 100%)',
          border: '1px solid rgba(252,207,158,0.10)',
          backdropFilter: 'blur(20px) saturate(115%)',
          boxShadow: '0 24px 60px -28px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,234,206,0.06)',
        }}
      >
        {/* candle glow at top */}
        <div
          className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-40"
          style={{ background: 'radial-gradient(ellipse, rgba(252,178,110,0.25), transparent 65%)', filter: 'blur(20px)' }}
        />

        <div className="relative flex items-center gap-3 mb-5">
          <span className="ornament-rule" />
          <p
            className="text-[12px] tracking-wide"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'rgba(248,226,198,0.7)' }}
          >
            how does your heart feel right now?
          </p>
          <span className="ornament-rule" />
        </div>

        <div className="relative grid grid-cols-4 gap-2.5">
          {MOODS.map((mood, i) => {
            const isActive = currentMood === mood.id
            const dimmed = currentMood !== null && !isActive
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: dimmed ? 0.35 : 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onMoodSelect(mood.id)}
                className="relative flex flex-col items-center gap-2 py-3.5 rounded-[20px]"
                style={{
                  border: `1px solid ${isActive ? mood.border : 'rgba(252,207,158,0.08)'}`,
                  background: isActive
                    ? mood.activeGradient
                    : 'linear-gradient(160deg, rgba(255,234,206,0.02), rgba(255,200,168,0.008))',
                  boxShadow: isActive
                    ? `0 0 28px ${mood.glowColor}, 0 12px 28px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,234,206,0.18)`
                    : 'none',
                  transform: isActive ? 'translateY(-4px) scale(1.04)' : 'translateY(0) scale(1)',
                  transition: 'transform 700ms cubic-bezier(0.22,0.61,0.36,1), box-shadow 900ms ease, background 900ms ease, border-color 900ms ease, opacity 900ms ease',
                }}
                aria-pressed={isActive}
                aria-label={`Mood: ${mood.label}`}
              >
                <motion.span
                  className="text-[22px] leading-none"
                  animate={isActive ? {
                    scale: [1, 1.18, 1],
                    rotate: mood.id === 'alive' ? [0, 4, -4, 0] : 0,
                  } : { scale: 1 }}
                  transition={{ duration: 3.5, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
                >
                  {mood.emoji}
                </motion.span>
                <span
                  className="text-[10px] tracking-wide"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: isActive ? 400 : 300,
                    color: isActive ? '#fff2d8' : 'rgba(232,210,188,0.5)',
                  }}
                >
                  {mood.label}
                </span>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 0.85, height: 'auto' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-[8px] tracking-[0.18em] uppercase font-light"
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
