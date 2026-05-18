'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { MoodId } from '@/types'

const MOOD_TRACKS: Record<string, {
  title: string
  artist: string
  vibe: string
  color: string
  bg: string
}> = {
  calm:     { title: 'Rainy Tokyo Nights',  artist: 'Ambient Collection', vibe: 'lo-fi · dreamy',      color: '#7dd3fc', bg: 'rgba(14,165,233,0.08)' },
  drifting: { title: 'Ocean at 3AM',        artist: 'Deep Ambient',       vibe: 'ocean · slow',        color: '#a5b4fc', bg: 'rgba(99,102,241,0.08)' },
  soft:     { title: 'Cherry Blossom Rain', artist: 'Soft Dreamscape',    vibe: 'gentle · tender',     color: '#fbcfe8', bg: 'rgba(236,72,153,0.08)' },
  alive:    { title: 'Electric Dawn',       artist: 'Morning Energy',     vibe: 'uplifting · bright',  color: '#6ee7b7', bg: 'rgba(52,211,153,0.08)' },
  joyful:   { title: 'Golden Hour',         artist: 'Warm Beats',         vibe: 'joyful · warm',       color: '#fde68a', bg: 'rgba(251,191,36,0.08)' },
  healing:  { title: 'Forest at Dawn',      artist: 'Nature Sounds',      vibe: 'healing · still',     color: '#bbf7d0', bg: 'rgba(134,239,172,0.08)' },
  anxious:  { title: 'Somewhere Quiet',     artist: 'Calm Frequencies',   vibe: 'grounding · slow',    color: '#fed7aa', bg: 'rgba(251,146,60,0.08)' },
  heavy:    { title: 'Let It Rain',         artist: 'Emotional Release',  vibe: 'deep · cathartic',    color: '#c4b5fd', bg: 'rgba(139,92,246,0.08)' },
  default:  { title: 'Soft Cloudscape',     artist: 'Lumina Radio',       vibe: 'ambient · comfort',   color: '#c4b5fd', bg: 'rgba(139,92,246,0.08)' },
}

const BAR_COUNT = 28

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

  const mins = Math.floor(progress * 214 / 60)
  const secs = Math.floor(progress * 214 % 60).toString().padStart(2, '0')
  const totalMins = 3
  const totalSecs = '34'

  return (
    <div
      className="rounded-[24px] overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${track.bg}, rgba(255,255,255,0.02))`,
        border: `1px solid ${track.color}18`,
      }}
    >
      {/* Top: track info */}
      <div className="px-5 pt-5 pb-4">
        <p className="text-[9px] uppercase tracking-[0.25em] mb-4" style={{ color: `${track.color}70` }}>
          Now playing
        </p>
        <div className="flex items-center gap-4">
          {/* Album art — abstract shape */}
          <motion.div
            className="flex-shrink-0 relative"
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 12, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
            style={{ width: 52, height: 52 }}
          >
            <div
              className="w-full h-full rounded-2xl"
              style={{
                background: `conic-gradient(from 0deg, ${track.color}40, rgba(255,255,255,0.03), ${track.color}20, rgba(255,255,255,0.06), ${track.color}40)`,
                border: `1px solid ${track.color}25`,
                boxShadow: isPlaying ? `0 0 20px ${track.color}30` : 'none',
              }}
            />
            <div
              className="absolute inset-[35%] rounded-full"
              style={{ background: 'rgba(10,8,20,0.9)' }}
            />
          </motion.div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium leading-tight truncate" style={{ color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.01em' }}>
              {track.title}
            </p>
            <p className="text-[11px] mt-1 truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {track.vibe}
            </p>
          </div>

          {/* Play button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setIsPlaying(p => !p)}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: isPlaying ? `${track.color}22` : 'rgba(255,255,255,0.07)',
              border: `1px solid ${isPlaying ? track.color + '40' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: isPlaying ? `0 0 16px ${track.color}30` : 'none',
            }}
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill={track.color}>
                <rect x="1" y="1" width="3.5" height="10" rx="1"/>
                <rect x="7.5" y="1" width="3.5" height="10" rx="1"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill={track.color}>
                <path d="M3 2l7 4-7 4V2z"/>
              </svg>
            )}
          </motion.button>
        </div>

        {/* Waveform visualizer */}
        <div className="flex gap-[2px] items-end mt-5" style={{ height: 32 }}>
          {Array.from({ length: BAR_COUNT }, (_, i) => {
            const base = Math.sin(i * 0.8) * 0.4 + Math.sin(i * 0.3) * 0.3 + 0.3
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  background: i / BAR_COUNT < progress
                    ? track.color
                    : `${track.color}28`,
                  minWidth: 2,
                }}
                animate={{
                  height: isPlaying
                    ? [`${base * 24 + 4}px`, `${base * 32 + 4}px`, `${base * 20 + 4}px`]
                    : `${base * 18 + 3}px`,
                }}
                transition={{
                  duration: 0.6 + (i % 5) * 0.15,
                  repeat: isPlaying ? Infinity : 0,
                  ease: 'easeInOut',
                  delay: i * 0.025,
                  repeatType: 'mirror',
                }}
              />
            )
          })}
        </div>

        {/* Time */}
        <div className="flex justify-between mt-2">
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.2)', fontVariantNumeric: 'tabular-nums' }}>
            {mins}:{secs}
          </span>
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {totalMins}:{totalSecs}
          </span>
        </div>
      </div>
    </div>
  )
}
