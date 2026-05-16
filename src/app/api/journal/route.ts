// ============================================================
// LUMINA — GET /api/journal  (list) + POST /api/journal (create)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb/client'
import { JournalEntry } from '@/lib/models/JournalEntry'
import mongoose from 'mongoose'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  await connectDB()
  const entries = await JournalEntry.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, title, content, mood, moodIntensity, tags, isFavorite } = body

  if (!userId || !content) {
    return NextResponse.json({ error: 'userId and content required' }, { status: 400 })
  }

  await connectDB()
  const entry = await JournalEntry.create({
    userId:        new mongoose.Types.ObjectId(userId),
    title:         title ?? undefined,
    content,
    mood:          mood ?? undefined,
    moodIntensity: moodIntensity ?? undefined,
    tags:          tags ?? [],
    isFavorite:    isFavorite ?? false,
  })

  return NextResponse.json(entry, { status: 201 })
}
