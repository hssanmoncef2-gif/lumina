'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Props {
  greeting: { text: string; sub: string }
}

export default function HomeHeader({ greeting }: Props) {
  const router = useRouter()
  return (
    <header className="flex items-start justify-between px-5 pt-7">
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] uppercase tracking-[0.22em] font-light mb-1"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          {greeting.text}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[18px] font-normal leading-snug"
          style={{ color: 'rgba(255,255,255,0.82)', letterSpacing: '-0.02em' }}
        >
          {greeting.sub}
        </motion.p>
      </div>
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileTap={{ scale: 0.88 }}
        onClick={() => router.push('/profile')}
        className="w-10 h-10 rounded-full flex items-center justify-center mt-0.5"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        aria-label="Profile"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </motion.button>
    </header>
  )
}
