'use client'

import { motion } from 'framer-motion'
import type { MoodId } from '@/types'

const MOODS: Array<{
  id: MoodId
  emoji: string
  label: string
  activeGradient: string
}> = [
  { id: 'calm',     emoji: '🌙', label: 'calm',     activeGradient: 'rgba(167,139,250,0.18)' },
  { id: 'drifting', emoji: '🌊', label: 'drifting', activeGradient: 'rgba(96,165,250,0.18)' },
  { id: 'soft',     emoji: '🌸', label: 'soft',     activeGradient: 'rgba(249,168,212,0.18)' },
  { id: 'alive',    emoji: '⚡', label: 'alive',    activeGradient: 'rgba(52,211,153,0.18)' },
  { id: 'heavy',    emoji: '🌧️', label: 'heavy',    activeGradient: 'rgba(99,102,241,0.18)' },
]

interface Props {
  currentMood: MoodId | null
  onMoodSelect: (mood: MoodId) => void
}

export default function MoodSelector({ currentMood, onMoodSelect }: Props) {
  return (
    <div className="px-5">
      <div
        className="rounded-[20px] p-4"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Label */}
        <p className="text-[10px] uppercase tracking-[0.1em] text-lumina-purple-dream/50 mb-3">
          How does your heart feel right now?
        </p>

        {/* Mood buttons */}
        <div className="flex gap-2 justify-between">
          {MOODS.map((mood, i) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onMoodSelect(mood.id)}
              className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-[14px] transition-all duration-300"
              style={{
                border: `0.5px solid ${currentMood === mood.id ? 'rgba(167,139,250,0.45)' : 'rgba(255,255,255,0.09)'}`,
                background: currentMood === mood.id ? mood.activeGradient : 'transparent',
                transform: currentMood === mood.id ? 'translateY(-2px)' : 'none',
              }}
              aria-pressed={currentMood === mood.id}
              aria-label={`Mood: ${mood.label}`}
            >
              <span className="text-[18px] leading-none">{mood.emoji}</span>
              <span
                className="text-[9px] font-light tracking-wide"
                style={{
                  color: currentMood === mood.id ? 'rgba(200,170,255,0.95)' : 'rgba(255,255,255,0.38)',
                }}
              >
                {mood.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
