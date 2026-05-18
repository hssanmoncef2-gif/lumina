'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MoodId } from '@/types'

const MOOD_QUOTES: Record<string, Array<{ text: string; sub: string }>> = {
  calm: [
    { text: "You don't have to carry everything alone. Some things are allowed to be put down.", sub: 'for the ones who hold too much' },
    { text: "Rest is productive too. Your stillness is not wasted time.", sub: 'for the tired soul' },
    { text: "The calm you're feeling is real. You're allowed to stay here a while.", sub: 'for quiet moments' },
  ],
  drifting: [
    { text: "It's okay to not know where you're going right now. Some of the most beautiful things are found while drifting.", sub: 'for the in-between' },
    { text: "You don't need to have it all figured out today.", sub: 'for the uncertain heart' },
  ],
  soft: [
    { text: "You are allowed to grow slowly. There is no timeline for becoming yourself.", sub: 'for gentle souls' },
    { text: "Softness is not weakness. It takes courage to stay tender in a hard world.", sub: 'for the gentle ones' },
  ],
  alive: [
    { text: "You are more capable than you know. The energy you feel right now? Use it.", sub: 'for when you feel it' },
    { text: "This moment of aliveness is yours. Don't explain it — just feel it.", sub: 'for the electric moments' },
  ],
  joyful: [
    { text: "Let yourself be happy. You don't need a reason, and you don't need permission.", sub: 'for the joyful heart' },
    { text: "This lightness you feel? It's real, and it belongs to you.", sub: 'for bright moments' },
  ],
  healing: [
    { text: "Healing is not linear. Some days you'll feel better, some days you won't. Both are part of it.", sub: 'for the ones mending' },
    { text: "You are allowed to take your time. Growth doesn't need a deadline.", sub: 'for gentle progress' },
  ],
  anxious: [
    { text: "You have survived every hard moment so far. This one is no different.", sub: 'for the anxious heart' },
    { text: "Your breath is always here. Come back to it. Slow, steady, yours.", sub: 'for right now' },
  ],
  heavy: [
    { text: "You survived today. That's not a small thing.", sub: 'for the heavy days' },
    { text: "Heavy doesn't mean broken. You are still whole, even when it hurts.", sub: 'for the hard nights' },
    { text: "Feeling everything deeply means you are alive to life. Even this is part of it.", sub: 'for the sensitive heart' },
  ],
  default: [
    { text: "You don't have to carry everything alone. Some things are allowed to be put down.", sub: 'for the ones who hold too much' },
    { text: "You are allowed to be exactly where you are.", sub: 'right here, right now' },
    { text: "You survived today. And that is enough.", sub: 'always' },
  ],
}

interface Props { mood: MoodId | null }

export default function QuoteCard({ mood }: Props) {
  const [index, setIndex] = useState(0)
  const quotes = MOOD_QUOTES[mood ?? 'default'] ?? MOOD_QUOTES.default
  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    const q = MOOD_QUOTES[mood ?? 'default'] ?? MOOD_QUOTES.default
    setIndex(0); setQuote(q[0])
  }, [mood])

  function next() {
    const q = MOOD_QUOTES[mood ?? 'default'] ?? MOOD_QUOTES.default
    const n = (index + 1) % q.length
    setIndex(n); setQuote(q[n])
  }

  return (
    <motion.button
      onClick={next}
      whileTap={{ scale: 0.985 }}
      className="relative w-full text-left rounded-[28px] p-7 overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, rgba(255,234,206,0.06) 0%, rgba(244,200,168,0.025) 50%, rgba(232,168,140,0.02) 100%)',
        border: '1px solid rgba(252,207,158,0.14)',
        boxShadow: '0 20px 48px -24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,234,206,0.06)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* warm paper grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 80% 0%, rgba(252,178,110,0.10), transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(244,168,168,0.06), transparent 55%)',
        }}
      />

      {/* opening ornament */}
      <div className="relative flex items-center gap-2 mb-5">
        <span className="ornament-rule" />
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '10px', color: 'rgba(252,207,158,0.55)', letterSpacing: '0.1em' }}>
          a note
        </span>
        <span className="ornament-rule" />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={quote.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative quote-body"
        >
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '34px', lineHeight: 0, color: 'rgba(252,207,158,0.4)', marginRight: '2px', verticalAlign: '-12px' }}>“</span>
          {quote.text}
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '34px', lineHeight: 0, color: 'rgba(252,207,158,0.4)', marginLeft: '2px', verticalAlign: '-12px' }}>”</span>
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={quote.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative text-[11px] mt-5"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(248,226,198,0.45)',
            letterSpacing: '0.02em',
          }}
        >
          — {quote.sub}
        </motion.p>
      </AnimatePresence>

      <div className="relative flex items-center justify-between mt-5">
        <span className="ornament-rule" />
        <span className="whisper">tap for another</span>
      </div>
    </motion.button>
  )
}
