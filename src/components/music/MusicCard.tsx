'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { MoodId } from '@/types'

const MOOD_TRACKS: Record<string, { title: string; category: string; emoji: string; color: string; bg: string }> = {
  calm:     { title: 'Rainy Tokyo Nights',  category: 'Dreamy ambient · lo-fi',     emoji: '🌊', color: '#7dd3fc', bg: 'linear-gradient(135deg, rgba(14,165,233,0.18), rgba(56,189,248,0.08))' },
  drifting: { title: 'Ocean at 3AM',        category: 'Ocean calm · ambient',        emoji: '🌙', color: '#a5b4fc', bg: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(129,140,248,0.08))' },
  soft:     { title: 'Cherry Blossom Rain', category: 'Soft dreamscape · gentle',    emoji: '🌸', color: '#fbcfe8', bg: 'linear-gradient(135deg, rgba(236,72,153,0.18), rgba(249,168,212,0.08))' },
  alive:    { title: 'Electric Dawn',       category: 'Motivation · uplifting',      emoji: '⚡', color: '#6ee7b7', bg: 'linear-gradient(135deg, rgba(52,211,153,0.18), rgba(16,185,129,0.08))' },
  joyful:   { title: 'Golden Hour',         category: 'Warm · uplifting',            emoji: '✨', color: '#fde68a', bg: 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.08))' },
  healing:  { title: 'Forest at Dawn',      category: 'Healing · nature',            emoji: '🌱', color: '#86efac', bg: 'linear-gradient(135deg, rgba(134,239,172,0.18), rgba(74,222,128,0.08))' },
  anxious:  { title: 'Somewhere Quiet',     category: 'Grounding · slow',            emoji: '🌀', color: '#fed7aa', bg: 'linear-gradient(135deg, rgba(251,146,60,0.18), rgba(249,115,22,0.08))' },
  heavy:    { title: 'Let It Rain',         category: 'Emotional release · healing', emoji: '🌧️', color: '#c4b5fd', bg: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.08))' },
  default:  { title: 'Soft Cloudscape',     category: 'Dreamy ambient · comfort',    emoji: '☁️', color: '#c4b5fd', bg: 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(59,130,246,0.08))' },
}

const BAR_COUNT = 32

interface Props { mood: MoodId | null }

export default function MusicCard({ mood }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0.31)
  const track = MOOD_TRACKS[mood ?? 'default'] ?? MOOD_TRACKS.default

  useEffect(() => {
    if (!isPlaying) return
    const t = setInterval(() => setProgress(p => p >= 1 ? 0 : p + 0.0015), 100)
    return () => clearInterval(t)
  }, [isPlaying])

  const elapsed = Math.floor(progress * 214)
  const mins = Math.floor(elapsed / 60)
  const secs = (elapsed % 60).toString().padStart(2, '0')

  return (
    <div
      className="rounded-[24px] overflow-hidden"
      style={{
        background: track.bg,
        border: `1px solid ${track.color}22`,
        boxShadow: isPlaying ? `0 8px 32px ${track.color}18` : 'none',
        transition: 'box-shadow 0.6s ease',
      }}
    >
      <div className="px-5 pt-5 pb-5">
        <p className="text-[9px] uppercase tracking-[0.22em] mb-4" style={{ color: `${track.color}80` }}>
          Now playing
        </p>

        <div className="flex items-center gap-3.5 mb-4">
          {/* Vinyl / cassette — abstract atmospheric disc */}
          <motion.div
            className="relative flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center"
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 14, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
            style={{
              background: `radial-gradient(circle at 30% 30%, ${track.color}55 0%, ${track.color}18 38%, rgba(8,6,12,0.95) 70%, ${track.color}15 100%)`,
              border: `1px solid ${track.color}35`,
              boxShadow: isPlaying
                ? `0 0 26px ${track.color}50, inset 0 0 18px rgba(0,0,0,0.5)`
                : `0 8px 20px -8px rgba(0,0,0,0.6), inset 0 0 14px rgba(0,0,0,0.4)`,
            }}
          >
            {/* concentric grooves */}
            <div className="absolute inset-1 rounded-full" style={{ border: `1px solid ${track.color}18` }} />
            <div className="absolute inset-3 rounded-full" style={{ border: `1px solid ${track.color}12` }} />
            {/* center label */}
            <div
              className="absolute inset-[38%] rounded-full"
              style={{
                background: `radial-gradient(circle, ${track.color}80, ${track.color}30)`,
                boxShadow: `0 0 8px ${track.color}60`,
              }}
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }}>
              {track.title}
            </p>
            <p className="text-[10px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.32)' }}>
              {track.category}
            </p>
          </div>

          {/* Play button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setIsPlaying(p => !p)}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: isPlaying ? track.color : 'rgba(255,255,255,0.1)',
              boxShadow: isPlaying ? `0 0 20px ${track.color}60` : 'none',
            }}
          >
            {isPlaying ? (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="rgba(0,0,0,0.8)">
                <rect x="1" y="1" width="3" height="9" rx="1"/>
                <rect x="7" y="1" width="3" height="9" rx="1"/>
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 11 11" fill={track.color}>
                <path d="M2.5 1.5l7 4-7 4V1.5z"/>
              </svg>
            )}
          </motion.button>
        </div>

        {/* Waveform */}
        <div className="flex gap-[2px] items-end mb-2" style={{ height: 36 }}>
          {Array.from({ length: BAR_COUNT }, (_, i) => {
            const wave = Math.sin(i * 0.7) * 0.35 + Math.sin(i * 0.3 + 1) * 0.25 + Math.sin(i * 1.3) * 0.15 + 0.35
            const played = i / BAR_COUNT < progress
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  background: played ? track.color : `${track.color}28`,
                  minWidth: 1.5,
                }}
                animate={{
                  height: isPlaying
                    ? [`${wave * 28 + 4}px`, `${wave * 36 + 4}px`, `${wave * 22 + 4}px`]
                    : `${wave * 20 + 3}px`,
                }}
                transition={{
                  duration: 0.55 + (i % 6) * 0.12,
                  repeat: isPlaying ? Infinity : 0,
                  ease: 'easeInOut',
                  delay: i * 0.022,
                  repeatType: 'mirror',
                }}
              />
            )
          })}
        </div>

        {/* Time */}
        <div className="flex justify-between">
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.22)', fontVariantNumeric: 'tabular-nums' }}>
            {mins}:{secs}
          </span>
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.22)' }}>3:34</span>
        </div>
      </div>
    </div>
  )
}
