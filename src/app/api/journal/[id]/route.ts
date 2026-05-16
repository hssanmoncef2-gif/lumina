// ============================================================
// LUMINA — GET/PATCH/DELETE /api/journal/[id]
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb/client'
import { JournalEntry } from '@/lib/models/JournalEntry'
import mongoose from 'mongoose'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  await connectDB()
  const entry = await JournalEntry.findOne({
    _id:    new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  }).lean()

  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(entry)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId, title, content, mood, moodIntensity, tags, isFavorite, aiSummary } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  await connectDB()

  const patch: Record<string, unknown> = {}
  if (title         !== undefined) patch.title         = title
  if (content       !== undefined) patch.content       = content
  if (mood          !== undefined) patch.mood          = mood
  if (moodIntensity !== undefined) patch.moodIntensity = moodIntensity
  if (tags          !== undefined) patch.tags          = tags
  if (isFavorite    !== undefined) patch.isFavorite    = isFavorite
  if (aiSummary     !== undefined) patch.aiSummary     = aiSummary

  const entry = await JournalEntry.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) },
    { $set: patch },
    { new: true }
  ).lean()

  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(entry)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  await connectDB()
  await JournalEntry.deleteOne({
    _id:    new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  })

  return NextResponse.json({ ok: true })
}