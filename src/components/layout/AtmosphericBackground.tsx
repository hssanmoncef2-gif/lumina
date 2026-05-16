'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { MoodId } from '@/types'

// Mood → background gradient mappings
const MOOD_GRADIENTS: Record<string, string[]> = {
  calm:     ['#0f0520', '#150825', '#0d1535', '#0a1520'],
  drifting: ['#0a1525', '#0d1e35', '#0a1a30', '#081520'],
  soft:     ['#1a0828', '#1a0d35', '#150a28', '#100820'],
  alive:    ['#0a1a15', '#0d2520', '#0a1f18', '#081510'],
  heavy:    ['#100820', '#0d0a25', '#12082a', '#0a0818'],
  anxious:  ['#1a0e08', '#1a1208', '#150e08', '#100a06'],
  joyful:   ['#1a1508', '#201810', '#1a1508', '#150e06'],
  healing:  ['#0a180d', '#0d2012', '#0a1a0d', '#081508'],
  default:  ['#080612', '#0e0a1f', '#0d1535', '#0a0f20'],
}

// Mood → orb colors
const MOOD_ORBS: Record<string, string[]> = {
  calm:     ['rgba(180,100,220,0.18)', 'rgba(80,140,255,0.14)', 'rgba(255,140,180,0.10)'],
  drifting: ['rgba(80,150,255,0.18)', 'rgba(120,200,255,0.14)', 'rgba(180,220,255,0.10)'],
  soft:     ['rgba(220,100,180,0.18)', 'rgba(200,140,255,0.14)', 'rgba(255,180,210,0.12)'],
  alive:    ['rgba(50,200,150,0.18)', 'rgba(80,220,180,0.14)', 'rgba(150,255,200,0.10)'],
  heavy:    ['rgba(100,80,220,0.20)', 'rgba(80,60,200,0.16)', 'rgba(120,100,255,0.12)'],
  anxious:  ['rgba(255,140,60,0.16)', 'rgba(220,100,60,0.14)', 'rgba(255,180,100,0.10)'],
  joyful:   ['rgba(255,200,60,0.16)', 'rgba(255,160,80,0.14)', 'rgba(255,220,100,0.10)'],
  healing:  ['rgba(80,200,100,0.18)', 'rgba(100,220,150,0.14)', 'rgba(140,255,160,0.10)'],
  default:  ['rgba(180,100,220,0.18)', 'rgba(80,140,255,0.14)', 'rgba(255,140,180,0.10)'],
}

interface Props {
  mood: MoodId | null
}

export default function AtmosphericBackground({ mood }: Props) {
  const key = mood ?? 'default'
  const gradient = MOOD_GRADIENTS[key] ?? MOOD_GRADIENTS.default
  const orbs = MOOD_ORBS[key] ?? MOOD_ORBS.default

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">

      {/* Base gradient */}
      <motion.div
        key={`bg-${key}`}
        className="absolute inset-0"
        animate={{
          background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 25%, ${gradient[2]} 65%, ${gradient[3]} 100%)`
        }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />

      {/* Orb 1 — top left */}
      <motion.div
        key={`orb1-${key}`}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320,
          height: 320,
          top: -80,
          left: -80,
          background: `radial-gradient(circle, ${orbs[0]} 0%, transparent 70%)`,
        }}
        animate={{
          x: [0, 25, 0, -15, 0],
          y: [0, 30, 10, 0, 0],
          scale: [1, 1.05, 0.98, 1.02, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Orb 2 — bottom right */}
      <motion.div
        key={`orb2-${key}`}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 260,
          height: 260,
          bottom: 60,
          right: -60,
          background: `radial-gradient(circle, ${orbs[1]} 0%, transparent 70%)`,
        }}
        animate={{
          x: [0, -20, 10, 0, -5, 0],
          y: [0, -25, -10, 15, 0, 0],
          scale: [1, 0.96, 1.04, 1, 1.02, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Orb 3 — mid right */}
      <motion.div
        key={`orb3-${key}`}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 180,
          height: 180,
          top: '35%',
          right: 10,
          background: `radial-gradient(circle, ${orbs[2]} 0%, transparent 70%)`,
        }}
        animate={{
          x: [0, 12, -8, 0],
          y: [0, -20, 10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Subtle noise overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  )
}
