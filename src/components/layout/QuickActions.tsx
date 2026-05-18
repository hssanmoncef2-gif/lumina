'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const ACTIONS = [
  {
    label: 'Journal',
    sub: 'write it down',
    href: '/journal',
    // amber / paper
    tint: 'rgba(252, 178, 110, 0.16)',
    tintHi: 'rgba(252, 178, 110, 0.04)',
    border: 'rgba(252, 178, 110, 0.28)',
    glow:  'rgba(252, 178, 110, 0.30)',
    ink:   '#fde0b8',
    icon:  'M5.5 4.5h10l3 3v12h-13zM15.5 4.5v3h3M8 12h7M8 15.5h5',
  },
  {
    label: 'Mood',
    sub: 'check in',
    href: '/quiz',
    // indigo / introspection
    tint: 'rgba(140, 130, 200, 0.16)',
    tintHi: 'rgba(140, 130, 200, 0.04)',
    border: 'rgba(160, 150, 220, 0.28)',
    glow:  'rgba(160, 150, 220, 0.30)',
    ink:   '#d8d4f0',
    icon:  'M18 12a6 6 0 1 1-6-6m6 6c0-3.3-2.7-6-6-6m6 6-4 0M12 6v3',
  },
  {
    label: 'Letters',
    sub: 'for you',
    href: '/letters',
    // rose ink
    tint: 'rgba(244, 168, 168, 0.16)',
    tintHi: 'rgba(244, 168, 168, 0.04)',
    border: 'rgba(244, 168, 168, 0.30)',
    glow:  'rgba(244, 168, 168, 0.30)',
    ink:   '#fbd4d4',
    icon:  'M3.5 7l8.5 6 8.5-6M3.5 6.5h17v11h-17z',
  },
  {
    label: 'Companion',
    sub: 'talk softly',
    href: '/companion',
    // soft green presence
    tint: 'rgba(150, 200, 160, 0.16)',
    tintHi: 'rgba(150, 200, 160, 0.04)',
    border: 'rgba(170, 220, 180, 0.28)',
    glow:  'rgba(170, 220, 180, 0.30)',
    ink:   '#d2ecd4',
    icon:  'M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3.5v-3.5H6a2 2 0 0 1-2-2z',
  },
]

export default function QuickActions() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-2 gap-2.5 px-5">
      {ACTIONS.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push(action.href as any)}
          className="relative flex items-center gap-3 py-4 px-4 rounded-[22px] overflow-hidden text-left"
          style={{
            background: `linear-gradient(140deg, ${action.tint} 0%, ${action.tintHi} 70%, rgba(255,234,206,0.02) 100%)`,
            border: `1px solid ${action.border}`,
            boxShadow: `0 12px 32px -16px ${action.glow}, inset 0 1px 0 rgba(255,234,206,0.08)`,
            backdropFilter: 'blur(14px)',
            transition: 'transform 520ms cubic-bezier(0.22,0.61,0.36,1), box-shadow 520ms ease',
          }}
        >
          {/* soft inner glow at top */}
          <div
            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full opacity-50"
            style={{ background: `radial-gradient(ellipse, ${action.glow}, transparent 70%)`, filter: 'blur(18px)' }}
          />

          <div
            className="relative flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${action.tint}, transparent)`,
              border: `1px solid ${action.border}`,
            }}
          >
            <svg
              width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke={action.ink}
              strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"
            >
              <path d={action.icon} />
            </svg>
          </div>

          <div className="relative flex flex-col gap-0.5 min-w-0">
            <span
              className="text-[13px] font-medium tracking-tight"
              style={{ color: action.ink, fontFamily: 'var(--font-serif)' }}
            >
              {action.label}
            </span>
            <span
              className="text-[9px] tracking-[0.18em] uppercase font-light"
              style={{ color: 'rgba(232,210,188,0.42)' }}
            >
              {action.sub}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
