'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MarkedDate {
  date: string
  label?: string
  color: string
}

const MARK_COLORS = [
  { id: 'rose',   hex: 'rgba(244,168,168,0.9)', label: 'Memory' },
  { id: 'amber',  hex: 'rgba(252,178,110,0.9)', label: 'Milestone' },
  { id: 'violet', hex: 'rgba(196,181,253,0.9)', label: 'Mood' },
  { id: 'teal',   hex: 'rgba(94,234,212,0.9)',  label: 'Grateful' },
  { id: 'sky',    hex: 'rgba(147,197,253,0.9)', label: 'Goal' },
]

const STORAGE_KEY = 'lumina_calendar_marks'

function toDateKey(d: Date) { return d.toISOString().slice(0, 10) }
function loadMarks(): MarkedDate[] { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : [] } catch { return [] } }
function saveMarks(m: MarkedDate[]) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(m)) } catch {} }

export default function JournalCalendar({ entryDates = [] }: { entryDates?: string[] }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [marks, setMarks] = useState<MarkedDate[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [labelInput, setLabelInput] = useState('')
  const [pickedColor, setPickedColor] = useState(MARK_COLORS[0].hex)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => { setMarks(loadMarks()) }, [])

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const marksMap: Record<string, MarkedDate> = {}
  marks.forEach(m => { marksMap[m.date] = m })
  const entrySet = new Set(entryDates)
  const todayKey = toDateKey(today)

  function prevMonth() { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) } else setViewMonth(m => m - 1) }
  function nextMonth() { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) } else setViewMonth(m => m + 1) }

  function handleDay(day: number) {
    const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelected(key)
    const ex = marksMap[key]
    setLabelInput(ex?.label || '')
    setPickedColor(ex?.color || MARK_COLORS[0].hex)
    setShowPicker(true)
  }

  function saveMark() {
    if (!selected) return
    const updated = [...marks.filter(m => m.date !== selected), { date: selected, label: labelInput.trim() || undefined, color: pickedColor }]
    setMarks(updated); saveMarks(updated); setShowPicker(false); setSelected(null)
  }

  function removeMark() {
    if (!selected) return
    const updated = marks.filter(m => m.date !== selected)
    setMarks(updated); saveMarks(updated); setShowPicker(false); setSelected(null)
  }

  const monthName = new Date(viewYear, viewMonth).toLocaleString('en-US', { month: 'long' })
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <>
      <div style={{
        background: 'rgba(10,8,22,0.7)',
        border: '0.5px solid rgba(255,220,184,0.08)',
        borderRadius: 16,
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px 6px' }}>
          <button onClick={prevMonth} style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-sora)', letterSpacing: '0.02em' }}>
              {monthName} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>{viewYear}</span>
            </p>
          </div>
          <button onClick={nextMonth} style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Day labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 8px 4px' }}>
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 8, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-sora)', padding: '2px 0' }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, padding: '0 8px 10px' }}>
          {cells.map((day, idx) => {
            if (day === null) return <div key={`e-${idx}`} />
            const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isToday = key === todayKey
            const mark = marksMap[key]
            const hasEntry = entrySet.has(key)

            return (
              <motion.button
                key={key}
                onClick={() => handleDay(day)}
                whileTap={{ scale: 0.82 }}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 8,
                  border: mark
                    ? `0.5px solid ${mark.color.replace('0.9', '0.4')}`
                    : isToday
                      ? '0.5px solid rgba(196,181,253,0.4)'
                      : '0.5px solid transparent',
                  background: mark
                    ? mark.color.replace('0.9', '0.14')
                    : isToday
                      ? 'rgba(139,92,246,0.18)'
                      : 'transparent',
                  color: isToday ? 'rgba(196,181,253,1)' : mark ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
                  fontSize: 10,
                  fontFamily: 'var(--font-sora)',
                  fontWeight: isToday ? 700 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                {mark && (
                  <div style={{
                    position: 'absolute', top: 2, right: 2,
                    width: 4, height: 4, borderRadius: '50%',
                    background: mark.color,
                  }} />
                )}
                {day}
                {hasEntry && (
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(139,92,246,0.7)' }} />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Compact legend */}
        {marks.length > 0 && (
          <div style={{ padding: '6px 12px 10px', borderTop: '0.5px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {marks.slice(-4).map(m => (
                <div key={m.date} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-nunito)' }}>
                    {new Date(m.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {m.label ? ` · ${m.label}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom sheet picker */}
      <AnimatePresence>
        {showPicker && selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            onClick={e => { if (e.target === e.currentTarget) { setShowPicker(false); setSelected(null) } }}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
              style={{
                width: '100%', maxWidth: 400,
                background: 'rgba(10,7,24,0.99)',
                border: '0.5px solid rgba(255,220,184,0.1)',
                borderBottom: 'none',
                borderRadius: '24px 24px 0 0',
                padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
              }}
            >
              {/* Pill handle */}
              <div style={{ width: 32, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.12)', margin: '0 auto 16px' }} />

              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-sora)', marginBottom: 4 }}>Mark date</p>
              <p style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.88)', fontFamily: 'var(--font-sora)', marginBottom: 18 }}>
                {new Date(selected + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>

              {/* Color dots */}
              <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                {MARK_COLORS.map(c => (
                  <button key={c.id} onClick={() => setPickedColor(c.hex)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: c.hex,
                      boxShadow: pickedColor === c.hex ? `0 0 0 2.5px rgba(255,255,255,0.5), 0 0 12px ${c.hex}` : 'none',
                      transform: pickedColor === c.hex ? 'scale(1.18)' : 'scale(1)',
                      transition: 'all 0.18s',
                    }} />
                    <span style={{ fontSize: 8, color: pickedColor === c.hex ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-nunito)' }}>{c.label}</span>
                  </button>
                ))}
              </div>

              {/* Note input */}
              <input
                type="text" value={labelInput} onChange={e => setLabelInput(e.target.value)}
                placeholder="Add a note… (optional)" maxLength={40}
                style={{
                  width: '100%', borderRadius: 12, padding: '10px 14px',
                  fontSize: 13, outline: 'none', marginBottom: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.75)',
                  fontFamily: 'var(--font-nunito)',
                }}
              />

              <div style={{ display: 'flex', gap: 8 }}>
                {marksMap[selected] && (
                  <button onClick={removeMark} style={{
                    flex: 1, padding: '11px', borderRadius: 12, fontSize: 12, cursor: 'pointer',
                    background: 'rgba(255,80,80,0.08)', border: '0.5px solid rgba(255,100,100,0.15)',
                    color: 'rgba(255,150,150,0.75)', fontFamily: 'var(--font-sora)',
                  }}>Remove</button>
                )}
                <button onClick={saveMark} style={{
                  flex: 1, padding: '11px', borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: pickedColor.replace('0.9', '0.22'),
                  border: `0.5px solid ${pickedColor.replace('0.9', '0.45')}`,
                  color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-sora)',
                }}>Save ✦</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
