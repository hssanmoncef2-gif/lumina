'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ============================================================
// Types
// ============================================================
interface Track {
  id: string
  title: string
  artist: string
  duration: number
  mood: string[]
}

interface Playlist {
  id: string
  title: string
  description: string
  emoji: string
  gradient: string
  tracks: Track[]
  moods: string[]
}

// ============================================================
// Data
// ============================================================
const PLAYLISTS: Playlist[] = [
  {
    id: 'pl-arabic-fire',
    title: 'Arabic Fire 🔥',
    description: 'High-energy Arabic pop to ignite your night.',
    emoji: '🔥',
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.5) 0%, rgba(245,158,11,0.45) 100%)',
    moods: ['alive', 'joyful'],
    tracks: [
      { id: 'ap-01', title: "Am Bemzah Ma'ak", artist: 'Najwa Karam', duration: 225, mood: ['alive','joyful'] },
      { id: 'ap-02', title: 'Degou El Toboul', artist: 'Myriam Fares', duration: 210, mood: ['alive','joyful'] },
      { id: 'ap-03', title: 'Haklek Rahtak', artist: 'Myriam Fares', duration: 198, mood: ['alive','joyful'] },
      { id: 'ap-04', title: 'Maalesh', artist: 'Myriam Fares', duration: 204, mood: ['alive','joyful'] },
      { id: 'ap-05', title: 'Atlah', artist: 'Myriam Fares', duration: 217, mood: ['alive','joyful'] },
      { id: 'ap-06', title: 'Boom Boom', artist: 'Hind Ziadi', duration: 190, mood: ['alive','joyful'] },
      { id: 'ap-07', title: 'Mesaytara', artist: 'Lamis Kan', duration: 208, mood: ['alive','joyful'] },
      { id: 'ap-08', title: 'Motamakkina', artist: 'Lamis Kan', duration: 215, mood: ['alive','joyful'] },
      { id: 'ap-09', title: "Enta Bet'oul Eih", artist: 'Myriam Fares', duration: 222, mood: ['alive','joyful'] },
      { id: 'ap-10', title: 'Badna Nwalee El Jaw', artist: 'Nancy Ajram', duration: 200, mood: ['alive','joyful'] },
    ],
  },
  {
    id: 'pl-arabic-soft',
    title: 'Arabic Soft 🌸',
    description: 'Tender voices and warm melodies.',
    emoji: '🌸',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.4) 0%, rgba(196,181,253,0.4) 100%)',
    moods: ['soft', 'healing', 'calm'],
    tracks: [
      { id: 'as-01', title: 'Sho Baddo', artist: 'Yara', duration: 228, mood: ['soft','healing'] },
      { id: 'as-02', title: 'Ma Yhimmak', artist: 'Yara', duration: 215, mood: ['soft','calm'] },
      { id: 'as-03', title: 'Shey Ghareeb', artist: 'Nour Helou', duration: 232, mood: ['soft','drifting'] },
      { id: 'as-04', title: 'Ma Tegi Hena', artist: 'Nancy Ajram', duration: 218, mood: ['soft','calm'] },
      { id: 'as-05', title: "Tla'ayna", artist: 'Maritta Hallani', duration: 225, mood: ['soft','healing'] },
      { id: 'as-06', title: "Esma'ny", artist: 'Carole Samaha', duration: 242, mood: ['soft','healing'] },
      { id: 'as-07', title: 'Ettala Fia', artist: 'Carole Samaha', duration: 236, mood: ['soft','calm'] },
      { id: 'as-08', title: 'Eh Eh', artist: 'Sherine', duration: 210, mood: ['soft','joyful'] },
      { id: 'as-09', title: 'Howa Da', artist: 'Sherine', duration: 220, mood: ['soft','healing'] },
      { id: 'as-10', title: 'Lawn Ouyounak', artist: 'Nancy Ajram', duration: 235, mood: ['soft','calm'] },
    ],
  },
  {
    id: 'pl-arabic-nights',
    title: 'Arabic Nights 🌙',
    description: 'Late nights and longing hearts.',
    emoji: '🌙',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.5) 0%, rgba(30,27,75,0.65) 100%)',
    moods: ['drifting', 'heavy'],
    tracks: [
      { id: 'an-01', title: 'Khalini Shoufak', artist: 'Najwa Karam', duration: 258, mood: ['drifting','soft'] },
      { id: 'an-02', title: 'Allah Yeshghelo Balo', artist: 'Najwa Karam', duration: 245, mood: ['drifting','heavy'] },
      { id: 'an-03', title: 'Ma Fi Noum', artist: 'Najwa Karam', duration: 262, mood: ['drifting','heavy'] },
      { id: 'an-04', title: 'Eidak', artist: 'Najwa Karam', duration: 248, mood: ['drifting','soft'] },
      { id: 'an-05', title: "Ta'a Khabyak", artist: 'Najwa Karam', duration: 255, mood: ['drifting','heavy'] },
      { id: 'an-06', title: 'Fakerne', artist: 'Haifa Wehbe', duration: 240, mood: ['drifting','heavy'] },
      { id: 'an-07', title: 'Enta Tani', artist: 'Haifa Wehbe', duration: 235, mood: ['drifting','soft'] },
      { id: 'an-08', title: 'El Wawa', artist: 'Haifa Wehbe', duration: 228, mood: ['drifting','joyful'] },
      { id: 'an-09', title: 'Rajab', artist: 'Haifa Wehbe', duration: 232, mood: ['drifting','alive'] },
      { id: 'an-10', title: 'Talqa', artist: 'Ahlam', duration: 250, mood: ['drifting','heavy'] },
    ],
  },
  {
    id: 'pl-arabic-healing',
    title: 'Arabic Healing 🌿',
    description: 'Songs that understand your heart.',
    emoji: '🌿',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.38) 0%, rgba(6,182,212,0.38) 100%)',
    moods: ['healing', 'soft'],
    tracks: [
      { id: 'ah-01', title: 'Namet Nenna', artist: 'Ruby', duration: 230, mood: ['healing','soft'] },
      { id: 'ah-02', title: 'Alby Plastic', artist: 'Ruby', duration: 215, mood: ['healing','alive'] },
      { id: 'ah-03', title: "3 Sa'at Metwasla", artist: 'Ruby', duration: 240, mood: ['healing','drifting'] },
      { id: 'ah-04', title: 'Hetta Tanya', artist: 'Ruby', duration: 225, mood: ['healing','soft'] },
      { id: 'ah-05', title: 'Ya Tabtab Wa Dallaa', artist: 'Nancy Ajram', duration: 245, mood: ['healing','joyful'] },
      { id: 'ah-06', title: 'Ah W Noss', artist: 'Nancy Ajram', duration: 220, mood: ['healing','soft'] },
      { id: 'ah-07', title: 'Aktar Shewaya', artist: 'Maya Diab', duration: 218, mood: ['healing','soft'] },
      { id: 'ah-08', title: 'Khalani', artist: 'Myriam Fares', duration: 208, mood: ['healing','alive'] },
    ],
  },
  {
    id: 'pl-britney',
    title: 'Britney Era ⚡',
    description: 'Early 2000s pop energy. Iconic, unapologetic, electric.',
    emoji: '⚡',
    gradient: 'linear-gradient(135deg, rgba(234,179,8,0.5) 0%, rgba(249,115,22,0.45) 100%)',
    moods: ['alive', 'joyful'],
    tracks: [
      { id: 'bp-01', title: '...Baby One More Time', artist: 'Britney Spears', duration: 211, mood: ['alive','joyful'] },
      { id: 'bp-02', title: "Oops!... I Did It Again", artist: 'Britney Spears', duration: 204, mood: ['alive','joyful'] },
      { id: 'bp-03', title: 'Toxic', artist: 'Britney Spears', duration: 198, mood: ['alive'] },
      { id: 'bp-04', title: 'Gimme More', artist: 'Britney Spears', duration: 240, mood: ['alive'] },
      { id: 'bp-05', title: 'Womanizer', artist: 'Britney Spears', duration: 216, mood: ['alive','joyful'] },
      { id: 'bp-06', title: 'Hold It Against Me', artist: 'Britney Spears', duration: 228, mood: ['alive'] },
      { id: 'bp-07', title: 'Till the World Ends', artist: 'Britney Spears', duration: 234, mood: ['alive','joyful'] },
      { id: 'bp-08', title: 'Work Bitch', artist: 'Britney Spears', duration: 222, mood: ['alive'] },
      { id: 'bp-09', title: 'Criminal', artist: 'Britney Spears', duration: 225, mood: ['drifting','soft'] },
      { id: 'bp-10', title: 'Everytime', artist: 'Britney Spears', duration: 238, mood: ['heavy','soft'] },
    ],
  },
  {
    id: 'pl-bruno',
    title: 'Bruno Vibes 🌟',
    description: 'Smooth, feel-good grooves.',
    emoji: '🌟',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.4) 0%, rgba(234,179,8,0.35) 100%)',
    moods: ['joyful', 'alive', 'soft'],
    tracks: [
      { id: 'bm-01', title: "That's What I Like", artist: 'Bruno Mars', duration: 206, mood: ['joyful','alive'] },
      { id: 'bm-02', title: 'Treasure', artist: 'Bruno Mars', duration: 173, mood: ['joyful','alive'] },
      { id: 'bm-03', title: 'Uptown Funk', artist: 'Bruno Mars', duration: 270, mood: ['joyful','alive'] },
      { id: 'bm-04', title: 'Grenade', artist: 'Bruno Mars', duration: 222, mood: ['heavy','healing'] },
      { id: 'bm-05', title: 'Just the Way You Are', artist: 'Bruno Mars', duration: 220, mood: ['soft','joyful'] },
      { id: 'bm-06', title: 'Count On Me', artist: 'Bruno Mars', duration: 193, mood: ['soft','healing'] },
      { id: 'bm-07', title: 'Locked Out of Heaven', artist: 'Bruno Mars', duration: 233, mood: ['joyful','alive'] },
      { id: 'bm-08', title: 'Versace on the Floor', artist: 'Bruno Mars', duration: 274, mood: ['soft','drifting'] },
    ],
  },
  {
    id: 'pl-dystinct',
    title: 'DYSTINCT Mode 👑',
    description: 'Arabic trap swagger. Walk tall, feel unstoppable.',
    emoji: '👑',
    gradient: 'linear-gradient(135deg, rgba(79,70,229,0.55) 0%, rgba(139,92,246,0.5) 100%)',
    moods: ['alive', 'joyful'],
    tracks: [
      { id: 'dy-01', title: 'BABABA WORLD', artist: 'DYSTINCT', duration: 188, mood: ['alive','joyful'] },
      { id: 'dy-02', title: 'Business', artist: 'DYSTINCT', duration: 195, mood: ['alive'] },
      { id: 'dy-03', title: 'LAYALI', artist: 'DYSTINCT', duration: 202, mood: ['drifting','alive'] },
      { id: 'dy-04', title: 'Tek Tek', artist: 'DYSTINCT', duration: 191, mood: ['alive','joyful'] },
      { id: 'dy-05', title: 'YAMA', artist: 'DYSTINCT', duration: 198, mood: ['alive','soft'] },
    ],
  },
  {
    id: 'pl-french-drift',
    title: 'French Drift 🌧️',
    description: 'French & international sounds for rainy evenings.',
    emoji: '🌧️',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(59,130,246,0.4) 100%)',
    moods: ['soft', 'drifting', 'calm'],
    tracks: [
      { id: 'fr-01', title: 'Petite Maison', artist: 'bba', duration: 210, mood: ['soft','drifting'] },
      { id: 'fr-02', title: "J'avoue", artist: 'Linh', duration: 225, mood: ['soft','calm'] },
      { id: 'fr-03', title: 'Les Mots', artist: 'Lolo Zouaï & Dinos', duration: 238, mood: ['drifting','soft'] },
      { id: 'fr-04', title: 'Conduire', artist: 'Louane', duration: 220, mood: ['soft','healing'] },
      { id: 'fr-05', title: 'ça pik un peu quand même', artist: 'miki', duration: 195, mood: ['soft','drifting'] },
      { id: 'fr-06', title: 'coeur maladroit', artist: 'Marine', duration: 215, mood: ['heavy','soft'] },
      { id: 'fr-07', title: 'la boss', artist: 'marguerite', duration: 200, mood: ['joyful','alive'] },
      { id: 'fr-08', title: 'Pour en parler', artist: 'Lynda & Franglish', duration: 228, mood: ['soft','healing'] },
      { id: 'fr-09', title: 'Viens on essaie', artist: 'Vitaa & Julien Doré', duration: 242, mood: ['soft','calm'] },
      { id: 'fr-10', title: 'Verano', artist: 'Ridsa', duration: 210, mood: ['joyful','alive'] },
    ],
  },
  {
    id: 'pl-queen',
    title: 'Queen Catharsis 🎸',
    description: "For when you need to feel it all.",
    emoji: '🎸',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.55) 0%, rgba(139,92,246,0.5) 100%)',
    moods: ['heavy', 'healing', 'alive'],
    tracks: [
      { id: 'cl-01', title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354, mood: ['heavy','healing','alive'] },
      { id: 'cl-02', title: "Don't Stop Me Now", artist: 'Queen', duration: 209, mood: ['alive','joyful'] },
      { id: 'cl-03', title: 'We Will Rock You', artist: 'Queen', duration: 121, mood: ['alive'] },
      { id: 'cl-04', title: 'We Are the Champions', artist: 'Queen', duration: 179, mood: ['alive','healing'] },
      { id: 'cl-05', title: 'Under Pressure', artist: 'Queen', duration: 248, mood: ['heavy','healing'] },
      { id: 'cl-06', title: 'Somebody to Love', artist: 'Queen', duration: 276, mood: ['heavy','healing'] },
      { id: 'cl-07', title: 'Radio Ga Ga', artist: 'Queen', duration: 344, mood: ['alive','drifting'] },
      { id: 'cl-08', title: 'I Want to Break Free', artist: 'Queen', duration: 259, mood: ['alive','joyful'] },
      { id: 'cl-09', title: 'The Show Must Go On', artist: 'Queen', duration: 262, mood: ['heavy','alive'] },
    ],
  },
]

const MOOD_FILTERS = [
  { id: 'all',      label: 'All',     emoji: '✦' },
  { id: 'alive',    label: 'Energy',  emoji: '⚡' },
  { id: 'joyful',   label: 'Joyful',  emoji: '✨' },
  { id: 'soft',     label: 'Tender',  emoji: '🌸' },
  { id: 'drifting', label: 'Adrift',  emoji: '🌙' },
  { id: 'healing',  label: 'Healing', emoji: '🌱' },
  { id: 'heavy',    label: 'Release', emoji: '🌧' },
  { id: 'calm',     label: 'Still',   emoji: '🌊' },
]

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

// ============================================================
// Main Page
// ============================================================
export default function MusicPage() {
  const router = useRouter()
  const [moodFilter, setMoodFilter] = useState('all')
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSheet, setShowSheet] = useState<Playlist | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate progress when "playing"
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (isPlaying && currentTrack) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 1) {
            // Auto-advance to next track
            if (activePlaylist) {
              const idx = activePlaylist.tracks.findIndex(t => t.id === currentTrack.id)
              const next = activePlaylist.tracks[(idx + 1) % activePlaylist.tracks.length]
              setCurrentTrack(next)
              return 0
            }
            return 0
          }
          return p + 1 / (currentTrack.duration * 5)
        })
      }, 200)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, currentTrack, activePlaylist])

  const filteredPlaylists = moodFilter === 'all'
    ? PLAYLISTS
    : PLAYLISTS.filter(pl => pl.moods.includes(moodFilter))

  const handlePlayPlaylist = useCallback((pl: Playlist, trackIndex = 0) => {
    if (activePlaylist?.id === pl.id && isPlaying) {
      setIsPlaying(false)
    } else {
      setActivePlaylist(pl)
      setCurrentTrack(pl.tracks[trackIndex])
      setIsPlaying(true)
      setProgress(0)
    }
  }, [activePlaylist, isPlaying])

  const handleToggle = useCallback(() => setIsPlaying(p => !p), [])

  const handleNext = useCallback(() => {
    if (!activePlaylist || !currentTrack) return
    const idx = activePlaylist.tracks.findIndex(t => t.id === currentTrack.id)
    setCurrentTrack(activePlaylist.tracks[(idx + 1) % activePlaylist.tracks.length])
    setProgress(0)
  }, [activePlaylist, currentTrack])

  const handlePrev = useCallback(() => {
    if (!activePlaylist || !currentTrack) return
    const idx = activePlaylist.tracks.findIndex(t => t.id === currentTrack.id)
    setCurrentTrack(activePlaylist.tracks[(idx - 1 + activePlaylist.tracks.length) % activePlaylist.tracks.length])
    setProgress(0)
  }, [activePlaylist, currentTrack])

  const isActivePlaylist = (pl: Playlist) => activePlaylist?.id === pl.id && isPlaying

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .music-page {
          min-height: 100dvh;
          background: linear-gradient(180deg, #080612 0%, #0e0a1f 50%, #0a0f1e 100%);
          font-family: 'Sora', 'Inter', sans-serif;
          color: white;
          overflow-x: hidden;
          padding-bottom: 160px;
        }
        .safe-top { height: env(safe-area-inset-top, 16px); }

        /* Header */
        .header { padding: 20px 20px 16px; }
        .header-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
        .header-title { font-size: 26px; font-weight: 600; background: linear-gradient(135deg, #e2d9f3, #a78bfa, #f9a8d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .header-sub { font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.3); margin-top: 6px; }

        /* Mood filters */
        .filters-wrap { padding: 0 20px 16px; overflow-x: auto; scrollbar-width: none; }
        .filters-wrap::-webkit-scrollbar { display: none; }
        .filters-row { display: flex; gap: 8px; white-space: nowrap; }
        .filter-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 999px; border: 0.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.35);
          font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.2s;
          font-family: inherit;
        }
        .filter-btn.active {
          background: rgba(139,92,246,0.22); border-color: rgba(139,92,246,0.45);
          color: rgba(196,181,253,0.95);
        }

        /* Grid */
        .grid-wrap { padding: 0 16px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* Playlist card */
        .pl-card {
          border-radius: 20px; padding: 16px; cursor: pointer;
          border: 0.5px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px); position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .pl-card:active { transform: scale(0.96); }
        .pl-card.active-pl { box-shadow: 0 0 24px rgba(139,92,246,0.3); border-color: rgba(139,92,246,0.4); }
        .pl-emoji { font-size: 28px; margin-bottom: 10px; display: block; }
        .pl-title { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.9); line-height: 1.3; margin-bottom: 4px; }
        .pl-count { font-size: 10px; color: rgba(255,255,255,0.35); margin-bottom: 12px; }
        .pl-desc { font-size: 10px; color: rgba(255,255,255,0.35); line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .pl-footer { display: flex; align-items: center; justify-content: space-between; }
        .pl-play-btn {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: 0.5px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; cursor: pointer; transition: background 0.2s;
          color: white;
        }
        .pl-play-btn.playing { background: rgba(139,92,246,0.5); border-color: rgba(139,92,246,0.6); }
        .pl-open-btn {
          font-size: 9px; color: rgba(255,255,255,0.3); background: none; border: none;
          cursor: pointer; padding: 4px 8px; border-radius: 8px;
          font-family: inherit; text-transform: uppercase; letter-spacing: 0.08em;
          transition: color 0.2s;
        }
        .pl-open-btn:hover { color: rgba(255,255,255,0.6); }

        /* Bars visualizer */
        .mini-bars { display: flex; gap: 2px; align-items: flex-end; height: 14px; }
        .mini-bar { width: 3px; border-radius: 2px; background: rgba(167,139,250,0.6); transition: height 0.3s; }
        @keyframes barDance { 0%,100%{height:3px} 50%{height:12px} }
        .mini-bar.playing { animation: barDance 0.8s ease-in-out infinite; }
        .mini-bar:nth-child(2).playing { animation-delay: 0.15s; }
        .mini-bar:nth-child(3).playing { animation-delay: 0.3s; }

        /* Empty state */
        .empty { text-align: center; padding: 60px 20px; }
        .empty p:first-child { font-size: 32px; margin-bottom: 8px; }
        .empty p:last-child { font-size: 13px; color: rgba(255,255,255,0.3); }

        /* Bottom nav */
        .bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 30;
          background: rgba(8,6,18,0.9); border-top: 0.5px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          display: flex; justify-content: space-around;
          padding: 10px 8px calc(12px + env(safe-area-inset-bottom, 0px));
        }
        .nav-btn {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          background: none; border: none; cursor: pointer; padding: 4px 12px;
          border-radius: 14px; transition: background 0.2s; font-family: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-btn.active { background: rgba(139,92,246,0.12); }
        .nav-icon { font-size: 18px; }
        .nav-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.08em; }

        /* Now playing bar */
        .now-bar {
          position: fixed; left: 0; right: 0; z-index: 25;
          bottom: calc(64px + env(safe-area-inset-bottom, 0px));
          padding: 0 12px 8px;
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp { from { transform: translateY(80px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .now-bar-inner {
          border-radius: 18px; overflow: hidden;
          background: rgba(18,12,36,0.95);
          border: 0.5px solid rgba(167,139,250,0.2);
          backdrop-filter: blur(24px);
          cursor: pointer;
        }
        .now-progress-track { height: 2px; background: rgba(255,255,255,0.06); }
        .now-progress-fill { height: 100%; background: linear-gradient(90deg, #a78bfa, #f9a8d4); transition: width 0.2s linear; }
        .now-content { display: flex; align-items: center; gap: 12px; padding: 10px 16px; }
        .now-art {
          width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(139,92,246,0.7), rgba(59,130,246,0.6));
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        .now-art.playing { animation: pulse 2s ease-in-out infinite; }
        .now-info { flex: 1; min-width: 0; }
        .now-title { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.92); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .now-artist { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .now-controls { display: flex; align-items: center; gap: 4px; }
        .now-ctrl {
          width: 30px; height: 30px; border-radius: 50%; border: none;
          background: transparent; color: rgba(255,255,255,0.5);
          font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: color 0.15s, transform 0.1s;
        }
        .now-ctrl:active { transform: scale(0.85); }
        .now-play-ctrl {
          width: 34px; height: 34px; border-radius: 50%; border: 0.5px solid rgba(139,92,246,0.4);
          background: rgba(139,92,246,0.25); color: rgba(255,255,255,0.92);
          font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: transform 0.1s;
        }
        .now-play-ctrl:active { transform: scale(0.88); }

        /* Track sheet */
        .sheet-backdrop {
          position: fixed; inset: 0; z-index: 40;
          background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .sheet {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 41;
          border-radius: 28px 28px 0 0; overflow: hidden;
          background: rgba(12,8,28,0.98); border: 0.5px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px); max-height: 78vh;
          display: flex; flex-direction: column;
          animation: sheetUp 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        @keyframes sheetUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .sheet-handle { display: flex; justify-content: center; padding: 12px 0 4px; flex-shrink: 0; }
        .sheet-handle-bar { width: 32px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.15); }
        .sheet-header { padding: 8px 20px 16px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .sheet-art { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
        .sheet-title { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.95); }
        .sheet-desc { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 3px; line-height: 1.4; }
        .sheet-play-btn {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          border: none; color: white; font-size: 14px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(139,92,246,0.4);
          transition: transform 0.1s;
        }
        .sheet-play-btn:active { transform: scale(0.92); }
        .sheet-tracks { overflow-y: auto; padding: 0 20px 32px; flex: 1; }
        .track-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 8px; border-radius: 12px; cursor: pointer;
          transition: background 0.15s; width: 100%; border: none;
          background: transparent; font-family: inherit; text-align: left;
          -webkit-tap-highlight-color: transparent;
        }
        .track-row:active { background: rgba(255,255,255,0.05); }
        .track-row.current { background: rgba(139,92,246,0.12); }
        .track-num {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600;
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.25);
        }
        .track-num.current { background: rgba(139,92,246,0.3); color: rgba(196,181,253,0.9); }
        .track-info { flex: 1; min-width: 0; }
        .track-title { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .track-title.current { color: rgba(196,181,253,0.95); }
        .track-artist { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .track-dur { font-size: 11px; color: rgba(255,255,255,0.25); flex-shrink: 0; }
      `}</style>

      <div className="music-page">
        <div className="safe-top" />

        {/* Header */}
        <div className="header">
          <p className="header-label">Lumina Radio</p>
          <h1 className="header-title">Your Soundtrack</h1>
          <p className="header-sub">Music that meets you where you are.</p>
        </div>

        {/* Mood Filters */}
        <div className="filters-wrap">
          <div className="filters-row">
            {MOOD_FILTERS.map(f => (
              <button
                key={f.id}
                className={`filter-btn${moodFilter === f.id ? ' active' : ''}`}
                onClick={() => setMoodFilter(f.id)}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Playlist Grid */}
        <div className="grid-wrap">
          {filteredPlaylists.length === 0 ? (
            <div className="empty">
              <p>🎵</p>
              <p>No playlists for this mood yet.</p>
            </div>
          ) : (
            <div className="grid">
              {filteredPlaylists.map(pl => {
                const active = isActivePlaylist(pl)
                return (
                  <div
                    key={pl.id}
                    className={`pl-card${active ? ' active-pl' : ''}`}
                    style={{ background: pl.gradient }}
                  >
                    <span className="pl-emoji">{pl.emoji}</span>
                    <p className="pl-title">{pl.title}</p>
                    <p className="pl-count">{pl.tracks.length} tracks</p>
                    <p className="pl-desc">{pl.description}</p>
                    <div className="pl-footer">
                      <button
                        className="pl-open-btn"
                        onClick={() => setShowSheet(pl)}
                      >
                        View
                      </button>
                      <button
                        className={`pl-play-btn${active ? ' playing' : ''}`}
                        onClick={() => handlePlayPlaylist(pl)}
                        aria-label={active ? 'Pause' : 'Play'}
                      >
                        {active ? '⏸' : '▶'}
                      </button>
                    </div>
                    {active && (
                      <div className="mini-bars" style={{ marginTop: 8 }}>
                        {[0,1,2,3].map(i => (
                          <div key={i} className="mini-bar playing" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Now Playing Bar */}
      {currentTrack && (
        <div className="now-bar">
          <div className="now-bar-inner" onClick={() => activePlaylist && setShowSheet(activePlaylist)}>
            <div className="now-progress-track">
              <div className="now-progress-fill" style={{ width: `${progress * 100}%` }} />
            </div>
            <div className="now-content">
              <div className={`now-art${isPlaying ? ' playing' : ''}`}>🎵</div>
              <div className="now-info">
                <p className="now-title">{currentTrack.title}</p>
                <p className="now-artist">{currentTrack.artist}</p>
              </div>
              <div className="now-controls" onClick={e => e.stopPropagation()}>
                <button className="now-ctrl" onClick={handlePrev} aria-label="Previous">⏮</button>
                <button className="now-play-ctrl" onClick={handleToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button className="now-ctrl" onClick={handleNext} aria-label="Next">⏭</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Track Sheet */}
      {showSheet && (
        <>
          <div className="sheet-backdrop" onClick={() => setShowSheet(null)} />
          <div className="sheet">
            <div className="sheet-handle"><div className="sheet-handle-bar" /></div>
            <div className="sheet-header">
              <div className="sheet-art" style={{ background: showSheet.gradient }}>{showSheet.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="sheet-title">{showSheet.title}</p>
                <p className="sheet-desc">{showSheet.description}</p>
              </div>
              <button
                className="sheet-play-btn"
                onClick={() => handlePlayPlaylist(showSheet)}
                aria-label="Play playlist"
              >
                {activePlaylist?.id === showSheet.id && isPlaying ? '⏸' : '▶'}
              </button>
            </div>
            <div className="sheet-tracks">
              {showSheet.tracks.map((track, i) => {
                const isCurrent = currentTrack?.id === track.id
                return (
                  <button
                    key={track.id}
                    className={`track-row${isCurrent ? ' current' : ''}`}
                    onClick={() => {
                      handlePlayPlaylist(showSheet, i)
                      setTimeout(() => setShowSheet(null), 300)
                    }}
                  >
                    <div className={`track-num${isCurrent ? ' current' : ''}`}>
                      {isCurrent && isPlaying ? '♫' : i + 1}
                    </div>
                    <div className="track-info">
                      <p className={`track-title${isCurrent ? ' current' : ''}`}>{track.title}</p>
                      <p className="track-artist">{track.artist}</p>
                    </div>
                    <span className="track-dur">{fmt(track.duration)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        {[
          { icon: '🏠', label: 'Home',    href: '/' },
          { icon: '🎵', label: 'Music',   href: '/music' },
          { icon: '✦',  label: 'Lumina',  href: '/companion' },
          { icon: '📖', label: 'Journal', href: '/journal' },
          { icon: '🤍', label: 'You',     href: '/profile' },
        ].map(tab => (
          <button
            key={tab.href}
            className={`nav-btn${tab.href === '/music' ? ' active' : ''}`}
            onClick={() => router.push(tab.href)}
            aria-label={tab.label}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label" style={{ color: tab.href === '/music' ? 'rgba(196,181,253,0.8)' : 'rgba(255,255,255,0.3)' }}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  )
}
