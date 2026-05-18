'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function ComfortPill() {
  const router = useRouter()

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => router.push('/comfort' as any)}
      className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300"
      style={{
        background: 'rgba(251,207,232,0.04)',
        border: '1px solid rgba(251,207,232,0.08)',
      }}
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: '#fbcfe8' }}
      />
      <p className="flex-1 text-left text-[13px] font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Need a softer moment right now?
      </p>
      <span
        className="text-[9px] px-2.5 py-1 rounded-full tracking-widest uppercase flex-shrink-0"
        style={{
          background: 'rgba(139,92,246,0.12)',
          color: 'rgba(196,181,253,0.6)',
          border: '1px solid rgba(139,92,246,0.18)',
        }}
      >
        comfort
      </span>
    </motion.button>
  )
}
