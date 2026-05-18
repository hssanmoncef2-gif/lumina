'use client'

import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'

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

      <div className="flex items-center gap-2">
        {/* Logout button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,220,184,0.12)',
            color: 'rgba(248,226,198,0.45)',
            fontFamily: 'var(--font-sora)',
            backdropFilter: 'blur(12px)',
          }}
          aria-label="Sign out"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </motion.button>

        {/* Profile avatar */}
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
      </div>
    </header>
  )
}
