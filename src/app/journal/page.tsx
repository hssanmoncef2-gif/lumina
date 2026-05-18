'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Music, Sparkles, BookOpen, FileText, Heart, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

type Entry = { id: string; date: string; title: string; content: string; mood: string };

const MOODS = ['😌','😊','😔','😤','😴','🥰','😰'];

export default function JournalPage() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string>(today.toISOString().split('T')[0]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState({ title: '', content: '', mood: '😌' });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const dateKey = (d: number) => `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const entriesForDate = entries.filter(e => e.date === selectedDate);
  const hasEntry = (d: number) => entries.some(e => e.date === dateKey(d));

  const saveEntry = () => {
    if (!draft.content.trim()) return;
    const entry: Entry = {
      id: Date.now().toString(),
      date: selectedDate,
      title: draft.title || 'Untitled',
      content: draft.content,
      mood: draft.mood,
    };
    setEntries(prev => [entry, ...prev]);
    setDraft({ title: '', content: '', mood: '😌' });
    setWriting(false);
  };

  const todayKey = today.toISOString().split('T')[0];

  return (
    <div className="relative min-h-screen bg-[#0a0b14] text-white overflow-hidden flex flex-col">
      {/* Atmospheric Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(88,28,220,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(20,180,160,0.08)_0%,transparent_60%)]" />
        {/* Stars */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col flex-1 px-4 pt-10 pb-24 max-w-md mx-auto w-full">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-1">Your Journal</p>
          <h1 className="text-2xl font-light tracking-wide text-white/90">Reflections</h1>
        </div>

        {/* Compact Calendar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-4 backdrop-blur-sm"
        >
          {/* Month Nav */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
              <ChevronLeft size={14} className="text-white/50" />
            </button>
            <span className="text-sm font-medium tracking-widest text-white/80">
              <span className="text-white/90">{MONTHS[month]}</span>{' '}
              <span className="text-white/40">{year}</span>
            </span>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
              <ChevronRight size={14} className="text-white/50" />
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d, i) => (
              <div key={i} className="text-center text-[10px] text-white/25 font-medium py-1">{d}</div>
            ))}
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const key = dateKey(day);
              const isToday = key === todayKey;
              const isSelected = key === selectedDate;
              const hasEntryDot = hasEntry(day);

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  className="relative flex items-center justify-center aspect-square rounded-lg transition-all duration-150"
                  style={{
                    background: isSelected
                      ? 'rgba(20,180,160,0.25)'
                      : isToday
                      ? 'rgba(255,255,255,0.06)'
                      : 'transparent',
                  }}
                >
                  <span
                    className="text-[11px] font-medium"
                    style={{
                      color: isSelected
                        ? 'rgba(20,220,190,1)'
                        : isToday
                        ? 'rgba(255,255,255,0.9)'
                        : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {day}
                  </span>
                  {hasEntryDot && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-teal-400/70" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Date Label */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-white/40 tracking-wide">
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric'
            })}
          </p>
          <button
            onClick={() => setWriting(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 border border-teal-400/20 text-teal-300 text-xs hover:bg-teal-500/30 transition-all"
          >
            <Plus size={12} />
            New Entry
          </button>
        </div>

        {/* Entries */}
        <div className="flex-1 space-y-3">
          <AnimatePresence>
            {entriesForDate.length === 0 && !writing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-3xl mb-3 opacity-30">✦</p>
                <p className="text-white/20 text-sm">No entries for this day</p>
                <p className="text-white/15 text-xs mt-1">Tap &ldquo;New Entry&rdquo; to begin</p>
              </motion.div>
            )}

            {entriesForDate.map(entry => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-lg mr-2">{entry.mood}</span>
                    <span className="text-sm font-medium text-white/80">{entry.title}</span>
                  </div>
                </div>
                <p className="text-xs text-white/45 leading-relaxed">{entry.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Write Entry Panel */}
        <AnimatePresence>
          {writing && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-[#0d0e1a] border-t border-white/[0.08] rounded-t-3xl p-5 pb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-white/60 font-medium">New Entry</p>
                <button onClick={() => setWriting(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={16} className="text-white/40" />
                </button>
              </div>

              {/* Mood Picker */}
              <div className="flex gap-2 mb-4">
                {MOODS.map(m => (
                  <button
                    key={m}
                    onClick={() => setDraft(d => ({ ...d, mood: m }))}
                    className={`text-xl p-1.5 rounded-xl transition-all ${draft.mood === m ? 'bg-white/15 scale-110' : 'opacity-40 hover:opacity-70'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <input
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 mb-3 outline-none focus:border-teal-400/30"
                placeholder="Title (optional)"
                value={draft.title}
                onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              />
              <textarea
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 mb-4 outline-none focus:border-teal-400/30 resize-none"
                placeholder="What's on your mind..."
                rows={4}
                value={draft.content}
                onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
              />
              <button
                onClick={saveEntry}
                disabled={!draft.content.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500/40 to-teal-500/40 border border-teal-400/20 text-sm font-medium text-white/90 disabled:opacity-30 hover:from-violet-500/50 hover:to-teal-500/50 transition-all"
              >
                Save Entry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0a0b14]/90 backdrop-blur-md border-t border-white/[0.06]">
        <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto">
          {[
            { icon: Home, label: 'HOME' },
            { icon: Music, label: 'MUSIC' },
            { icon: Sparkles, label: 'LUMINA' },
            { icon: BookOpen, label: 'LIBRARY' },
            { icon: FileText, label: 'JOURNAL', active: true },
            { icon: Heart, label: 'YOU' },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex flex-col items-center gap-1 transition-colors ${
                active ? 'text-amber-300/80' : 'text-white/25 hover:text-white/40'
              }`}
            >
              <Icon size={18} />
              <span className="text-[8px] tracking-wider">{label}</span>
              {active && <span className="w-3 h-0.5 rounded-full bg-amber-300/60" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}