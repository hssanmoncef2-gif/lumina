'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const ACTIONS = [
  { icon: '📖', label: 'Journal',   sub: 'write',    href: '/journal',   bg: 'rgba(139,92,246,0.14)',  border: 'rgba(139,92,246,0.2)' },
  { icon: '🌙', label: 'Mood',      sub: 'check in', href: '/quiz',      bg: 'rgba(59,130,246,0.14)',  border: 'rgba(59,130,246,0.2)' },
  { icon: '💌', label: 'Letters',   sub: 'for you',  href: '/letters',   bg: 'rgba(236,72,153,0.14)',  border: 'rgba(236,72,153,0.2)' },
  { icon: '🤍', label: 'Companion', sub: 'talk',     href: '/companion', bg: 'rgba(52,211,153,0.11)',  border: 'rgba(52,211,153,0.2)' },
]

export default function QuickActions() {
  const router = useRouter()

  return (
    <div className="flex gap-2 px-5">
      {ACTIONS.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push(action.href as any)}
          className="flex-1 flex flex-col items-center gap-2 py-3.5 rounded-[18px] transition-all duration-300"
          style={{
            background: action.bg,
            border: `1px solid ${action.border}`,
          }}
        >
          <span className="text-[20px] leading-none">{action.icon}</span>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {action.label}
            </span>
            <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
              {action.sub}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
