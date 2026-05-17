'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AtmosphericBackground from '@/components/layout/AtmosphericBackground'
import BottomNav from '@/components/layout/BottomNav'
import PlaylistCard from '@/components/music/PlaylistCard'
import NowPlayingBar from '@/components/music/NowPlayingBar'
import MusicPlayer from '@/components/music/MusicPlayer'
import { usePlayer } from '@/hooks/usePlayer'
import { useLuminaStore } from '@/store/useAppStore'
import { PLAYLISTS, MOOD_PLAYLIST_MAP } from '@/lib/music/playlistData'
import { AMBIENT_PRESETS, getAmbientEngine } from '@/lib/music/ambientEngine'
import type { Playlist } from '@/types'
import type { AmbientPreset } from '@/lib/music/ambientEngine'

// ============================================================
// /music — Enhanced music + ambient soundscape hub
// ============================================================

const MOOD_FILTER_OPTIONS = [
  { id: 'all',      label: 'All',      emoji: '✦',  color: 'rgba(255,255,255,0.7)' },
  { id: 'alive',    label: 'Energy',   emoji: '⚡', color: 'rgba(52,211,153,0.9)'  },
  { id: 'joyful',   label: 'Joyful',   emoji: '✨', color: 'rgba(251,191,36,0.9)'  },
  { id: 'soft',     label: 'Tender',   emoji: '🌸', color: 'rgba(249,168,212,0.9)' },
  { id: 'drifting', label: 'Adrift',   emoji: '🌙', color: 'rgba(129,140,248,0.9)' },
  { id: 'healing',  label: 'Healing',  emoji: '🌱', color: 'rgba(134,239,172,0.9)' },
  { id: 'heavy',    label: 'Release',  emoji: '🌧', color: 'rgba(99,102,241,0.9)'  },
  { id: 'calm',     label: 'Still',    emoji: '🌊', color: 'rgba(14,165,233,0.9)'  },
  { id: 'anxious',  label: 'Ground',   emoji: '🌀', color: 'rgba(251,146,60,0.9)'  },
]

// ---- AI Mood Input ----
function AIMoodInput({ onMoodDetected }: { onMoodDetected: (mood: any) => void }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [expanded, setExpanded] = useState(false)

  const analyze = useCallback(async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/mood-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      setResult(data)
      onMoodDetected(data)
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }, [text, loading, onMoodDetected])

  return (
    <div className="px-5 mb-5">
      <motion.div
        layout
        className="rounded-[20px] overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <motion.button
          className="w-full flex items-center gap-3 px-4 py-3.5"
          onClick={() => setExpanded(e => !e)}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.2)', border: '0.5px solid rgba(139,92,246,0.3)' }}>
            ✦
          </div>
          <div className="flex-1 text-left">
            <p className="text-[12px] font-medium text-white/80">
              {result ? `Mood detected: ${result.primaryMood}` : 'How are you feeling right now?'}
            </p>
            <p className="text-[10px] text-white/35 mt-0.5">
              {result ? result.insight : 'Describe it — AI will find your sound'}
            </p>
          </div>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="text-white/30 text-xs">▾</motion.span>
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={`"exhausted but still here"\n"anxious and can't slow down"\n"feeling light today"…`}
                  className="w-full resize-none rounded-[14px] p-3 text-[13px] text-white/80 placeholder-white/25 outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    minHeight: '76px',
                    fontFamily: 'inherit',
                  }}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) analyze() }}
                />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={analyze}
                  disabled={!text.trim() || loading}
                  className="w-full py-2.5 rounded-[14px] text-[13px] font-medium transition-all"
                  style={{
                    background: text.trim() && !loading
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.5), rgba(99,102,241,0.6))'
                      : 'rgba(255,255,255,0.05)',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    color: text.trim() ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⟳</motion.span>
                      Reading your energy…
                    </span>
                  ) : 'Find my sound →'}
                </motion.button>

                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-[14px] p-3 space-y-2"
                      style={{ background: 'rgba(139,92,246,0.1)', border: '0.5px solid rgba(139,92,246,0.2)' }}
                    >
                      <p className="text-[12px] text-purple-200/80 italic leading-relaxed">"{result.insight}"</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ background: 'rgba(139,92,246,0.2)', color: 'rgba(196,181,253,0.9)' }}>
                          {result.primaryMood}
                        </span>
                        {result.musicMood && <><span className="text-[10px] text-white/25">·</span>
                        <span className="text-[10px] text-white/40">{result.musicMood}</span></>}
                        {result.ambientSound && <><span className="text-[10px] text-white/25">·</span>
                        <span className="text-[10px] text-white/40">🔮 {result.ambientSound?.replace(/-/g, ' ')}</span></>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ---- Ambient Soundscape Section ----
function AmbientSection() {
  const [activePreset, setActivePreset] = useState<AmbientPreset | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [engine, setEngine] = useState<any>(null)
  const [started, setStarted] = useState(false)

  // Load engine client-side only
  useEffect(() => {
    const eng = getAmbientEngine()
    setEngine(eng)
  }, [])

  const togglePreset = useCallback(async (preset: AmbientPreset) => {
    if (!engine) return
    if (activePreset === preset && isPlaying) {
      await engine.stop()
      setIsPlaying(false)
      setActivePreset(null)
    } else {
      setActivePreset(preset)
      setIsPlaying(true)
      setStarted(true)
      await engine.play(preset, volume)
    }
  }, [engine, activePreset, isPlaying, volume])

  const handleVolume = useCallback((v: number) => {
    setVolume(v)
    engine?.setVolume(v)
  }, [engine])

  return (
    <div className="px-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-white/30 mb-0.5">Ambient Sounds</p>
          <p className="text-[12px] text-white/45 font-light">Synthesized in your browser · no downloads</p>
        </div>
        {isPlaying && (
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-white/30 uppercase tracking-wider">vol</span>
            <input
              type="range" min={0} max={1} step={0.05} value={volume}
              onChange={e => handleVolume(parseFloat(e.target.value))}
              className="w-16"
              style={{ accentColor: '#a78bfa' }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {AMBIENT_PRESETS.map((preset, i) => {
          const active = activePreset === preset.id && isPlaying
          return (
            <motion.button
              key={preset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => togglePreset(preset.id)}
              className="relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-[16px] transition-all duration-300"
              style={{
                background: active ? preset.color.replace('0.5)', '0.15)') : 'rgba(255,255,255,0.04)',
                border: `0.5px solid ${active ? preset.color : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {active && (
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-[16px]"
                  style={{ background: preset.color.replace('0.5)', '0.1)') }}
                />
              )}
              <span className="text-xl relative z-10">{preset.emoji}</span>
              <span className="text-[10px] font-medium relative z-10 text-center leading-tight"
                style={{ color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}>
                {preset.label}
              </span>
              {active && (
                <div className="flex gap-0.5 relative z-10 items-end h-3">
                  {[0,1,2].map(j => (
                    <motion.div key={j} className="w-[3px] rounded-sm"
                      style={{ background: 'rgba(255,255,255,0.5)' }}
                      animate={{ height: [2, 8 + j * 3, 2] }}
                      transition={{ duration: 0.7 + j * 0.2, repeat: Infinity, delay: j * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
      {!started && (
        <p className="text-[10px] text-white/20 text-center mt-3">
          Tap to start · works offline · no audio files needed
        </p>
      )}
    </div>
  )
}

// ---- Main Page ----
export default function MusicPage() {
  const currentMood = useLuminaStore(s => s.currentMood)
  const { player, playPlaylist, togglePlay } = usePlayer()

  const [moodFilter, setMoodFilter] = useState('all')
  const [showPlayer, setShowPlayer] = useState(false)
  const [expandedPlaylist, setExpandedPlaylist] = useState<Playlist | null>(null)
  const [activeTab, setActiveTab] = useState<'playlists' | 'ambient'>('playlists')

  const filteredPlaylists = moodFilter === 'all'
    ? PLAYLISTS
    : (MOOD_PLAYLIST_MAP[moodFilter] ?? [])
        .map(id => PLAYLISTS.find(p => p.id === id))
        .filter(Boolean) as typeof PLAYLISTS

  const activePlaylistId = player.currentTrack
    ? PLAYLISTS.find(pl => pl.tracks.some(t => t.id === player.currentTrack?.id))?.id
    : null

  const handlePlay = useCallback((playlist: Playlist) => {
    if (activePlaylistId === playlist.id) togglePlay()
    else playPlaylist(playlist)
  }, [activePlaylistId, togglePlay, playPlaylist])

  const handleMoodDetected = useCallback((data: any) => {
    if (data?.primaryMood) setMoodFilter(data.primaryMood)
  }, [])

  return (
    <main className="relative min-h-dvh overflow-hidden bg-lumina-void">
      <AtmosphericBackground mood={currentMood} />

      <AnimatePresence>
        {showPlayer && <MusicPlayer onClose={() => setShowPlayer(false)} />}
      </AnimatePresence>

      <div className="relative z-content flex flex-col min-h-dvh pb-36">
        <div className="safe-top" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-5 pt-6 pb-4"
        >
          <p className="text-[10px] uppercase tracking-[0.12em] text-white/30 mb-1">Lumina Radio</p>
          <h1 className="text-[26px] font-semibold leading-tight text-dreamy">Your Soundtrack</h1>
          <p className="text-sm font-light text-white/30 mt-1.5">Music that meets you where you are.</p>
        </motion.div>

        {/* AI mood input */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <AIMoodInput onMoodDetected={handleMoodDetected} />
        </motion.div>

        {/* Tab switcher */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="px-5 mb-4">
          <div className="flex rounded-[14px] p-1 gap-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
            {[{ id: 'playlists', label: '🎵 Playlists' }, { id: 'ambient', label: '🔮 Ambiance' }].map(tab => (
              <motion.button key={tab.id} whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 py-2 rounded-[11px] text-[12px] font-medium transition-all duration-200"
                style={{
                  background: activeTab === tab.id ? 'rgba(139,92,246,0.2)' : 'transparent',
                  color: activeTab === tab.id ? 'rgba(196,181,253,0.95)' : 'rgba(255,255,255,0.35)',
                  border: activeTab === tab.id ? '0.5px solid rgba(139,92,246,0.35)' : '0.5px solid transparent',
                }}>
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'playlists' ? (
            <motion.div key="playlists" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              {/* Mood filters */}
              <div className="px-5 mb-5">
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {MOOD_FILTER_OPTIONS.map(opt => {
                    const active = moodFilter === opt.id
                    return (
                      <motion.button key={opt.id} whileTap={{ scale: 0.95 }}
                        onClick={() => setMoodFilter(opt.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 transition-all duration-200"
                        style={{
                          background: active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                          border: `0.5px solid ${active ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.08)'}`,
                          color: active ? opt.color : 'rgba(255,255,255,0.35)',
                        }}>
                        <span className="text-xs">{opt.emoji}</span>
                        <span className="text-[11px] font-medium">{opt.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Playlist grid */}
              <div className="px-4">
                <div className="grid grid-cols-2 gap-3">
                  <AnimatePresence mode="popLayout">
                    {filteredPlaylists.map((pl, i) => (
                      <motion.div key={pl.id} layout
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.88 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}>
                        <PlaylistCard
                          playlist={pl}
                          isActive={activePlaylistId === pl.id && player.isPlaying}
                          onPlay={handlePlay}
                          onOpen={setExpandedPlaylist}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {filteredPlaylists.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-3xl mb-3">🎵</p>
                    <p className="text-sm text-white/35">No playlists for this mood yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="ambient" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
              <AmbientSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded playlist sheet */}
      <AnimatePresence>
        {expandedPlaylist && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[22]"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setExpandedPlaylist(null)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 40 }}
              className="fixed bottom-0 left-0 right-0 z-[23] rounded-t-[28px] overflow-hidden"
              style={{ background: 'rgba(12,8,28,0.97)', border: '0.5px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)', maxHeight: '75vh' }}>
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-8 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
              </div>
              <div className="px-5 pt-2 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: expandedPlaylist.gradient }}>
                    {expandedPlaylist.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white/95">{expandedPlaylist.title}</h3>
                    <p className="text-[11px] text-white/35 mt-0.5 leading-relaxed line-clamp-2">{expandedPlaylist.description}</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handlePlay(expandedPlaylist)}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}>
                    <span className="text-sm text-white">
                      {activePlaylistId === expandedPlaylist.id && player.isPlaying ? '⏸' : '▶'}
                    </span>
                  </motion.button>
                </div>
              </div>
              <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: '45vh' }}>
                {expandedPlaylist.tracks.map((track, i) => {
                  const isCurrent = player.currentTrack?.id === track.id
                  return (
                    <motion.button key={track.id} whileTap={{ scale: 0.98 }}
                      onClick={() => { playPlaylist(expandedPlaylist, i); setTimeout(() => setExpandedPlaylist(null), 300) }}
                      className="w-full flex items-center gap-3 py-3 rounded-[12px] px-2 -mx-2"
                      style={{ background: isCurrent ? 'rgba(139,92,246,0.12)' : 'transparent' }}>
                      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-xs flex-shrink-0"
                        style={{ background: isCurrent ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)', color: isCurrent ? 'rgba(196,181,253,0.9)' : 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                        {isCurrent && player.isPlaying ? '♫' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[13px] font-medium truncate"
                          style={{ color: isCurrent ? 'rgba(196,181,253,0.95)' : 'rgba(255,255,255,0.8)' }}>
                          {track.title}
                        </p>
                        <p className="text-[10px] text-white/30 truncate">{track.artist}</p>
                      </div>
                      <span className="text-[11px] text-white/25 flex-shrink-0">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <NowPlayingBar onExpand={() => setShowPlayer(true)} />
      <BottomNav />
    </main>
  )
}
    ? PLAYLISTS.find(pl => pl.tracks.some(t => t.id === player.currentTrack?.id))?.id
    : null

  const handlePlay = useCallback((playlist: Playlist) => {
    if (activePlaylistId === playlist.id) togglePlay()
    else playPlaylist(playlist)
  }, [activePlaylistId, togglePlay, playPlaylist])

  const handleMoodDetected = useCallback((data: any) => {
    if (data?.primaryMood) setMoodFilter(data.primaryMood)
  }, [])

  return (
    <main className="relative min-h-dvh overflow-hidden bg-lumina-void">
      <AtmosphericBackground mood={currentMood} />

      <AnimatePresence>
        {showPlayer && <MusicPlayer onClose={() => setShowPlayer(false)} />}
      </AnimatePresence>

      <div className="relative z-content flex flex-col min-h-dvh pb-36">
        <div className="safe-top" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-5 pt-6 pb-4"
        >
          <p className="text-[10px] uppercase tracking-[0.12em] text-white/30 mb-1">Lumina Radio</p>
          <h1 className="text-[26px] font-semibold leading-tight text-dreamy">Your Soundtrack</h1>
          <p className="text-sm font-light text-white/30 mt-1.5">Music that meets you where you are.</p>
        </motion.div>

        {/* AI mood input */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <AIMoodInput onMoodDetected={handleMoodDetected} />
        </motion.div>

        {/* Tab switcher */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="px-5 mb-4">
          <div className="flex rounded-[14px] p-1 gap-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
            {[{ id: 'playlists', label: '🎵 Playlists' }, { id: 'ambient', label: '🔮 Ambiance' }].map(tab => (
              <motion.button key={tab.id} whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 py-2 rounded-[11px] text-[12px] font-medium transition-all duration-200"
                style={{
                  background: activeTab === tab.id ? 'rgba(139,92,246,0.2)' : 'transparent',
                  color: activeTab === tab.id ? 'rgba(196,181,253,0.95)' : 'rgba(255,255,255,0.35)',
                  border: activeTab === tab.id ? '0.5px solid rgba(139,92,246,0.35)' : '0.5px solid transparent',
                }}>
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'playlists' ? (
            <motion.div key="playlists" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              {/* Mood filters */}
              <div className="px-5 mb-5">
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {MOOD_FILTER_OPTIONS.map(opt => {
                    const active = moodFilter === opt.id
                    return (
                      <motion.button key={opt.id} whileTap={{ scale: 0.95 }}
                        onClick={() => setMoodFilter(opt.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 transition-all duration-200"
                        style={{
                          background: active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                          border: `0.5px solid ${active ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.08)'}`,
                          color: active ? opt.color : 'rgba(255,255,255,0.35)',
                        }}>
                        <span className="text-xs">{opt.emoji}</span>
                        <span className="text-[11px] font-medium">{opt.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Playlist grid */}
              <div className="px-4">
                <div className="grid grid-cols-2 gap-3">
                  <AnimatePresence mode="popLayout">
                    {filteredPlaylists.map((pl, i) => (
                      <motion.div key={pl.id} layout
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.88 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}>
                        <PlaylistCard
                          playlist={pl}
                          isActive={activePlaylistId === pl.id && player.isPlaying}
                          onPlay={handlePlay}
                          onOpen={setExpandedPlaylist}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {filteredPlaylists.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-3xl mb-3">🎵</p>
                    <p className="text-sm text-white/35">No playlists for this mood yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="ambient" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
              <AmbientSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded playlist sheet */}
      <AnimatePresence>
        {expandedPlaylist && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[22]"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setExpandedPlaylist(null)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 40 }}
              className="fixed bottom-0 left-0 right-0 z-[23] rounded-t-[28px] overflow-hidden"
              style={{ background: 'rgba(12,8,28,0.97)', border: '0.5px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)', maxHeight: '75vh' }}>
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-8 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
              </div>
              <div className="px-5 pt-2 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: expandedPlaylist.gradient }}>
                    {expandedPlaylist.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white/95">{expandedPlaylist.title}</h3>
                    <p className="text-[11px] text-white/35 mt-0.5 leading-relaxed line-clamp-2">{expandedPlaylist.description}</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handlePlay(expandedPlaylist)}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}>
                    <span className="text-sm text-white">
                      {activePlaylistId === expandedPlaylist.id && player.isPlaying ? '⏸' : '▶'}
                    </span>
                  </motion.button>
                </div>
              </div>
              <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: '45vh' }}>
                {expandedPlaylist.tracks.map((track, i) => {
                  const isCurrent = player.currentTrack?.id === track.id
                  return (
                    <motion.button key={track.id} whileTap={{ scale: 0.98 }}
                      onClick={() => { playPlaylist(expandedPlaylist, i); setTimeout(() => setExpandedPlaylist(null), 300) }}
                      className="w-full flex items-center gap-3 py-3 rounded-[12px] px-2 -mx-2"
                      style={{ background: isCurrent ? 'rgba(139,92,246,0.12)' : 'transparent' }}>
                      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-xs flex-shrink-0"
                        style={{ background: isCurrent ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)', color: isCurrent ? 'rgba(196,181,253,0.9)' : 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                        {isCurrent && player.isPlaying ? '♫' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[13px] font-medium truncate"
                          style={{ color: isCurrent ? 'rgba(196,181,253,0.95)' : 'rgba(255,255,255,0.8)' }}>
                          {track.title}
                        </p>
                        <p className="text-[10px] text-white/30 truncate">{track.artist}</p>
                      </div>
                      <span className="text-[11px] text-white/25 flex-shrink-0">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <NowPlayingBar onExpand={() => setShowPlayer(true)} />
      <BottomNav />
    </main>
  )
}
