'use client'

import { motion } from 'framer-motion'

interface Props {
  greeting: { text: string; sub: string }
}

export default function HomeHeader({ greeting }: Props) {
  return (
    <header className="flex items-center justify-between px-5 pt-5">
      {/* Left: greeting */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.1em] text-white/40 font-light">
          {greeting.text}
        </p>
        <p className="text-[15px] font-medium text-white/80 mt-0.5">
          {greeting.sub}
        </p>
      </div>

      {/* Right: avatar / settings */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        }}
        aria-label="Profile"
      >
        ✦
      </motion.button>
    </header>
  )
}
