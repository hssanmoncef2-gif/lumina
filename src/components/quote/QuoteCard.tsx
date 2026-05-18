'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MoodId } from '@/types'

// Mood-matched quotes (full engine in Phase 5)
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
  heavy: [
    { text: "You survived today. That's not a small thing.", sub: 'for the heavy days' },
    { text: "Heavy doesn't mean broken. You are still whole, even when it hurts.", sub: 'for the hard nights' },
    { text: "Feeling everything deeply means you are alive to life. Even this is part of it.", sub: 'for the sensitive heart' },
  ],
  default: [
    { text: "You don't have to carry everything alone. Some things are allowed to be put down.", sub: 'for the ones who hold too much' },
    { text: "You survived today.", sub: 'and that is enough' },
    { text: "You are allowed to be exactly where you are.", sub: 'right here, right now' },
  ],
}

interface Props {
  mood: MoodId | null
}

export default function QuoteCard({ mood }: Props) {
  const quotes = MOOD_QUOTES[mood ?? 'default'] ?? MOOD_QUOTES.default
  const [index, setIndex] = useState(0)
  const [quote, setQuote] = useState(quotes[0])

  // Refresh quote when mood changes
  useEffect(() => {
    const moodQuotes = MOOD_QUOTES[mood ?? 'default'] ?? MOOD_QUOTES.default
    setIndex(0)
    setQuote(moodQuotes[0])
  }, [mood])

  function nextQuote() {
    const moodQuotes = MOOD_QUOTES[mood ?? 'default'] ?? MOOD_QUOTES.default
    const next = (index + 1) % moodQuotes.length
    setIndex(next)
    setQuote(moodQuotes[next])
  }

  return (
    <motion.button
      onClick={nextQuote}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left rounded-[20px] p-4 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
      }}
      aria-label="Next quote — tap to refresh"
    >
      {/* Sparkle */}
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-lg mb-2 text-lumina-purple-dream/70"
      >
        ✦
      </motion.div>

      {/* Quote text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={quote.text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="quote-body text-sm"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          "{quote.text}"
        </motion.p>
      </AnimatePresence>

      {/* Sub attribution */}
      <AnimatePresence mode="wait">
        <motion.p
          key={quote.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-[10px] mt-2 tracking-[0.06em]"
          style={{ color: 'rgba(200,160,255,0.35)' }}
        >
          {quote.sub}
        </motion.p>
      </AnimatePresence>

      {/* Tap hint */}
      <p className="text-[9px] mt-3 text-white/15 text-right tracking-wide">
        tap for another
      </p>
    </motion.button>
  )
}
