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
  scIndex: number  // 0-based index in the SoundCloud playlist (only tracks with isFound=1)
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

interface AmbientPreset {
  id: string
  label: string
  emoji: string
  color: string
}

// ============================================================
// SoundCloud Playlist — real indices from results_lumina-radio.csv
// The SC playlist url: https://soundcloud.com/moncef-hssan/sets/lumina-radio
// Only tracks with isFound=1 are included. scIndex = 0-based position in the SC playlist.
// ============================================================
const PLAYLISTS: Playlist[] = [
  {
    id: 'pl-arabic-fire', title: 'Arabic Fire 🔥',
    description: 'High-energy Arabic pop to ignite your night.',
    emoji: '🔥',
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.5) 0%, rgba(245,158,11,0.45) 100%)',
    moods: ['alive','joyful'],
    tracks: [
      { id:'ap-02', title:'Degou El Toboul',     artist:'Myriam Fares',  duration:210, mood:['alive','joyful'], scIndex:1  },
      { id:'ap-03', title:'Haklek Rahtak',        artist:'Myriam Fares',  duration:198, mood:['alive','joyful'], scIndex:2  },
      { id:'ap-04', title:'Maalesh',              artist:'Myriam Fares',  duration:204, mood:['alive','joyful'], scIndex:3  },
      { id:'ap-05', title:'Atlah',                artist:'Myriam Fares',  duration:217, mood:['alive','joyful'], scIndex:4  },
      { id:'ap-06', title:'Boom Boom',            artist:'Hind Ziadi',    duration:190, mood:['alive','joyful'], scIndex:5  },
      { id:'ap-07', title:'Mesaytara',            artist:'Lamis Kan',     duration:208, mood:['alive','joyful'], scIndex:6  },
      { id:'ap-09', title:"Enta Bet'oul Eih",     artist:'Myriam Fares',  duration:222, mood:['alive','joyful'], scIndex:8  },
      { id:'ap-10', title:'Badna Nwalee El Jaw',  artist:'Nancy Ajram',   duration:200, mood:['alive','joyful'], scIndex:9  },
    ],
  },
  {
    id: 'pl-arabic-soft', title: 'Arabic Soft 🌸',
    description: 'Tender voices and warm melodies.',
    emoji: '🌸',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.4) 0%, rgba(196,181,253,0.4) 100%)',
    moods: ['soft','healing','calm'],
    tracks: [
      { id:'as-02', title:'Ma Yhimmak',    artist:'Yara',           duration:215, mood:['soft','calm'],    scIndex:11 },
      { id:'as-04', title:'Ma Tegi Hena', artist:'Nancy Ajram',    duration:218, mood:['soft','calm'],    scIndex:13 },
      { id:'as-05', title:"Tla'ayna",     artist:'Maritta Hallani',duration:225, mood:['soft','healing'], scIndex:14 },
      { id:'as-06', title:"Esma'ny",      artist:'Carole Samaha',  duration:242, mood:['soft','healing'], scIndex:15 },
      { id:'as-09', title:'Howa Da',      artist:'Sherine',        duration:220, mood:['soft','healing'], scIndex:18 },
    ],
  },
  {
    id: 'pl-arabic-nights', title: 'Arabic Nights 🌙',
    description: 'Late nights and longing hearts.',
    emoji: '🌙',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.5) 0%, rgba(30,27,75,0.65) 100%)',
    moods: ['drifting','heavy'],
    tracks: [
      { id:'an-04', title:'Eidak',      artist:'Najwa Karam', duration:248, mood:['drifting','soft'],  scIndex:23 },
      { id:'an-06', title:'Fakerne',    artist:'Haifa Wehbe', duration:240, mood:['drifting','heavy'], scIndex:25 },
      { id:'an-07', title:'Enta Tani', artist:'Haifa Wehbe', duration:235, mood:['drifting','soft'],  scIndex:26 },
      { id:'an-08', title:'El Wawa',   artist:'Haifa Wehbe', duration:228, mood:['drifting','joyful'],scIndex:27 },
      { id:'an-09', title:'Rajab',     artist:'Haifa Wehbe', duration:232, mood:['drifting','alive'], scIndex:28 },
    ],
  },
  {
    id: 'pl-arabic-healing', title: 'Arabic Healing 🌿',
    description: 'Songs that understand your heart.',
    emoji: '🌿',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.38) 0%, rgba(6,182,212,0.38) 100%)',
    moods: ['healing','soft'],
    tracks: [
      { id:'ah-01', title:'Namet Nenna',        artist:'Ruby',        duration:230, mood:['healing','soft'],   scIndex:30 },
      { id:'ah-04', title:'Hetta Tanya',         artist:'Ruby',        duration:225, mood:['healing','soft'],   scIndex:33 },
      { id:'ah-05', title:'Ya Tabtab Wa Dallaa', artist:'Nancy Ajram', duration:245, mood:['healing','joyful'], scIndex:34 },
      { id:'ah-07', title:'Aktar Shewaya',       artist:'Maya Diab',   duration:218, mood:['healing','soft'],   scIndex:36 },
      { id:'ah-08', title:'Khalani',             artist:'Myriam Fares',duration:208, mood:['healing','alive'],  scIndex:37 },
    ],
  },
  {
    id: 'pl-britney', title: 'Britney Era ⚡',
    description: 'Early 2000s pop energy. Iconic, unapologetic, electric.',
    emoji: '⚡',
    gradient: 'linear-gradient(135deg, rgba(234,179,8,0.5) 0%, rgba(249,115,22,0.45) 100%)',
    moods: ['alive','joyful'],
    tracks: [
      { id:'bp-01', title:'Baby One More Time',  artist:'Britney Spears', duration:211, mood:['alive','joyful'], scIndex:38 },
      { id:'bp-02', title:'Oops I Did It Again', artist:'Britney Spears', duration:204, mood:['alive','joyful'], scIndex:39 },
      { id:'bp-03', title:'Toxic',               artist:'Britney Spears', duration:198, mood:['alive'],          scIndex:40 },
      { id:'bp-04', title:'Gimme More',          artist:'Britney Spears', duration:240, mood:['alive'],          scIndex:41 },
      { id:'bp-05', title:'Womanizer',           artist:'Britney Spears', duration:216, mood:['alive','joyful'], scIndex:42 },
      { id:'bp-06', title:'Hold It Against Me',  artist:'Britney Spears', duration:228, mood:['alive'],          scIndex:43 },
      { id:'bp-07', title:'Till the World Ends', artist:'Britney Spears', duration:234, mood:['alive','joyful'], scIndex:44 },
      { id:'bp-08', title:'Work Bitch',          artist:'Britney Spears', duration:222, mood:['alive'],          scIndex:45 },
      { id:'bp-09', title:'Criminal',            artist:'Britney Spears', duration:225, mood:['drifting','soft'],scIndex:46 },
      { id:'bp-10', title:'Everytime',           artist:'Britney Spears', duration:238, mood:['heavy','soft'],   scIndex:47 },
    ],
  },
  {
    id: 'pl-bruno', title: 'Bruno Vibes 🌟',
    description: 'Smooth, feel-good grooves.',
    emoji: '🌟',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.4) 0%, rgba(234,179,8,0.35) 100%)',
    moods: ['joyful','alive','soft'],
    tracks: [
      { id:'bm-01', title:"That's What I Like",  artist:'Bruno Mars', duration:206, mood:['joyful','alive'], scIndex:48 },
      { id:'bm-02', title:'Treasure',            artist:'Bruno Mars', duration:173, mood:['joyful','alive'], scIndex:49 },
      { id:'bm-03', title:'Uptown Funk',         artist:'Bruno Mars', duration:270, mood:['joyful','alive'], scIndex:50 },
      { id:'bm-04', title:'Grenade',             artist:'Bruno Mars', duration:222, mood:['heavy','healing'],scIndex:51 },
      { id:'bm-05', title:'Just the Way You Are',artist:'Bruno Mars', duration:220, mood:['soft','joyful'],  scIndex:52 },
      { id:'bm-06', title:'Count On Me',         artist:'Bruno Mars', duration:193, mood:['soft','healing'], scIndex:53 },
      { id:'bm-07', title:'Locked Out of Heaven',artist:'Bruno Mars', duration:233, mood:['joyful','alive'], scIndex:54 },
      { id:'bm-08', title:'Versace on the Floor',artist:'Bruno Mars', duration:274, mood:['soft','drifting'],scIndex:55 },
    ],
  },
  {
    id: 'pl-dystinct', title: 'DYSTINCT Mode 👑',
    description: 'Arabic trap swagger. Walk tall, feel unstoppable.',
    emoji: '👑',
    gradient: 'linear-gradient(135deg, rgba(79,70,229,0.55) 0%, rgba(139,92,246,0.5) 100%)',
    moods: ['alive','joyful'],
    tracks: [
      { id:'dy-03', title:'LAYALI', artist:'DYSTINCT', duration:202, mood:['drifting','alive'], scIndex:58 },
      { id:'dy-05', title:'YAMA',   artist:'DYSTINCT', duration:198, mood:['alive','soft'],    scIndex:60 },
    ],
  },
  {
    id: 'pl-french-drift', title: 'French Drift 🌧️',
    description: 'French & international sounds for rainy evenings.',
    emoji: '🌧️',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(59,130,246,0.4) 100%)',
    moods: ['soft','drifting','calm'],
    tracks: [
      { id:'fr-02', title:"J'avoue",                artist:'Linh',       duration:225, mood:['soft','calm'],    scIndex:62 },
      { id:'fr-05', title:'ça pik un peu quand même',artist:'miki',       duration:195, mood:['soft','drifting'],scIndex:65 },
      { id:'fr-06', title:'coeur maladroit',         artist:'Marine',     duration:215, mood:['heavy','soft'],   scIndex:66 },
      { id:'fr-07', title:'la boss',                 artist:'marguerite', duration:200, mood:['joyful','alive'], scIndex:67 },
      { id:'fr-10', title:'Verano',                  artist:'Ridsa',      duration:210, mood:['joyful','alive'], scIndex:70 },
    ],
  },
  {
    id: 'pl-queen', title: 'Queen Catharsis 🎸',
    description: 'For when you need to feel it all.',
    emoji: '🎸',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.55) 0%, rgba(139,92,246,0.5) 100%)',
    moods: ['heavy','healing','alive'],
    tracks: [
      { id:'cl-01', title:'Bohemian Rhapsody',    artist:'Queen', duration:354, mood:['heavy','healing','alive'], scIndex:71 },
      { id:'cl-02', title:"Don't Stop Me Now",    artist:'Queen', duration:209, mood:['alive','joyful'],          scIndex:72 },
      { id:'cl-03', title:'We Will Rock You',     artist:'Queen', duration:121, mood:['alive'],                   scIndex:73 },
      { id:'cl-04', title:'We Are the Champions', artist:'Queen', duration:179, mood:['alive','healing'],         scIndex:74 },
      { id:'cl-05', title:'Under Pressure',       artist:'Queen', duration:248, mood:['heavy','healing'],         scIndex:75 },
      { id:'cl-06', title:'Somebody to Love',     artist:'Queen', duration:276, mood:['heavy','healing'],         scIndex:76 },
      { id:'cl-08', title:'I Want to Break Free', artist:'Queen', duration:259, mood:['alive','joyful'],          scIndex:78 },
      { id:'cl-09', title:'The Show Must Go On',  artist:'Queen', duration:262, mood:['heavy','alive'],           scIndex:79 },
    ],
  },
]

const MOOD_FILTERS = [
  { id:'all',     label:'All',     emoji:'✦' },
  { id:'alive',   label:'Energy',  emoji:'⚡' },
  { id:'joyful',  label:'Joyful',  emoji:'✨' },
  { id:'soft',    label:'Tender',  emoji:'🌸' },
  { id:'drifting',label:'Adrift',  emoji:'🌙' },
  { id:'healing', label:'Healing', emoji:'🌱' },
  { id:'heavy',   label:'Release', emoji:'🌧' },
  { id:'calm',    label:'Still',   emoji:'🌊' },
]

const AMBIENT_PRESETS: AmbientPreset[] = [
  { id:'rain',   label:'Rain',       emoji:'🌧️', color:'rgba(99,102,241,0.5)'  },
  { id:'ocean',  label:'Ocean',      emoji:'🌊', color:'rgba(14,165,233,0.5)'  },
  { id:'forest', label:'Forest',     emoji:'🌲', color:'rgba(34,197,94,0.5)'   },
  { id:'space',  label:'Deep Space', emoji:'🌌', color:'rgba(139,92,246,0.5)'  },
  { id:'noise',  label:'Brown Noise',emoji:'🤎', color:'rgba(180,120,60,0.5)'  },
  { id:'cafe',   label:'Café',       emoji:'☕', color:'rgba(217,119,6,0.5)'   },
]

const SC_PLAYLIST_URL = 'https://soundcloud.com/moncef-hssan/sets/lumina-radio'

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

// ============================================================
// Web Audio Ambient Engine
// ============================================================
class AmbientEngine {
  private ctx: AudioContext | null = null
  private nodes: AudioNode[] = []
  private masterGain: GainNode | null = null

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext()
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  stop() {
    this.nodes.forEach(n => { try { (n as any).stop?.(); n.disconnect() } catch {} })
    this.nodes = []
    if (this.masterGain) { this.masterGain.disconnect(); this.masterGain = null }
  }

  setVolume(v: number) {
    if (this.masterGain) this.masterGain.gain.setTargetAtTime(v, this.getCtx().currentTime, 0.1)
  }

  async play(presetId: string, volume: number) {
    this.stop()
    const ctx = this.getCtx()
    const master = ctx.createGain()
    master.gain.value = volume
    master.connect(ctx.destination)
    this.masterGain = master
    this.nodes = []

    const noise = (type: 'white' | 'brown' | 'pink') => {
      const bufSize = ctx.sampleRate * 4
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const data = buf.getChannelData(0)
      if (type === 'white') {
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
      } else if (type === 'brown') {
        let last = 0
        for (let i = 0; i < bufSize; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; data[i] = last * 3.5 }
      } else {
        let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0
        for (let i=0;i<bufSize;i++){const w=Math.random()*2-1;b0=0.99886*b0+w*0.0555179;b1=0.99332*b1+w*0.0750759;b2=0.96900*b2+w*0.1538520;b3=0.86650*b3+w*0.3104856;b4=0.55000*b4+w*0.5329522;b5=-0.7616*b5-w*0.0168980;data[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11;b6=w*0.115926}
      }
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true
      return src
    }

    const osc = (freq: number, type: OscillatorType = 'sine') => {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq; return o
    }

    const gain = (v: number) => { const g = ctx.createGain(); g.gain.value = v; return g }

    const connect = (...chain: AudioNode[]) => {
      for (let i = 0; i < chain.length - 1; i++) chain[i].connect(chain[i+1])
    }

    const start = (n: AudioBufferSourceNode | OscillatorNode) => {
      n.start(); this.nodes.push(n)
    }

    if (presetId === 'rain') {
      const n = noise('pink'); const g = gain(0.4)
      const filter = ctx.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value=1200
      connect(n, filter, g, master); start(n)
      const rumble = noise('brown'); const rg = gain(0.15)
      const lfo = osc(0.08); const lg = gain(0.12)
      connect(lfo, lg, rg.gain as any)
      connect(rumble, rg, master)
      start(rumble); start(lfo)
    } else if (presetId === 'ocean') {
      const n = noise('pink'); const g = gain(0.35)
      const f1 = ctx.createBiquadFilter(); f1.type='lowpass'; f1.frequency.value=800
      const lfo = osc(0.12); const lg = gain(0.28)
      connect(lfo, lg, g.gain as any)
      connect(n, f1, g, master); start(n); start(lfo)
      const deep = noise('brown'); const dg = gain(0.12)
      connect(deep, dg, master); start(deep)
    } else if (presetId === 'forest') {
      const n = noise('pink'); const g = gain(0.18)
      const f = ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=3000; f.Q.value=0.5
      connect(n, f, g, master); start(n)
      const chirpFreqs = [2800,3200,2400,3600,2600]
      chirpFreqs.forEach((freq, i) => {
        setTimeout(() => {
          if (!this.ctx) return
          const b = this.ctx.createOscillator(); b.type='sine'; b.frequency.value=freq
          const bg = this.ctx.createGain(); bg.gain.value=0
          const now = this.ctx.currentTime
          bg.gain.setValueAtTime(0,now); bg.gain.linearRampToValueAtTime(0.04,now+0.05); bg.gain.linearRampToValueAtTime(0,now+0.18)
          b.connect(bg); bg.connect(master); b.start(); b.stop(now+0.2)
        }, i * 1800 + Math.random() * 3000)
      })
      const wind = noise('white'); const wg = gain(0.06)
      const wf = ctx.createBiquadFilter(); wf.type='highpass'; wf.frequency.value=4000
      connect(wind, wf, wg, master); start(wind)
    } else if (presetId === 'space') {
      const freqs = [55, 82.5, 110, 165]
      freqs.forEach((f, i) => {
        const o = osc(f + i * 0.3); const g = gain(0.06)
        const lfo = osc(0.04 + i * 0.015); const lg = gain(0.03)
        connect(lfo, lg, g.gain as any)
        connect(o, g, master); start(o); start(lfo)
      })
      const n = noise('brown'); const ng = gain(0.05)
      const nf = ctx.createBiquadFilter(); nf.type='lowpass'; nf.frequency.value=200
      connect(n, nf, ng, master); start(n)
    } else if (presetId === 'noise') {
      const n = noise('brown'); const g = gain(0.5)
      const f = ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=600
      connect(n, f, g, master); start(n)
    } else if (presetId === 'cafe') {
      const n = noise('pink'); const g = gain(0.2)
      const f = ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=1200; f.Q.value=0.8
      connect(n, f, g, master); start(n)
      const clink = () => {
        if (!this.ctx || !this.masterGain) return
        const o = this.ctx.createOscillator(); o.type='sine'; o.frequency.value=1800+Math.random()*400
        const g2 = this.ctx.createGain(); g2.gain.value=0
        const now = this.ctx.currentTime
        g2.gain.setValueAtTime(0,now); g2.gain.linearRampToValueAtTime(0.06,now+0.01); g2.gain.exponentialRampToValueAtTime(0.001,now+0.4)
        o.connect(g2); g2.connect(master); o.start(); o.stop(now+0.41)
      }
      clink()
      const iv = setInterval(clink, 2500 + Math.random()*3000)
      ;(this as any)._cafeInterval = iv
      const hiss = noise('white'); const hg = gain(0.06)
      const hf = ctx.createBiquadFilter(); hf.type='highpass'; hf.frequency.value=6000
      connect(hiss, hf, hg, master); start(hiss)
    }
  }

  cleanup() {
    clearInterval((this as any)._cafeInterval)
    this.stop()
    if (this.ctx) { this.ctx.close(); this.ctx = null }
  }
}

// ============================================================
// SoundCloud Widget Hook
// ============================================================
function useSoundCloud() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false)
  const onFinishRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Load SC Widget API
    if ((window as any).SC) { initWidget(); return }
    const tag = document.createElement('script')
    tag.src = 'https://w.soundcloud.com/player/api.js'
    tag.onload = initWidget
    document.head.appendChild(tag)

    function initWidget() {
      if (!iframeRef.current) return
      const SC = (window as any).SC
      const widget = SC.Widget(iframeRef.current)
      widgetRef.current = widget
      widget.bind(SC.Widget.Events.READY, () => {
        setIsReady(true)
      })
      widget.bind(SC.Widget.Events.PLAY, () => setIsActuallyPlaying(true))
      widget.bind(SC.Widget.Events.PAUSE, () => setIsActuallyPlaying(false))
      widget.bind(SC.Widget.Events.FINISH, () => {
        setIsActuallyPlaying(false)
        onFinishRef.current?.()
      })
    }
  }, [])

  const skipToIndex = useCallback((index: number) => {
    if (!widgetRef.current || !isReady) return
    widgetRef.current.skip(index)
  }, [isReady])

  const play = useCallback(() => {
    if (!widgetRef.current || !isReady) return
    widgetRef.current.play()
  }, [isReady])

  const pause = useCallback(() => {
    if (!widgetRef.current || !isReady) return
    widgetRef.current.pause()
  }, [isReady])

  const setOnFinish = useCallback((fn: () => void) => {
    onFinishRef.current = fn
  }, [])

  return { iframeRef, isReady, isActuallyPlaying, skipToIndex, play, pause, setOnFinish }
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
  const [activeTab, setActiveTab] = useState<'playlists'|'ambient'>('playlists')
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null)
  const [ambientVolume, setAmbientVolume] = useState(0.4)
  const [ambientStarted, setAmbientStarted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const ambientRef = useRef<AmbientEngine | null>(null)

  const { iframeRef, isReady, isActuallyPlaying, skipToIndex, play, pause, setOnFinish } = useSoundCloud()

  // Init ambient engine
  useEffect(() => {
    ambientRef.current = new AmbientEngine()
    return () => { ambientRef.current?.cleanup() }
  }, [])

  // Sync actual playing state from SC widget
  useEffect(() => {
    setIsPlaying(isActuallyPlaying)
  }, [isActuallyPlaying])

  // Simulate progress bar (SC Widget API doesn't expose real-time position easily)
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (isPlaying && currentTrack) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 1) return 0
          return p + 1 / (currentTrack.duration * 5)
        })
      }, 200)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, currentTrack?.id])

  // Auto-advance to next track on finish
  const handleAutoNext = useCallback(() => {
    if (!activePlaylist || !currentTrack) return
    const idx = activePlaylist.tracks.findIndex(t => t.id === currentTrack.id)
    const next = activePlaylist.tracks[(idx + 1) % activePlaylist.tracks.length]
    setCurrentTrack(next)
    setProgress(0)
    skipToIndex(next.scIndex)
    // SC auto-plays after skip, but call play to be safe
    setTimeout(() => play(), 300)
  }, [activePlaylist, currentTrack, skipToIndex, play])

  useEffect(() => {
    setOnFinish(handleAutoNext)
  }, [handleAutoNext, setOnFinish])

  const filteredPlaylists = moodFilter === 'all'
    ? PLAYLISTS
    : PLAYLISTS.filter(pl => pl.moods.includes(moodFilter))

  const handlePlayPlaylist = useCallback((pl: Playlist, trackIndex = 0) => {
    if (activePlaylist?.id === pl.id && isPlaying) {
      pause()
    } else {
      const track = pl.tracks[trackIndex]
      setActivePlaylist(pl)
      setCurrentTrack(track)
      setProgress(0)
      if (isReady) {
        skipToIndex(track.scIndex)
        setTimeout(() => play(), 400)
      }
    }
  }, [activePlaylist, isPlaying, pause, isReady, skipToIndex, play])

  const handleToggle = useCallback(() => {
    if (isPlaying) pause(); else play()
  }, [isPlaying, pause, play])

  const handleNext = useCallback(() => {
    if (!activePlaylist || !currentTrack) return
    const idx = activePlaylist.tracks.findIndex(t => t.id === currentTrack.id)
    const next = activePlaylist.tracks[(idx + 1) % activePlaylist.tracks.length]
    setCurrentTrack(next); setProgress(0)
    skipToIndex(next.scIndex)
    setTimeout(() => play(), 300)
  }, [activePlaylist, currentTrack, skipToIndex, play])

  const handlePrev = useCallback(() => {
    if (!activePlaylist || !currentTrack) return
    const idx = activePlaylist.tracks.findIndex(t => t.id === currentTrack.id)
    const prev = activePlaylist.tracks[(idx - 1 + activePlaylist.tracks.length) % activePlaylist.tracks.length]
    setCurrentTrack(prev); setProgress(0)
    skipToIndex(prev.scIndex)
    setTimeout(() => play(), 300)
  }, [activePlaylist, currentTrack, skipToIndex, play])

  const handleAmbient = useCallback(async (id: string) => {
    if (!ambientRef.current) return
    setAmbientStarted(true)
    if (activeAmbient === id) {
      ambientRef.current.stop()
      setActiveAmbient(null)
    } else {
      await ambientRef.current.play(id, ambientVolume)
      setActiveAmbient(id)
    }
  }, [activeAmbient, ambientVolume])

  const handleAmbientVolume = useCallback((v: number) => {
    setAmbientVolume(v)
    ambientRef.current?.setVolume(v)
  }, [])

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .mp{min-height:100dvh;background:linear-gradient(180deg,#080612 0%,#0e0a1f 50%,#0a0f1e 100%);font-family:'Sora','Inter',sans-serif;color:white;overflow-x:hidden;padding-bottom:160px}
        .safe-top{height:env(safe-area-inset-top,16px)}
        .hdr{padding:20px 20px 16px}
        .hdr-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.3);margin-bottom:4px}
        .hdr-title{font-size:26px;font-weight:600;background:linear-gradient(135deg,#e2d9f3,#a78bfa,#f9a8d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hdr-sub{font-size:13px;font-weight:300;color:rgba(255,255,255,.3);margin-top:6px}
        .sc-status{font-size:10px;color:rgba(255,255,255,.25);margin-top:4px;display:flex;align-items:center;gap:5px}
        .sc-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.2)}
        .sc-dot.ready{background:#22c55e;box-shadow:0 0 6px #22c55e}
        .tabs{padding:0 20px 16px;display:flex;gap:6px}
        .tab-btn{flex:1;padding:9px;border-radius:12px;border:0.5px solid rgba(255,255,255,.07);background:rgba(255,255,255,.04);color:rgba(255,255,255,.35);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;font-family:inherit}
        .tab-btn.active{background:rgba(139,92,246,.2);border-color:rgba(139,92,246,.4);color:rgba(196,181,253,.95)}
        .filters{padding:0 20px 16px;overflow-x:auto;scrollbar-width:none}
        .filters::-webkit-scrollbar{display:none}
        .filters-row{display:flex;gap:8px;white-space:nowrap}
        .f-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:999px;border:0.5px solid rgba(255,255,255,.08);background:rgba(255,255,255,.05);color:rgba(255,255,255,.35);font-size:11px;font-weight:500;cursor:pointer;transition:all .2s;font-family:inherit}
        .f-btn.active{background:rgba(139,92,246,.22);border-color:rgba(139,92,246,.45);color:rgba(196,181,253,.95)}
        .grid-wrap{padding:0 16px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .pl-card{border-radius:20px;padding:16px;cursor:pointer;border:0.5px solid rgba(255,255,255,.1);backdrop-filter:blur(12px);position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;-webkit-tap-highlight-color:transparent}
        .pl-card:active{transform:scale(.96)}
        .pl-card.active-pl{box-shadow:0 0 24px rgba(139,92,246,.3);border-color:rgba(139,92,246,.4)}
        .pl-emoji{font-size:28px;margin-bottom:10px;display:block}
        .pl-title{font-size:12px;font-weight:600;color:rgba(255,255,255,.9);line-height:1.3;margin-bottom:4px}
        .pl-count{font-size:10px;color:rgba(255,255,255,.35);margin-bottom:8px}
        .pl-desc{font-size:10px;color:rgba(255,255,255,.35);line-height:1.5;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .pl-footer{display:flex;align-items:center;justify-content:space-between}
        .pl-play{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.15);border:0.5px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:11px;cursor:pointer;color:white;transition:background .2s}
        .pl-play.on{background:rgba(139,92,246,.5);border-color:rgba(139,92,246,.6)}
        .pl-view{font-size:9px;color:rgba(255,255,255,.3);background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:8px;font-family:inherit;text-transform:uppercase;letter-spacing:.08em}
        .bars{display:flex;gap:2px;align-items:flex-end;height:14px;margin-top:8px}
        .bar{width:3px;border-radius:2px;background:rgba(167,139,250,.6)}
        @keyframes bd{0%,100%{height:3px}50%{height:12px}}
        .bar.on{animation:bd .8s ease-in-out infinite}
        .empty{text-align:center;padding:60px 20px}
        .empty p:first-child{font-size:32px;margin-bottom:8px}
        .empty p:last-child{font-size:13px;color:rgba(255,255,255,.3)}
        /* Ambient */
        .amb-wrap{padding:0 20px}
        .amb-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .amb-title{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.3)}
        .amb-sub{font-size:11px;color:rgba(255,255,255,.3);font-weight:300;margin-top:2px}
        .vol-wrap{display:flex;align-items:center;gap:8px}
        .vol-lbl{font-size:9px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.06em}
        input[type=range]{accent-color:#a78bfa;width:64px}
        .amb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .amb-btn{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;border:0.5px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);cursor:pointer;font-family:inherit;position:relative;overflow:hidden;transition:all .3s;-webkit-tap-highlight-color:transparent}
        .amb-btn.on{border-color:rgba(139,92,246,.5);background:rgba(139,92,246,.12)}
        .amb-emoji{font-size:22px;position:relative;z-index:1}
        .amb-lbl{font-size:10px;font-weight:500;color:rgba(255,255,255,.4);position:relative;z-index:1;text-align:center}
        .amb-lbl.on{color:rgba(255,255,255,.9)}
        .amb-mini-bars{display:flex;gap:2px;align-items:flex-end;height:12px;position:relative;z-index:1}
        .amb-tip{text-align:center;margin-top:12px;font-size:10px;color:rgba(255,255,255,.2)}
        /* Now playing */
        .now{position:fixed;left:0;right:0;z-index:25;bottom:calc(64px + env(safe-area-inset-bottom,0px));padding:0 12px 8px;animation:su .3s ease}
        @keyframes su{from{transform:translateY(80px);opacity:0}to{transform:translateY(0);opacity:1}}
        .now-inner{border-radius:18px;overflow:hidden;background:rgba(18,12,36,.95);border:0.5px solid rgba(167,139,250,.2);backdrop-filter:blur(24px);cursor:pointer}
        .now-prog{height:2px;background:rgba(255,255,255,.06)}
        .now-fill{height:100%;background:linear-gradient(90deg,#a78bfa,#f9a8d4);transition:width .2s linear}
        .now-content{display:flex;align-items:center;gap:12px;padding:10px 16px}
        .now-art{width:38px;height:38px;border-radius:11px;flex-shrink:0;background:linear-gradient(135deg,rgba(139,92,246,.7),rgba(59,130,246,.6));display:flex;align-items:center;justify-content:center;font-size:16px}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        .now-art.on{animation:pulse 2s ease-in-out infinite}
        .now-info{flex:1;min-width:0}
        .now-title{font-size:12px;font-weight:500;color:rgba(255,255,255,.92);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .now-artist{font-size:10px;color:rgba(255,255,255,.35);margin-top:2px}
        .now-ctrls{display:flex;align-items:center;gap:4px}
        .nc{width:30px;height:30px;border-radius:50%;border:none;background:transparent;color:rgba(255,255,255,.5);font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .nc:active{transform:scale(.85)}
        .ncp{width:34px;height:34px;border-radius:50%;border:0.5px solid rgba(139,92,246,.4);background:rgba(139,92,246,.25);color:rgba(255,255,255,.92);font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .ncp:active{transform:scale(.88)}
        /* Sheet */
        .backdrop{position:fixed;inset:0;z-index:40;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);animation:fi .2s ease}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        .sheet{position:fixed;bottom:0;left:0;right:0;z-index:41;border-radius:28px 28px 0 0;overflow:hidden;background:rgba(12,8,28,.98);border:0.5px solid rgba(255,255,255,.08);backdrop-filter:blur(24px);max-height:78vh;display:flex;flex-direction:column;animation:shup .3s cubic-bezier(.25,.46,.45,.94)}
        @keyframes shup{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .sh-handle{display:flex;justify-content:center;padding:12px 0 4px;flex-shrink:0}
        .sh-bar{width:32px;height:4px;border-radius:2px;background:rgba(255,255,255,.15)}
        .sh-hdr{padding:8px 20px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0}
        .sh-art{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0}
        .sh-title{font-size:15px;font-weight:600;color:rgba(255,255,255,.95)}
        .sh-desc{font-size:11px;color:rgba(255,255,255,.35);margin-top:3px;line-height:1.4}
        .sh-play{width:44px;height:44px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#8b5cf6,#6d28d9);border:none;color:white;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(139,92,246,.4)}
        .sh-play:active{transform:scale(.92)}
        .sh-tracks{overflow-y:auto;padding:0 20px 32px;flex:1}
        .tr{display:flex;align-items:center;gap:12px;padding:10px 8px;border-radius:12px;cursor:pointer;transition:background .15s;width:100%;border:none;background:transparent;font-family:inherit;text-align:left;-webkit-tap-highlight-color:transparent}
        .tr:active{background:rgba(255,255,255,.05)}
        .tr.cur{background:rgba(139,92,246,.12)}
        .tr-num{width:28px;height:28px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;background:rgba(255,255,255,.05);color:rgba(255,255,255,.25)}
        .tr-num.cur{background:rgba(139,92,246,.3);color:rgba(196,181,253,.9)}
        .tr-info{flex:1;min-width:0}
        .tr-title{font-size:13px;font-weight:500;color:rgba(255,255,255,.8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .tr-title.cur{color:rgba(196,181,253,.95)}
        .tr-artist{font-size:10px;color:rgba(255,255,255,.3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .tr-dur{font-size:11px;color:rgba(255,255,255,.25);flex-shrink:0}
        /* SC hidden iframe */
        .sc-hidden{position:fixed;bottom:-200px;left:-200px;width:1px;height:1px;opacity:0;pointer-events:none;border:none}
        /* Nav */
        .nav{position:fixed;bottom:0;left:0;right:0;z-index:30;background:rgba(8,6,18,.9);border-top:0.5px solid rgba(255,255,255,.07);backdrop-filter:blur(20px);display:flex;justify-content:space-around;padding:10px 8px calc(12px + env(safe-area-inset-bottom,0px))}
        .nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;cursor:pointer;padding:4px 12px;border-radius:14px;transition:background .2s;font-family:inherit;-webkit-tap-highlight-color:transparent}
        .nav-btn.active{background:rgba(139,92,246,.12)}
        .nav-icon{font-size:18px}
        .nav-lbl{font-size:8px;text-transform:uppercase;letter-spacing:.08em}
      `}</style>

      {/* Hidden SoundCloud Widget iframe — controls real audio */}
      <iframe
        ref={iframeRef}
        className="sc-hidden"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(SC_PLAYLIST_URL)}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&buying=false&sharing=false&download=false&visual=false`}
        allow="autoplay"
        title="SoundCloud Player"
      />

      <div className="mp">
        <div className="safe-top" />
        <div className="hdr">
          <p className="hdr-lbl">Lumina Radio</p>
          <h1 className="hdr-title">Your Soundtrack</h1>
          <p className="hdr-sub">Music that meets you where you are.</p>
          <p className="sc-status">
            <span className={`sc-dot${isReady ? ' ready' : ''}`} />
            {isReady ? 'SoundCloud connected' : 'Connecting to SoundCloud…'}
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[{id:'playlists',label:'🎵 Playlists'},{id:'ambient',label:'🔮 Ambiance'}].map(t => (
            <button key={t.id} className={`tab-btn${activeTab===t.id?' active':''}`} onClick={() => setActiveTab(t.id as any)}>{t.label}</button>
          ))}
        </div>

        {activeTab === 'playlists' ? (
          <>
            <div className="filters">
              <div className="filters-row">
                {MOOD_FILTERS.map(f => (
                  <button key={f.id} className={`f-btn${moodFilter===f.id?' active':''}`} onClick={() => setMoodFilter(f.id)}>
                    <span>{f.emoji}</span><span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid-wrap">
              {filteredPlaylists.length === 0 ? (
                <div className="empty"><p>🎵</p><p>No playlists for this mood yet.</p></div>
              ) : (
                <div className="grid">
                  {filteredPlaylists.map(pl => {
                    const active = activePlaylist?.id === pl.id && isPlaying
                    return (
                      <div key={pl.id} className={`pl-card${active?' active-pl':''}`} style={{background:pl.gradient}}>
                        <span className="pl-emoji">{pl.emoji}</span>
                        <p className="pl-title">{pl.title}</p>
                        <p className="pl-count">{pl.tracks.length} tracks</p>
                        <p className="pl-desc">{pl.description}</p>
                        <div className="pl-footer">
                          <button className="pl-view" onClick={() => setShowSheet(pl)}>View</button>
                          <button
                            className={`pl-play${active?' on':''}`}
                            onClick={() => handlePlayPlaylist(pl)}
                            aria-label={active?'Pause':'Play'}
                            disabled={!isReady}
                          >
                            {active?'⏸':'▶'}
                          </button>
                        </div>
                        {active && <div className="bars">{[0,1,2,3].map(i=><div key={i} className="bar on" style={{animationDelay:`${i*.15}s`}}/>)}</div>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="amb-wrap">
            <div className="amb-header">
              <div>
                <p className="amb-title">Ambient Sounds</p>
                <p className="amb-sub">Synthesized in your browser · no downloads</p>
              </div>
              {activeAmbient && (
                <div className="vol-wrap">
                  <span className="vol-lbl">vol</span>
                  <input type="range" min={0} max={1} step={0.05} value={ambientVolume}
                    onChange={e => handleAmbientVolume(parseFloat(e.target.value))} />
                </div>
              )}
            </div>
            <div className="amb-grid">
              {AMBIENT_PRESETS.map((p) => {
                const on = activeAmbient === p.id
                return (
                  <button key={p.id} className={`amb-btn${on?' on':''}`}
                    style={on ? {borderColor:p.color,background:p.color.replace('.5)','0.15)')} : {}}
                    onClick={() => handleAmbient(p.id)}>
                    <span className="amb-emoji">{p.emoji}</span>
                    <span className={`amb-lbl${on?' on':''}`}>{p.label}</span>
                    {on && (
                      <div className="amb-mini-bars">
                        {[0,1,2].map(j=>(
                          <div key={j} className="bar on" style={{animationDelay:`${j*.18}s`,background:'rgba(255,255,255,.6)'}}/>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {!ambientStarted && <p className="amb-tip">Tap a sound to start · works offline</p>}
          </div>
        )}
      </div>

      {/* Now Playing Bar */}
      {currentTrack && (
        <div className="now">
          <div className="now-inner" onClick={() => activePlaylist && setShowSheet(activePlaylist)}>
            <div className="now-prog"><div className="now-fill" style={{width:`${progress*100}%`}}/></div>
            <div className="now-content">
              <div className={`now-art${isPlaying?' on':''}`}>🎵</div>
              <div className="now-info">
                <p className="now-title">{currentTrack.title}</p>
                <p className="now-artist">{currentTrack.artist}</p>
              </div>
              <div className="now-ctrls" onClick={e=>e.stopPropagation()}>
                <button className="nc" onClick={handlePrev}>⏮</button>
                <button className="ncp" onClick={handleToggle}>{isPlaying?'⏸':'▶'}</button>
                <button className="nc" onClick={handleNext}>⏭</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Track Sheet */}
      {showSheet && (
        <>
          <div className="backdrop" onClick={() => setShowSheet(null)}/>
          <div className="sheet">
            <div className="sh-handle"><div className="sh-bar"/></div>
            <div className="sh-hdr">
              <div className="sh-art" style={{background:showSheet.gradient}}>{showSheet.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <p className="sh-title">{showSheet.title}</p>
                <p className="sh-desc">{showSheet.description}</p>
              </div>
              <button className="sh-play" onClick={() => handlePlayPlaylist(showSheet)} disabled={!isReady}>
                {activePlaylist?.id===showSheet.id&&isPlaying?'⏸':'▶'}
              </button>
            </div>
            <div className="sh-tracks">
              {showSheet.tracks.map((track,i) => {
                const isCur = currentTrack?.id === track.id
                return (
                  <button key={track.id} className={`tr${isCur?' cur':''}`}
                    onClick={() => { handlePlayPlaylist(showSheet,i); setTimeout(()=>setShowSheet(null),300) }}
                    disabled={!isReady}>
                    <div className={`tr-num${isCur?' cur':''}`}>{isCur&&isPlaying?'♫':i+1}</div>
                    <div className="tr-info">
                      <p className={`tr-title${isCur?' cur':''}`}>{track.title}</p>
                      <p className="tr-artist">{track.artist}</p>
                    </div>
                    <span className="tr-dur">{fmt(track.duration)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav */}
      <nav className="nav">
        {[
          {icon:'🏠',label:'Home',href:'/'},
          {icon:'🎵',label:'Music',href:'/music'},
          {icon:'✦',label:'Lumina',href:'/companion'},
          {icon:'📖',label:'Journal',href:'/journal'},
          {icon:'🤍',label:'You',href:'/profile'},
        ].map(tab => (
          <button key={tab.href} className={`nav-btn${tab.href==='/music'?' active':''}`}
            onClick={() => router.push(tab.href as any)}>
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-lbl" style={{color:tab.href==='/music'?'rgba(196,181,253,.8)':'rgba(255,255,255,.3)'}}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
