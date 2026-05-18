'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const TABS = [
  {
    label: 'Home', href: '/',
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  },
  {
    label: 'Music', href: '/music',
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
  },
  {
    label: 'Lumina', href: '/companion',
    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  },
  {
    label: 'Library', href: '/library',
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  },
  {
    label: 'Journal', href: '/journal',
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  },
  {
    label: 'You', href: '/profile',
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  },
]

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[var(--z-overlay)] safe-bottom"
      style={{
        background: 'rgba(6,4,14,0.88)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex justify-around px-1 pt-2 pb-4">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          const isCentral = tab.label === 'Lumina'

          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href as any)}
              className="relative flex flex-col items-center gap-1.5 px-3 py-1 rounded-2xl transition-all duration-300"
              style={{ opacity: isActive ? 1 : 0.35 }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <span
                className="relative"
                style={{
                  color: isActive
                    ? isCentral ? '#c4b5fd' : 'rgba(255,255,255,0.85)'
                    : 'rgba(255,255,255,0.4)',
                }}
              >
                {tab.svg}
              </span>
              <span
                className="relative text-[8px] tracking-[0.06em] uppercase font-light"
                style={{ color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)' }}
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
