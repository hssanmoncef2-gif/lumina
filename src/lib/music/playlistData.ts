// ============================================================
// LUMINA — Playlist Data (Phase 5)
// Static definitions for 10 categories with mock tracks
// ============================================================

import type { Playlist, Track, MusicCategory } from '@/types'

// ---- Mock Tracks by category ----

const RAINY_TOKYO_TRACKS: Track[] = [
  { id: 'rt-01', title: 'Neon Reflections',       artist: 'Lumina Radio', category: 'rainy-tokyo',       duration: 214, src: '', mood: ['calm', 'drifting'], bpm: 75 },
  { id: 'rt-02', title: 'Late Night Convenience',  artist: 'Lumina Radio', category: 'rainy-tokyo',       duration: 192, src: '', mood: ['drifting', 'calm'],   bpm: 72 },
  { id: 'rt-03', title: 'Soft Rain on Glass',      artist: 'Lumina Radio', category: 'rainy-tokyo',       duration: 248, src: '', mood: ['calm'],              bpm: 68 },
  { id: 'rt-04', title: 'Shibuya at 2AM',          artist: 'Lumina Radio', category: 'rainy-tokyo',       duration: 237, src: '', mood: ['drifting'],          bpm: 70 },
  { id: 'rt-05', title: 'Umbrella Blues',          artist: 'Lumina Radio', category: 'rainy-tokyo',       duration: 203, src: '', mood: ['heavy', 'calm'],     bpm: 65 },
]

const OCEAN_CALM_TRACKS: Track[] = [
  { id: 'oc-01', title: 'Tidepools at Dusk',       artist: 'Lumina Radio', category: 'ocean-calm',        duration: 280, src: '', mood: ['calm', 'soft'],      bpm: 60 },
  { id: 'oc-02', title: 'Wading In',               artist: 'Lumina Radio', category: 'ocean-calm',        duration: 221, src: '', mood: ['healing', 'calm'],   bpm: 58 },
  { id: 'oc-03', title: 'The Deep Blue Hour',      artist: 'Lumina Radio', category: 'ocean-calm',        duration: 310, src: '', mood: ['drifting'],          bpm: 55 },
  { id: 'oc-04', title: 'Salt Air Morning',        artist: 'Lumina Radio', category: 'ocean-calm',        duration: 196, src: '', mood: ['soft', 'joyful'],    bpm: 62 },
  { id: 'oc-05', title: 'Undertow Meditation',     artist: 'Lumina Radio', category: 'ocean-calm',        duration: 345, src: '', mood: ['calm', 'healing'],   bpm: 52 },
]

const DREAMY_NIGHTS_TRACKS: Track[] = [
  { id: 'dn-01', title: 'Moonlit Séance',          artist: 'Lumina Radio', category: 'dreamy-nights',     duration: 258, src: '', mood: ['drifting', 'soft'],  bpm: 70 },
  { id: 'dn-02', title: 'Starfall Lullaby',        artist: 'Lumina Radio', category: 'dreamy-nights',     duration: 230, src: '', mood: ['calm'],              bpm: 63 },
  { id: 'dn-03', title: 'Lucid Hours',             artist: 'Lumina Radio', category: 'dreamy-nights',     duration: 290, src: '', mood: ['soft', 'drifting'], bpm: 67 },
  { id: 'dn-04', title: 'Between Worlds',          artist: 'Lumina Radio', category: 'dreamy-nights',     duration: 276, src: '', mood: ['drifting'],          bpm: 65 },
  { id: 'dn-05', title: 'Cloud Nine Chorus',       artist: 'Lumina Radio', category: 'dreamy-nights',     duration: 215, src: '', mood: ['soft', 'joyful'],   bpm: 72 },
]

const HEALING_TRACKS: Track[] = [
  { id: 'hl-01', title: 'Letting It Be',           artist: 'Lumina Radio', category: 'healing',           duration: 320, src: '', mood: ['healing', 'heavy'], bpm: 58 },
  { id: 'hl-02', title: 'The Tenderness Frequency',artist: 'Lumina Radio', category: 'healing',           duration: 288, src: '', mood: ['healing', 'soft'],  bpm: 60 },
  { id: 'hl-03', title: 'A Gentle Return',         artist: 'Lumina Radio', category: 'healing',           duration: 264, src: '', mood: ['healing'],          bpm: 56 },
  { id: 'hl-04', title: 'Held',                    artist: 'Lumina Radio', category: 'healing',           duration: 298, src: '', mood: ['healing', 'heavy'], bpm: 55 },
  { id: 'hl-05', title: 'Permission to Rest',      artist: 'Lumina Radio', category: 'healing',           duration: 340, src: '', mood: ['calm', 'healing'],  bpm: 52 },
]

const MOTIVATION_TRACKS: Track[] = [
  { id: 'mo-01', title: 'Electric Dawn',           artist: 'Lumina Radio', category: 'motivation',        duration: 195, src: '', mood: ['alive'],            bpm: 110 },
  { id: 'mo-02', title: 'Climb Higher',            artist: 'Lumina Radio', category: 'motivation',        duration: 188, src: '', mood: ['alive', 'joyful'], bpm: 118 },
  { id: 'mo-03', title: 'Zero to Luminous',        artist: 'Lumina Radio', category: 'motivation',        duration: 210, src: '', mood: ['alive'],            bpm: 115 },
  { id: 'mo-04', title: 'The Upgrade',             artist: 'Lumina Radio', category: 'motivation',        duration: 200, src: '', mood: ['alive', 'joyful'], bpm: 120 },
  { id: 'mo-05', title: 'Ignition Protocol',       artist: 'Lumina Radio', category: 'motivation',        duration: 178, src: '', mood: ['alive'],            bpm: 125 },
]

const COMFORT_TRACKS: Track[] = [
  { id: 'co-01', title: 'Weighted Blanket World',  artist: 'Lumina Radio', category: 'comfort',           duration: 302, src: '', mood: ['soft', 'calm'],     bpm: 62 },
  { id: 'co-02', title: 'You Are Enough',          artist: 'Lumina Radio', category: 'comfort',           duration: 265, src: '', mood: ['healing', 'soft'],  bpm: 58 },
  { id: 'co-03', title: 'Hug From the Universe',  artist: 'Lumina Radio', category: 'comfort',           duration: 284, src: '', mood: ['soft'],             bpm: 60 },
  { id: 'co-04', title: 'Safe Harbor',             artist: 'Lumina Radio', category: 'comfort',           duration: 317, src: '', mood: ['calm', 'soft'],     bpm: 55 },
  { id: 'co-05', title: 'The Long Exhale',         artist: 'Lumina Radio', category: 'comfort',           duration: 330, src: '', mood: ['calm'],             bpm: 52 },
]

const LO_FI_TRACKS: Track[] = [
  { id: 'lf-01', title: 'Morning Pages',           artist: 'Lumina Radio', category: 'lo-fi-morning',     duration: 220, src: '', mood: ['calm', 'soft'],     bpm: 78 },
  { id: 'lf-02', title: 'Notebook & Chai',         artist: 'Lumina Radio', category: 'lo-fi-morning',     duration: 198, src: '', mood: ['calm'],             bpm: 80 },
  { id: 'lf-03', title: 'Study Hall Ghosts',       artist: 'Lumina Radio', category: 'lo-fi-morning',     duration: 245, src: '', mood: ['drifting', 'calm'], bpm: 75 },
  { id: 'lf-04', title: 'Pencil Scratches',        artist: 'Lumina Radio', category: 'lo-fi-morning',     duration: 212, src: '', mood: ['calm'],             bpm: 82 },
  { id: 'lf-05', title: 'Warm Window Light',       artist: 'Lumina Radio', category: 'lo-fi-morning',     duration: 228, src: '', mood: ['soft', 'joyful'],   bpm: 77 },
]

const CELESTIAL_TRACKS: Track[] = [
  { id: 'ca-01', title: 'Event Horizon Waltz',     artist: 'Lumina Radio', category: 'celestial-ambient', duration: 380, src: '', mood: ['drifting', 'calm'], bpm: 50 },
  { id: 'ca-02', title: 'Nebula Serenade',         artist: 'Lumina Radio', category: 'celestial-ambient', duration: 420, src: '', mood: ['drifting'],         bpm: 48 },
  { id: 'ca-03', title: 'Void Bloom',              artist: 'Lumina Radio', category: 'celestial-ambient', duration: 365, src: '', mood: ['calm', 'soft'],     bpm: 52 },
  { id: 'ca-04', title: 'Photon Rain',             artist: 'Lumina Radio', category: 'celestial-ambient', duration: 395, src: '', mood: ['drifting'],         bpm: 46 },
  { id: 'ca-05', title: 'The Expanding Silence',   artist: 'Lumina Radio', category: 'celestial-ambient', duration: 450, src: '', mood: ['calm'],             bpm: 44 },
]

const EMOTIONAL_RELEASE_TRACKS: Track[] = [
  { id: 'er-01', title: 'Let It Rain',             artist: 'Lumina Radio', category: 'emotional-release', duration: 255, src: '', mood: ['heavy', 'healing'], bpm: 65 },
  { id: 'er-02', title: 'The Breakdown Ballad',    artist: 'Lumina Radio', category: 'emotional-release', duration: 270, src: '', mood: ['heavy'],            bpm: 70 },
  { id: 'er-03', title: 'Catharsis Sequence',      artist: 'Lumina Radio', category: 'emotional-release', duration: 230, src: '', mood: ['heavy', 'anxious'],bpm: 80 },
  { id: 'er-04', title: 'Sob Gently',              artist: 'Lumina Radio', category: 'emotional-release', duration: 290, src: '', mood: ['heavy', 'healing'], bpm: 62 },
  { id: 'er-05', title: 'After the Storm',         artist: 'Lumina Radio', category: 'emotional-release', duration: 305, src: '', mood: ['healing', 'heavy'], bpm: 60 },
]

const CONFIDENCE_TRACKS: Track[] = [
  { id: 'cf-01', title: 'Main Character Energy',   artist: 'Lumina Radio', category: 'confidence',        duration: 185, src: '', mood: ['alive', 'joyful'], bpm: 105 },
  { id: 'cf-02', title: 'Walk Tall',               artist: 'Lumina Radio', category: 'confidence',        duration: 200, src: '', mood: ['alive'],           bpm: 100 },
  { id: 'cf-03', title: 'Glass Ceiling Shatter',   artist: 'Lumina Radio', category: 'confidence',        duration: 195, src: '', mood: ['alive', 'joyful'], bpm: 108 },
  { id: 'cf-04', title: 'I Belong Here',           artist: 'Lumina Radio', category: 'confidence',        duration: 220, src: '', mood: ['joyful'],          bpm: 96 },
  { id: 'cf-05', title: 'Unbothered',              artist: 'Lumina Radio', category: 'confidence',        duration: 210, src: '', mood: ['alive', 'calm'],   bpm: 102 },
]

// ---- Playlists ----

export const PLAYLISTS: Playlist[] = [
  {
    id: 'pl-rainy-tokyo',
    category: 'rainy-tokyo',
    title: 'Rainy Tokyo',
    description: 'Neon puddles, late-night trains, and the hush of rain on glass.',
    emoji: '🌧️',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.45) 0%, rgba(59,130,246,0.35) 100%)',
    tracks: RAINY_TOKYO_TRACKS,
  },
  {
    id: 'pl-ocean-calm',
    category: 'ocean-calm',
    title: 'Ocean Calm',
    description: 'Salt air, deep waves, and the rhythm of the tide.',
    emoji: '🌊',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.45) 0%, rgba(59,130,246,0.35) 100%)',
    tracks: OCEAN_CALM_TRACKS,
  },
  {
    id: 'pl-dreamy-nights',
    category: 'dreamy-nights',
    title: 'Dreamy Nights',
    description: 'Velvet skies, starlight, and soft lucid wandering.',
    emoji: '✨',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.45) 0%, rgba(236,72,153,0.35) 100%)',
    tracks: DREAMY_NIGHTS_TRACKS,
  },
  {
    id: 'pl-healing',
    category: 'healing',
    title: 'Healing Space',
    description: 'Gentle frequencies to soothe and slowly piece things back together.',
    emoji: '🌿',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.35) 0%, rgba(6,182,212,0.35) 100%)',
    tracks: HEALING_TRACKS,
  },
  {
    id: 'pl-motivation',
    category: 'motivation',
    title: 'Ignition',
    description: 'Electric energy to light the fire that was always inside you.',
    emoji: '⚡',
    gradient: 'linear-gradient(135deg, rgba(234,179,8,0.45) 0%, rgba(249,115,22,0.35) 100%)',
    tracks: MOTIVATION_TRACKS,
  },
  {
    id: 'pl-comfort',
    category: 'comfort',
    title: 'Soft Comfort',
    description: 'Like being wrapped in something warm that says: you're okay.',
    emoji: '🤍',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.35) 0%, rgba(196,181,253,0.35) 100%)',
    tracks: COMFORT_TRACKS,
  },
  {
    id: 'pl-lo-fi',
    category: 'lo-fi-morning',
    title: 'Lo-Fi Morning',
    description: 'Coffee breath, notebook pages, and the quiet hum of focus.',
    emoji: '☕',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.35) 0%, rgba(249,115,22,0.25) 100%)',
    tracks: LO_FI_TRACKS,
  },
  {
    id: 'pl-celestial',
    category: 'celestial-ambient',
    title: 'Celestial',
    description: 'Drift through galaxies and dissolve into quiet cosmic sound.',
    emoji: '🌌',
    gradient: 'linear-gradient(135deg, rgba(79,70,229,0.5) 0%, rgba(139,92,246,0.4) 50%, rgba(30,27,75,0.5) 100%)',
    tracks: CELESTIAL_TRACKS,
  },
  {
    id: 'pl-emotional-release',
    category: 'emotional-release',
    title: 'Emotional Release',
    description: 'For when you need to feel it fully, and then let it go.',
    emoji: '🌧️',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.45) 0%, rgba(139,92,246,0.4) 100%)',
    tracks: EMOTIONAL_RELEASE_TRACKS,
  },
  {
    id: 'pl-confidence',
    category: 'confidence',
    title: 'Confidence',
    description: 'Walk in knowing your worth. Every step, yours.',
    emoji: '👑',
    gradient: 'linear-gradient(135deg, rgba(234,179,8,0.4) 0%, rgba(249,115,22,0.45) 100%)',
    tracks: CONFIDENCE_TRACKS,
  },
]

// ---- Helpers ----

export function getPlaylistByCategory(category: MusicCategory): Playlist | undefined {
  return PLAYLISTS.find(p => p.category === category)
}

export function getPlaylistsForMood(moodId: string): Playlist[] {
  return PLAYLISTS.filter(p =>
    p.tracks.some(t => t.mood.includes(moodId as any))
  )
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
