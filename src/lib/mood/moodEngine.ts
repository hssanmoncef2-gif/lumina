// ============================================================
// LUMINA — Mood Engine: Quiz Scoring + Result Calculation
// ============================================================

import type { MoodId, QuizResult } from '@/types'
import { COMFORT_MOODS, MOOD_DATA } from './moodData'

export type QuizAnswers = {
  q1?: string        // option id
  q2?: number        // 0–100 slider (0=comfort, 100=energy)
  q3?: string        // option id
  q4?: string        // option id
  q5?: string        // option id
}

// All quiz option weight maps (flattened for scoring)
import { QUIZ_QUESTIONS } from './moodData'

function getOptionWeights(optionId: string): Partial<Record<MoodId, number>> {
  for (const q of QUIZ_QUESTIONS) {
    if (!q.options) continue
    const opt = q.options.find(o => o.id === optionId)
    if (opt) return opt.moodWeights
  }
  return {}
}

// Slider converts to mood weights: low=comfort (calm/healing/soft), high=energy (alive/joyful)
function sliderToWeights(value: number): Partial<Record<MoodId, number>> {
  // value 0–100
  const comfortScore = (100 - value) / 100   // 0–1
  const energyScore  = value / 100            // 0–1

  return {
    calm:    comfortScore * 2.5,
    soft:    comfortScore * 1.5,
    healing: comfortScore * 1.2,
    alive:   energyScore  * 2.5,
    joyful:  energyScore  * 2.0,
  }
}

// ---- Main scoring function ----
export function calculateMoodResult(answers: QuizAnswers): QuizResult {
  const scores: Record<MoodId, number> = {
    calm:     0,
    drifting: 0,
    soft:     0,
    alive:    0,
    heavy:    0,
    anxious:  0,
    joyful:   0,
    healing:  0,
  }

  // Accumulate option weights
  for (const optionId of [answers.q1, answers.q3, answers.q4, answers.q5]) {
    if (!optionId) continue
    const weights = getOptionWeights(optionId)
    for (const [moodId, weight] of Object.entries(weights)) {
      if (weight !== undefined) {
        scores[moodId as MoodId] = (scores[moodId as MoodId] || 0) + weight
      }
    }
  }

  // Slider weights
  if (answers.q2 !== undefined) {
    const sliderWeights = sliderToWeights(answers.q2)
    for (const [moodId, weight] of Object.entries(sliderWeights)) {
      if (weight !== undefined) {
        scores[moodId as MoodId] = (scores[moodId as MoodId] || 0) + weight
      }
    }
  }

  // Sort moods by score
  const ranked = (Object.entries(scores) as [MoodId, number][])
    .sort((a, b) => b[1] - a[1])

  const primaryMood   = ranked[0][0]
  const secondaryMood = ranked[1][1] > 0 ? ranked[1][0] : undefined

  // Energy level from slider (1–5 scale)
  const sliderVal = answers.q2 ?? 50
  const energyLevel = Math.max(1, Math.min(5, Math.round(sliderVal / 20) + 1)) as 1|2|3|4|5

  // Comfort need
  const needsComfort = COMFORT_MOODS.includes(primaryMood) ||
    (secondaryMood !== undefined && COMFORT_MOODS.includes(secondaryMood))

  const moodDef = MOOD_DATA[primaryMood]

  return {
    primaryMood,
    secondaryMood,
    energyLevel,
    needsComfort,
    recommendedPlaylist: moodDef.musicCategory,
    recommendedAmbient:  moodDef.ambientMode,
  }
}

// ---- Save mood entry to Supabase ----
export async function saveMoodEntry({
  userId,
  moodId,
  intensity,
  notes,
}: {
  userId: string
  moodId: MoodId
  intensity: 1|2|3|4|5
  notes?: string
}) {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()

  const { data, error } = await supabase
    .from('mood_entries')
    .insert({
      user_id:   userId,
      mood_id:   moodId,
      intensity,
      notes:     notes ?? null,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  return { data, error }
}
