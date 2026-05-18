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
      className="w-full text-left rounded-[24px] p-5 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.028)',
        border: '1px solid rgba(255,255,255,0.065)',
      }}
    >
      {/* Animated sparkle */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-base mb-3"
        style={{ color: 'rgba(196,181,253,0.6)' }}
      >
        ✦
      </motion.div>

      {/* Quote */}
      <AnimatePresence mode="wait">
        <motion.p
          key={quote.text}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="quote-body"
          style={{ fontFamily: 'var(--font-nunito)', fontSize: '13.5px', lineHeight: 1.75, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}
        >
          "{quote.text}"
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={quote.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-[10px] mt-3 tracking-[0.08em]"
          style={{ color: 'rgba(196,181,253,0.3)' }}
        >
          — {quote.sub}
        </motion.p>
      </AnimatePresence>

      <p className="text-[8px] mt-3.5 text-right tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.1)' }}>
        tap for another
      </p>
    </motion.button>
  )
}
