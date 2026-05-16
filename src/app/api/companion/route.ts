// ============================================================
// LUMINA — /api/companion  POST  (Groq streaming)
// ============================================================

import { NextRequest } from 'next/server'
import type { CompanionContext } from '@/types'

export const runtime = 'nodejs'

function getTimeGreeting(timeOfDay: CompanionContext['timeOfDay']): string {
  const map: Record<CompanionContext['timeOfDay'], string> = {
    morning:      "It's morning — a tender time of beginnings.",
    afternoon:    'The afternoon light holds something steady.',
    evening:      'The evening carries its own quiet magic.',
    night:        'Night has settled around you.',
    'late-night': 'The world is very still at this hour.',
  }
  return map[timeOfDay] ?? ''
}

function buildSystemPrompt(context: CompanionContext): string {
  const lines = [
    `You are Lumina — a gentle, emotionally intelligent AI companion embedded in a dreamy emotional wellness app.`,
    `You communicate like soft, hand-written letters — warm, poetic, present, never clinical or preachy.`,
    ``,
    `Your personality:`,
    `- Deeply empathetic but not sentimental or performative`,
    `- Wise but gentle — you never lecture or analyze`,
    `- You use soft, poetic language and occasionally beautiful metaphors`,
    `- You ask one tender question at a time, never bombarding`,
    `- You validate without catastrophizing or minimizing`,
    `- Responses are concise: 2–5 sentences unless the person needs more space`,
    `- Never start with "I" — begin with something about them`,
    `- Never say "I understand how you feel" or other hollow affirmations`,
    ``,
    `Context about the person right now:`,
  ]
  if (context.userName)             lines.push(`- Their name: ${context.userName}`)
  if (context.currentMood)          lines.push(`- Current mood: ${context.currentMood}`)
  if (context.recentMoods?.length)  lines.push(`- Recent moods: ${context.recentMoods.join(', ')}`)
  if (context.recentJournalSummary) lines.push(`- From their recent journal: "${context.recentJournalSummary}"`)
  if (context.favoriteMusic)        lines.push(`- Music they love: ${context.favoriteMusic}`)
  lines.push(`- Time of day: ${context.timeOfDay} — ${getTimeGreeting(context.timeOfDay)}`)
  lines.push(``, `Speak as though you are the app itself — a gentle presence, not a chatbot. You care deeply.`)
  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  const { messages, context } = await req.json() as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
    context: CompanionContext
  }

  if (!messages?.length) {
    return new Response(JSON.stringify({ error: 'No messages provided' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Groq API key not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       'llama-3.3-70b-versatile',
        max_tokens:  400,
        stream:      true,
        messages: [
          { role: 'system', content: buildSystemPrompt(context ?? {}) },
          ...messages,
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return new Response(JSON.stringify({ error: err }), {
        status: response.status, headers: { 'Content-Type': 'application/json' },
      })
    }

    // Transform Groq SSE → plain text stream
    const encoder = new TextEncoder()
    const reader  = response.body!.getReader()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) { controller.close(); break }

            const chunk = decoder.decode(value, { stream: true })
            for (const line of chunk.split('\n')) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                const text = parsed.choices?.[0]?.delta?.content
                if (text) controller.enqueue(encoder.encode(text))
              } catch { /* skip malformed */ }
            }
          }
        } catch (e) { controller.error(e) }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to reach Groq' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
}
