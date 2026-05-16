'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useLuminaStore } from '@/store/useAppStore'
import type { Track, Playlist } from '@/types'

// ============================================================
// usePlayer — Audio element management hook
// Phase 5: play/pause/seek/volume/crossfade
// ============================================================

export function usePlayer() {
  const { player, setPlayer } = useLuminaStore(s => ({
    player: s.player,
    setPlayer: s.setPlayer,
  }))

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const nextAudioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Init audio element
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = player.volume
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      if (crossfadeTimeoutRef.current) clearTimeout(crossfadeTimeoutRef.current)
    }
  }, [])

  // Sync volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = player.volume
    }
  }, [player.volume])

  // Start progress tracking when playing
  useEffect(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    if (player.isPlaying && player.currentTrack) {
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          const progress = audioRef.current.currentTime / audioRef.current.duration
          setPlayer({ progress: Math.min(progress, 1) })
          // Trigger crossfade at 95% to smoothly transition to next
          if (progress >= 0.95 && !player.isCrossfading) {
            triggerCrossfade()
          }
        } else {
          // No real src — simulate progress for demo
          setPlayer({
            progress: Math.min((player.progress ?? 0) + 0.001, 1)
          })
        }
      }, 200)
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [player.isPlaying, player.currentTrack])

  // ---- Actions ----

  const play = useCallback((track?: Track, playlist?: Track[]) => {
    if (track) {
      if (audioRef.current) {
        audioRef.current.pause()
        if (track.src) {
          audioRef.current.src = track.src
          audioRef.current.play().catch(() => {/* no audio files in demo */})
        }
      }
      setPlayer({
        currentTrack: track,
        playlist: playlist ?? player.playlist,
        isPlaying: true,
        progress: 0,
      })
    } else if (player.currentTrack) {
      audioRef.current?.play().catch(() => {})
      setPlayer({ isPlaying: true })
    }
  }, [player])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setPlayer({ isPlaying: false })
  }, [])

  const togglePlay = useCallback(() => {
    if (player.isPlaying) pause()
    else play()
  }, [player.isPlaying, play, pause])

  const seek = useCallback((progress: number) => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime = audioRef.current.duration * progress
    }
    setPlayer({ progress })
  }, [])

  const setVolume = useCallback((volume: number) => {
    const v = Math.max(0, Math.min(1, volume))
    if (audioRef.current) audioRef.current.volume = v
    setPlayer({ volume: v })
  }, [])

  const playNext = useCallback(() => {
    const { playlist, currentTrack } = player
    if (!playlist.length) return
    const idx = currentTrack ? playlist.findIndex(t => t.id === currentTrack.id) : -1
    const next = playlist[(idx + 1) % playlist.length]
    play(next, playlist)
  }, [player, play])

  const playPrev = useCallback(() => {
    const { playlist, currentTrack } = player
    if (!playlist.length) return
    const idx = currentTrack ? playlist.findIndex(t => t.id === currentTrack.id) : 0
    const prev = playlist[(idx - 1 + playlist.length) % playlist.length]
    play(prev, playlist)
  }, [player, play])

  const playPlaylist = useCallback((pl: { tracks: Track[] }, startIndex = 0) => {
    play(pl.tracks[startIndex], pl.tracks)
  }, [play])

  // Crossfade: fade out current over 2s, fade in next
  const triggerCrossfade = useCallback(() => {
    if (player.isCrossfading) return
    setPlayer({ isCrossfading: true })

    let vol = player.volume
    const fadeStep = vol / 20  // 20 steps over 2s = 100ms each

    const fadeOut = setInterval(() => {
      vol = Math.max(0, vol - fadeStep)
      if (audioRef.current) audioRef.current.volume = vol
      if (vol <= 0) {
        clearInterval(fadeOut)
        playNext()
        // Fade in
        if (audioRef.current) audioRef.current.volume = 0
        let fadeVol = 0
        const target = player.volume
        const fadeIn = setInterval(() => {
          fadeVol = Math.min(target, fadeVol + fadeStep)
          if (audioRef.current) audioRef.current.volume = fadeVol
          if (fadeVol >= target) {
            clearInterval(fadeIn)
            setPlayer({ isCrossfading: false })
          }
        }, 100)
      }
    }, 100)
  }, [player, playNext])

  return {
    player,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    playNext,
    playPrev,
    playPlaylist,
  }
}
