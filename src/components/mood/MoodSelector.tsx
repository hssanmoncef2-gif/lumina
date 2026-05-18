'use client'

import { motion } from 'framer-motion'
import type { MoodId } from '@/types'

const MOODS = [
  { id: 'alive'    as MoodId, label: 'Alive',   sub: 'electric',  color: '#6ee7b7', dark: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)' },
  { id: 'joyful'   as MoodId, label: 'Joyful',  sub: 'light',     color: '#fde68a', dark: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)' },
  { id: 'soft'     as MoodId, label: 'Soft',    sub: 'tender',    color: '#fbcfe8', dark: 'rgba(249,168,212,0.12)', border: 'rgba(249,168,212,0.25)' },
  { id: 'calm'     as MoodId, label: 'Calm',    sub: 'still',     color: '#bae6fd', dark: 'rgba(14,165,233,0.12)',  border: 'rgba(14,165,233,0.25)' },
  { id: 'drifting' as MoodId, label: 'Adrift',  sub: 'floating',  color: '#c4b5fd', dark: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.25)' },
  { id: 'healing'  as MoodId, label: 'Healing', sub: 'mending',   color: '#bbf7d0', dark: 'rgba(134,239,172,0.12)', border: 'rgba(134,239,172,0.25)' },
  { id: 'anxious'  as MoodId, label: 'Anxious', sub: 'spinning',  color: '#fed7aa', dark: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.25)' },
  { id: 'heavy'    as MoodId, label: 'Heavy',   sub: 'weighted',  color: '#a5b4fc', dark: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.25)' },
]

interface Props {
  currentMood: MoodId | null
  onMoodSelect: (mood: MoodId) => void
}

export default function MoodSelector({ currentMood, onMoodSelect }: Props) {
  return (
    <div className="px-5">
      <p className="text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: 'rgba(255,255,255,0.22)' }}>
        How does your heart feel?
      </p>
      <div className="grid grid-cols-4 gap-2">
        {MOODS.map((mood, i) => {
          const isActive = currentMood === mood.id
          return (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.045, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileTap={{ scale: 0.87 }}
              onClick={() => onMoodSelect(mood.id)}
              className="relative flex flex-col items-center gap-2.5 py-4 rounded-2xl transition-all duration-500"
              style={{
                background: isActive ? mood.dark : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isActive ? mood.border : 'rgba(255,255,255,0.055)'}`,
                boxShadow: isActive ? `0 4px 24px ${mood.dark}, 0 0 0 0.5px ${mood.border}` : 'none',
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
              }}
              aria-pressed={isActive}
            >
              {/* Color dot instead of emoji */}
              <motion.div
                className="rounded-full"
                style={{
                  width: isActive ? 10 : 8,
                  height: isActive ? 10 : 8,
                  background: isActive ? mood.color : 'rgba(255,255,255,0.2)',
                  boxShadow: isActive ? `0 0 10px ${mood.color}88` : 'none',
                }}
                animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 2.5, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
              />
              <span
                className="text-[10px] font-light tracking-wide leading-none"
                style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.32)' }}
              >
                {mood.label}
              </span>
              {isActive && (
                <span className="text-[8px] tracking-widest" style={{ color: `${mood.color}88` }}>
                  {mood.sub}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
