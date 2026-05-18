'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const ACTIONS = [
  {
    label: 'Journal',
    href: '/journal',
    desc: 'Write it out',
    color: '#c4b5fd',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.15)',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  },
  {
    label: 'Mood',
    href: '/quiz',
    desc: 'Check in',
    color: '#93c5fd',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.15)',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
  },
  {
    label: 'Letters',
    href: '/letters',
    desc: 'To your heart',
    color: '#fbcfe8',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.15)',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  },
  {
    label: 'Lumina',
    href: '/companion',
    desc: 'Talk to me',
    color: '#6ee7b7',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.15)',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  },
]

export default function QuickActions() {
  const router = useRouter()
  return (
    <div className="grid grid-cols-4 gap-2 px-5">
      {ACTIONS.map((a, i) => (
        <motion.button
          key={a.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push(a.href as any)}
          className="flex flex-col items-center gap-2.5 py-4 rounded-2xl transition-all duration-300"
          style={{
            background: a.bg,
            border: `1px solid ${a.border}`,
          }}
        >
          <span style={{ color: a.color }}>{a.svg}</span>
          <div className="text-center">
            <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{a.label}</p>
            <p className="text-[8px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{a.desc}</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
