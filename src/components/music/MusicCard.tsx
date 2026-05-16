'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { MoodId } from '@/types'

// Mood → track suggestions (will connect to real engine in Phase 4)
const MOOD_TRACKS: Record<string, { title: string; category: string; emoji: string; gradient: string }> = {
  calm:     { title: 'Rainy Tokyo Nights',   category: 'Dreamy ambient · lo-fi',    emoji: '🌊', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.22), rgba(59,130,246,0.16))' },
  drifting: { title: 'Ocean at 3AM',         category: 'Ocean calm · ambient',       emoji: '🌙', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.22), rgba(34,211,238,0.16))' },
  soft:     { title: 'Cherry Blossom Rain',  category: 'Soft dreamscape · gentle',   emoji: '🌸', gradient: 'linear-gradient(135deg, rgba(236,72,153,0.20), rgba(139,92,246,0.16))' },
  alive:    { title: 'Electric Dawn',        category: 'Motivation · uplifting',     emoji: '⚡', gradient: 'linear-gradient(135deg, rgba(34,197,94,0.20), rgba(59,130,246,0.16))' },
  heavy:    { title: 'Let It Rain',          category: 'Emotional release · healing', emoji: '🌧️', gradient: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(139,92,246,0.18))' },
  default:  { title: 'Soft Cloudscape',      category: 'Dreamy ambient · comfort',   emoji: '☁️', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.22), rgba(59,130,246,0.16))' },
}

// Animated visualizer bar heights
const BAR_HEIGHTS = [8,14,10,18,12,20,8,15,11,17,9,13,19,7,16]

interface Props {
  mood: MoodId | null
}

export default function MusicCard({ mood }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0.38)
  const track = MOOD_TRACKS[mood ?? 'default'] ?? MOOD_TRACKS.default

  // Simulate progress when playing
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress(p => p >= 1 ? 0 : p + 0.002)
    }, 100)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div
      className="rounded-[20px] p-4"
      style={{
        background: track.gradient,
        border: '0.5px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Label */}
      <p className="text-[10px] uppercase tracking-[0.1em] text-lumina-purple-soft/50 mb-2.5">
        Now playing
      </p>

      {/* Track row */}
      <div className="flex items-center gap-3">
        {/* Art */}
        <motion.div
          animate={isPlaying ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-11 h-11 rounded-[12px] flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.6), rgba(59,130,246,0.5))',
            boxShadow: isPlaying ? '0 0 20px rgba(139,92,246,0.4)' : 'none',
          }}
        >
          {track.emoji}
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-white/90 truncate">{track.title}</p>
          <p className="text-[10px] text-lumina-purple-soft/55 mt-0.5">{track.category}</p>
        </div>

        {/* Play/pause */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setIsPlaying(p => !p)}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '0.5px solid rgba(255,255,255,0.15)',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="text-xs text-white/80">{isPlaying ? '⏸' : '▶'}</span>
        </motion.button>
      </div>

      {/* Audio visualizer */}
      <div className="flex gap-[2px] items-end h-5 mt-3">
        {BAR_HEIGHTS.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm"
            style={{ background: 'rgba(167,139,250,0.5)' }}
            animate={isPlaying ? {
              height: [`${h * 0.4 + 2}px`, `${h}px`, `${h * 0.6 + 2}px`],
            } : {
              height: '3px',
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.04,
              repeatType: 'mirror',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-2.5 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #a78bfa, #60a5fa)' }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  )
}
