// ============================================================
// LUMINA — GET/POST /api/letters
// Tracks which letters have been read
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb/client'
import { LetterRead } from '@/lib/models/LetterRead'
import mongoose from 'mongoose'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  await connectDB()
  const reads = await LetterRead.find({ userId: new mongoose.Types.ObjectId(userId) }).lean()
  return NextResponse.json(reads.map((r) => r.letterId))
}

export async function POST(req: NextRequest) {
  const { userId, letterId } = await req.json()
  if (!userId || !letterId) return NextResponse.json({ error: 'userId and letterId required' }, { status: 400 })

  await connectDB()
  await LetterRead.updateOne(
    { userId: new mongoose.Types.ObjectId(userId), letterId },
    { $setOnInsert: { readAt: new Date() } },
    { upsert: true }
  )

  return NextResponse.json({ ok: true })
}
