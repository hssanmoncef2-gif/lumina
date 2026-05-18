'use client'

import { motion } from 'framer-motion'

interface Props {
  greeting: { text: string; sub: string }
}

export default function HomeHeader({ greeting }: Props) {
  return (
    <header className="flex items-center justify-between px-5 pt-5">
      <div>
        <p className="whisper">{greeting.text}</p>
        <p
          className="mt-1.5"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '15px',
            color: 'rgba(248,226,198,0.7)',
            letterSpacing: '-0.005em',
          }}
        >
          {greeting.sub}
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.04 }}
        className="relative w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(253,224,184,0.95), rgba(252,178,110,0.7) 55%, rgba(232,132,88,0.55) 100%)',
          boxShadow:
            '0 0 18px rgba(252,178,110,0.55), 0 0 36px rgba(232,132,88,0.25), inset 0 1px 0 rgba(255,234,206,0.55)',
        }}
        aria-label="Profile"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a1410" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="9" r="3.5" />
          <path d="M5 19c0-3 3-5 7-5s7 2 7 5" />
        </svg>
      </motion.button>
    </header>
  )
}
