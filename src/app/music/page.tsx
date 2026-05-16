'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AtmosphericBackground from '@/components/layout/AtmosphericBackground'
import BottomNav from '@/components/layout/BottomNav'
import PlaylistCard from '@/components/music/PlaylistCard'
import NowPlayingBar from '@/components/music/NowPlayingBar'
import MusicPlayer from '@/components/music/MusicPlayer'
import { usePlayer } from '@/hooks/usePlayer'
import { useLuminaStore } from '@/store/useAppStore'
import { PLAYLISTS, MOOD_PLAYLIST_MAP } from '@/lib/music/playlistData'
import type { Playlist } from '@/types'

// ============================================================
// /music — Music home: playlist grid + now-playing bar
// ============================================================

const MOOD_FILTER_OPTIONS = [
  { id: 'all',     label: 'All',       emoji: '✨' },
  { id: 'alive',   label: 'Energy',    emoji: '🔥' },
  { id: 'joyful',  label: 'Joyful',    emoji: '🌟' },
  { id: 'soft',    label: 'Soft',      emoji: '🌸' },
  { id: 'drifting',label: 'Night',     emoji: '🌙' },
  { id: 'healing', label: 'Healing',   emoji: '🌿' },
  { id: 'heavy',   label: 'Release',   emoji: '🎸' },
  { id: 'calm',    label: 'Calm',      emoji: '🌊' },
]

export default function MusicPage() {
  const currentMood = useLuminaStore(s => s.currentMood)
  const { player, playPlaylist, togglePlay } = usePlayer()

  const [moodFilter, setMoodFilter] = useState('all')
  const [showPlayer, setShowPlayer] = useState(false)
  const [expandedPlaylist, setExpandedPlaylist] = useState<Playlist | null>(null)

  // Filter playlists by selected mood using MOOD_PLAYLIST_MAP
  const filteredPlaylists = moodFilter === 'all'
    ? PLAYLISTS
    : (MOOD_PLAYLIST_MAP[moodFilter] ?? [])
        .map(id => PLAYLISTS.find(p => p.id === id))
        .filter(Boolean) as typeof PLAYLISTS

  // Detect active playlist
  const activePlaylistId = player.currentTrack
    ? PLAYLISTS.find(pl => pl.tracks.some(t => t.id === player.currentTrack?.id))?.id
    : null

  const handlePlay = useCallback((playlist: Playlist) => {
    const isActive = activePlaylistId === playlist.id
    if (isActive) {
      togglePlay()
    } else {
      playPlaylist(playlist)
    }
  }, [activePlaylistId, togglePlay, playPlaylist])

  const handleOpen = useCallback((playlist: Playlist) => {
    setExpandedPlaylist(playlist)
  }, [])

  return (
    <main className="relative min-h-dvh overflow-hidden bg-lumina-void">
      <AtmosphericBackground mood={currentMood} />

      {/* Full-screen player overlay */}
      <AnimatePresence>
        {showPlayer && (
          <MusicPlayer onClose={() => setShowPlayer(false)} />
        )}
      </AnimatePresence>

      {/* Scrollable content */}
      <div className="relative z-content flex flex-col min-h-dvh pb-36">
        <div className="safe-top" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-5 pt-6 pb-4"
        >
          <p className="text-[10px] uppercase tracking-[0.12em] text-white/30 mb-1">
            Lumina Radio
          </p>
          <h1 className="text-[26px] font-semibold leading-tight text-dreamy">
            Your Soundtrack
          </h1>
          <p className="text-sm font-light text-white/30 mt-1.5">
            Music that meets you where you are.
          </p>
        </motion.div>

        {/* Mood filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="px-5 mb-5"
        >
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {MOOD_FILTER_OPTIONS.map((opt) => {
              const isActive = moodFilter === opt.id
              return (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMoodFilter(opt.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 transition-all duration-200"
                  style={{
                    background: isActive
                      ? 'rgba(139,92,246,0.25)'
                      : 'rgba(255,255,255,0.05)',
                    border: `0.5px solid ${isActive ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: isActive ? 'rgba(196,181,253,0.95)' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  <span className="text-xs">{opt.emoji}</span>
                  <span className="text-[12px] font-medium">{opt.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Playlist grid */}
        <div className="px-4">
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredPlaylists.map((pl, i) => (
                <motion.div
                  key={pl.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <PlaylistCard
                    playlist={pl}
                    isActive={activePlaylistId === pl.id && player.isPlaying}
                    onPlay={handlePlay}
                    onOpen={handleOpen}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPlaylists.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-3xl mb-3">🎵</p>
              <p className="text-sm text-white/35">No playlists for this mood yet.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Expanded playlist sheet */}
      <AnimatePresence>
        {expandedPlaylist && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[22]"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setExpandedPlaylist(null)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 40 }}
              className="fixed bottom-0 left-0 right-0 z-[23] rounded-t-[28px] overflow-hidden"
              style={{
                background: 'rgba(12,8,28,0.97)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(24px)',
                maxHeight: '75vh',
              }}
            >
              {/* Sheet drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-8 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
              </div>

              {/* Playlist header */}
              <div className="px-5 pt-2 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-[16px] flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: expandedPlaylist.gradient }}
                  >
                    {expandedPlaylist.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white/95">{expandedPlaylist.title}</h3>
                    <p className="text-[11px] text-white/35 mt-0.5 leading-relaxed line-clamp-2">
                      {expandedPlaylist.description}
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePlay(expandedPlaylist)}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                      boxShadow: '0 4px 16px rgba(139,92,246,0.4)',
                    }}
                  >
                    <span className="text-sm text-white">
                      {activePlaylistId === expandedPlaylist.id && player.isPlaying ? '⏸' : '▶'}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Track list */}
              <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: '45vh' }}>
                {expandedPlaylist.tracks.map((track, i) => {
                  const isCurrentTrack = player.currentTrack?.id === track.id
                  return (
                    <motion.button
                      key={track.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        playPlaylist(expandedPlaylist, i)
                        setTimeout(() => setExpandedPlaylist(null), 300)
                      }}
                      className="w-full flex items-center gap-3 py-3 rounded-[12px] px-2 -mx-2 transition-all duration-150"
                      style={{
                        background: isCurrentTrack ? 'rgba(139,92,246,0.12)' : 'transparent',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-[10px] flex items-center justify-center text-xs flex-shrink-0"
                        style={{
                          background: isCurrentTrack
                            ? 'rgba(139,92,246,0.3)'
                            : 'rgba(255,255,255,0.05)',
                          color: isCurrentTrack ? 'rgba(196,181,253,0.9)' : 'rgba(255,255,255,0.25)',
                          fontWeight: 600,
                        }}
                      >
                        {isCurrentTrack && player.isPlaying ? '♫' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p
                          className="text-[13px] font-medium truncate"
                          style={{ color: isCurrentTrack ? 'rgba(196,181,253,0.95)' : 'rgba(255,255,255,0.8)' }}
                        >
                          {track.title}
                        </p>
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

      {/* NowPlayingBar — sits above BottomNav */}
      <NowPlayingBar onExpand={() => setShowPlayer(true)} />

      <BottomNav />
    </main>
  )
}
