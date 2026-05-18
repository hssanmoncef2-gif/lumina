'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Minimal hand-drawn line icons — 22x22, 1.4 stroke
const Icon = ({ d, active }: { d: string; active: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? 1.55 : 1.3}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      color: active ? '#fde0b8' : 'rgba(232, 210, 188, 0.55)',
      filter: active
        ? 'drop-shadow(0 0 6px rgba(252,178,110,0.55)) drop-shadow(0 0 12px rgba(232,132,88,0.25))'
        : 'none',
      transition: 'color 520ms ease, filter 520ms ease',
    }}
  >
    <path d={d} />
  </svg>
)

const TABS = [
  // Home — minimal house
  { d: 'M3.5 11.5 12 4l8.5 7.5M5.5 10v9.5h4.5V14h4v5.5h4.5V10', label: 'Home',    href: '/' },
  // Music — quarter note / stem with circle
  { d: 'M9 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 16.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM11 16.5V5l9-1.5v11', label: 'Music',   href: '/music' },
  // Lumina — soft 4-point star
  { d: 'M12 3v6m0 6v6m-9-9h6m6 0h6M6 6l4 4m4 4 4 4m0-12-4 4m-4 4-4 4', label: 'Lumina',  href: '/companion' },
  // Library — open book
  { d: 'M3.5 5.5C6 5 9 5 12 6.5M20.5 5.5C18 5 15 5 12 6.5M12 6.5v13M3.5 5.5v13C6 18 9 18 12 19.5M20.5 5.5v13C18 18 15 18 12 19.5', label: 'Library', href: '/library' },
  // Journal — page with single line
  { d: 'M5.5 4.5h10l3 3v12h-13zM15.5 4.5v3h3M8 12h7M8 15.5h5', label: 'Journal', href: '/journal' },
  // You — soft heart outline
  { d: 'M12 19.5C8 17 4 13.5 4 9.5a4 4 0 0 1 7-2.7L12 8l1-1.2a4 4 0 0 1 7 2.7c0 4-4 7.5-8 10Z', label: 'You',     href: '/profile' },
]

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[var(--z-overlay)] safe-bottom"
      style={{
        background:
          'linear-gradient(180deg, rgba(14,11,28,0.6) 0%, rgba(10,8,22,0.92) 100%)',
        borderTop: '1px solid rgba(252,207,158,0.08)',
        backdropFilter: 'blur(26px) saturate(120%)',
        WebkitBackdropFilter: 'blur(26px) saturate(120%)',
      }}
    >
      <div className="flex justify-around px-2 pt-2 pb-3">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href as any)}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-x-2 top-1 bottom-1 rounded-[18px]"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(252,178,110,0.16) 0%, rgba(252,178,110,0.04) 60%, transparent 100%)',
                  }}
                  transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                />
              )}
              <span className="relative">
                <Icon d={tab.d} active={isActive} />
              </span>
              <span
                className="relative font-light"
                style={{
                  fontSize: '8.5px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: isActive ? 'rgba(253, 224, 184, 0.9)' : 'rgba(232,210,188,0.32)',
                  transition: 'color 520ms ease',
                }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
