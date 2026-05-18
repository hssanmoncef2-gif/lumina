'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

declare global { interface Window { SC: any } }

const SC_PLAYLIST_URL = 'https://soundcloud.com/moncef-hssan/sets/lumina-radio'

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

const PLAYLIST_CARDS = [
  { id: 'arabic-fire',    scIndex: 0,  title: 'Arabic Fire 🔥',    desc: 'High-energy Arabic pop to ignite your night.',            emoji: '🔥',  grad: 'linear-gradient(135deg,rgba(239,68,68,0.65),rgba(245,158,11,0.6))',   moods: ['alive','joyful'] },
  { id: 'arabic-soft',    scIndex: 8,  title: 'Arabic Soft 🌸',    desc: 'Tender voices and warm melodies.',                        emoji: '🌸',  grad: 'linear-gradient(135deg,rgba(236,72,153,0.55),rgba(196,181,253,0.55))', moods: ['soft','healing','calm'] },
  { id: 'arabic-nights',  scIndex: 13, title: 'Arabic Nights 🌙',  desc: 'Late nights and longing hearts.',                         emoji: '🌙',  grad: 'linear-gradient(135deg,rgba(139,92,246,0.65),rgba(30,27,75,0.8))',    moods: ['drifting','heavy'] },
  { id: 'arabic-healing', scIndex: 18, title: 'Arabic Healing 🌿', desc: 'Songs that understand your heart.',                       emoji: '🌿',  grad: 'linear-gradient(135deg,rgba(34,197,94,0.5),rgba(6,182,212,0.5))',    moods: ['healing','soft'] },
  { id: 'britney',        scIndex: 23, title: 'Britney Era ⚡',    desc: 'Early 2000s pop energy. Iconic, unapologetic, electric.',  emoji: '⚡',  grad: 'linear-gradient(135deg,rgba(234,179,8,0.65),rgba(249,115,22,0.6))',  moods: ['alive','joyful'] },
  { id: 'bruno',          scIndex: 33, title: 'Bruno Vibes 🌟',    desc: 'Smooth, feel-good grooves.',                              emoji: '🌟',  grad: 'linear-gradient(135deg,rgba(251,191,36,0.55),rgba(234,179,8,0.5))',  moods: ['joyful','alive','soft'] },
  { id: 'dystinct',       scIndex: 40, title: 'DYSTINCT Mode 👑',  desc: 'Arabic trap swagger. Walk tall, feel unstoppable.',       emoji: '👑',  grad: 'linear-gradient(135deg,rgba(79,70,229,0.7),rgba(139,92,246,0.65))',  moods: ['alive','joyful'] },
  { id: 'french',         scIndex: 42, title: 'French Drift 🌧️',  desc: 'French sounds for rainy evenings.',                       emoji: '🌧️', grad: 'linear-gradient(135deg,rgba(99,102,241,0.65),rgba(59,130,246,0.55))', moods: ['soft','drifting','calm'] },
  { id: 'queen',          scIndex: 47, title: 'Queen Catharsis 🎸',desc: 'For when you need to feel it all.',                       emoji: '🎸',  grad: 'linear-gradient(135deg,rgba(99,102,241,0.7),rgba(139,92,246,0.65))',  moods: ['heavy','healing','alive'] },
]

// ─── Ambient layers — each is independent, mixable ───────────────────────────
const AMBIENT_LAYERS = [
  { id: 'rain',     label: 'Rain',        emoji: '🌧',  color: '#818cf8', desc: 'Soft rainfall' },
  { id: 'ocean',    label: 'Ocean',       emoji: '🌊',  color: '#38bdf8', desc: 'Rolling waves' },
  { id: 'forest',   label: 'Forest',      emoji: '🌲',  color: '#4ade80', desc: 'Wind & leaves' },
  { id: 'fire',     label: 'Fireplace',   emoji: '🔥',  color: '#fb923c', desc: 'Crackling fire' },
  { id: 'space',    label: 'Deep Space',  emoji: '🌌',  color: '#a78bfa', desc: 'Cosmic drones' },
  { id: 'noise',    label: 'Brown Noise', emoji: '🤎',  color: '#a16207', desc: 'Focus drift' },
  { id: 'cafe',     label: 'Café',        emoji: '☕',  color: '#f59e0b', desc: 'Murmur & clinks' },
  { id: 'wind',     label: 'Night Wind',  emoji: '🌬',  color: '#67e8f9', desc: 'Hollow breeze' },
]

// ─── Preset mixes ─────────────────────────────────────────────────────────────
const PRESETS = [
  { id: 'sleep',   label: 'Deep Sleep',   emoji: '😴', layers: { rain: 0.6, noise: 0.3 } },
  { id: 'focus',   label: 'Focus Mode',   emoji: '🎯', layers: { noise: 0.5, cafe: 0.3 } },
  { id: 'cozy',    label: 'Cozy Night',   emoji: '🕯',  layers: { fire: 0.6, rain: 0.35 } },
  { id: 'nature',  label: 'In Nature',    emoji: '🌿', layers: { forest: 0.6, ocean: 0.25, wind: 0.2 } },
  { id: 'cosmos',  label: 'Cosmos',       emoji: '✦',  layers: { space: 0.7, noise: 0.2 } },
  { id: 'storm',   label: 'Storm',        emoji: '⛈',  layers: { rain: 0.8, wind: 0.5 } },
]

// ─── Web Audio Engine (multi-layer) ───────────────────────────────────────────
class AmbientEngine {
  private ctx: AudioContext | null = null
  private layers: Map<string, { nodes: (AudioBufferSourceNode | OscillatorNode)[], gain: GainNode, cafeTimer?: ReturnType<typeof setInterval> }> = new Map()

  private gc(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext()
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  private mkNoise(ctx: AudioContext, type: 'white' | 'pink' | 'brown') {
    const sz = ctx.sampleRate * 4, buf = ctx.createBuffer(1, sz, ctx.sampleRate), d = buf.getChannelData(0)
    if (type === 'white') { for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1 }
    else if (type === 'brown') { let l = 0; for (let i = 0; i < sz; i++) { l = (l + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5 } }
    else { let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0; for (let i=0;i<sz;i++){const w=Math.random()*2-1;b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11;b6=w*.115926} }
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; return s
  }
  private mkOsc(ctx: AudioContext, f: number) { const o = ctx.createOscillator(); o.frequency.value = f; return o }
  private mkFilt(ctx: AudioContext, t: BiquadFilterType, f: number) { const b = ctx.createBiquadFilter(); b.type = t; b.frequency.value = f; return b }
  private mkGain(ctx: AudioContext, v: number) { const g = ctx.createGain(); g.gain.value = v; return g }

  async startLayer(id: string, vol: number) {
    await this.stopLayer(id)
    const ctx = this.gc()
    if (ctx.state === 'suspended') await ctx.resume()
    const layerGain = this.mkGain(ctx, vol)
    layerGain.connect(ctx.destination)
    const nodes: (AudioBufferSourceNode | OscillatorNode)[] = []
    let cafeTimer: ReturnType<typeof setInterval> | undefined

    const add = (n: AudioBufferSourceNode | OscillatorNode) => { n.start(); nodes.push(n) }
    const chain = (...nn: AudioNode[]) => { for (let i = 0; i < nn.length - 1; i++) nn[i].connect(nn[i+1]) }

    if (id === 'rain') {
      const n = this.mkNoise(ctx, 'pink'), f = this.mkFilt(ctx, 'lowpass', 1400), g = this.mkGain(ctx, .5)
      chain(n, f, g, layerGain); add(n)
      const r = this.mkNoise(ctx, 'brown'), rg = this.mkGain(ctx, .2); chain(r, rg, layerGain); add(r)
    } else if (id === 'ocean') {
      const n = this.mkNoise(ctx, 'pink'), f = this.mkFilt(ctx, 'lowpass', 900), g = this.mkGain(ctx, .4)
      const lfo = this.mkOsc(ctx, .1), lg = this.mkGain(ctx, .3)
      lfo.type = 'sine'; chain(lfo, lg); lg.connect(g.gain as any); chain(n, f, g, layerGain); add(n); add(lfo)
      const d = this.mkNoise(ctx, 'brown'), dg = this.mkGain(ctx, .15); chain(d, dg, layerGain); add(d)
    } else if (id === 'forest') {
      const n = this.mkNoise(ctx, 'pink'), f = this.mkFilt(ctx, 'bandpass', 2800), g = this.mkGain(ctx, .22); chain(n, f, g, layerGain); add(n)
      const w = this.mkNoise(ctx, 'white'), wf = this.mkFilt(ctx, 'highpass', 4500), wg = this.mkGain(ctx, .07); chain(w, wf, wg, layerGain); add(w)
    } else if (id === 'fire') {
      const n = this.mkNoise(ctx, 'brown'), f = this.mkFilt(ctx, 'lowpass', 400), g = this.mkGain(ctx, .45); chain(n, f, g, layerGain); add(n)
      const c = this.mkNoise(ctx, 'white'), cf = this.mkFilt(ctx, 'bandpass', 1000), cg = this.mkGain(ctx, .08)
      const lfo = this.mkOsc(ctx, .3), lg = this.mkGain(ctx, .06); chain(lfo, lg); lg.connect(cg.gain as any); chain(c, cf, cg, layerGain); add(c); add(lfo)
    } else if (id === 'space') {
      ;[55, 82.5, 110, 165].forEach((f, i) => {
        const o = this.mkOsc(ctx, f + i * .3), g = this.mkGain(ctx, .07)
        const lfo = this.mkOsc(ctx, .04 + i * .015), lg = this.mkGain(ctx, .03)
        lfo.type = 'sine'; chain(lfo, lg); lg.connect(g.gain as any); chain(o, g, layerGain); add(o); add(lfo)
      })
      const n = this.mkNoise(ctx, 'brown'), nf = this.mkFilt(ctx, 'lowpass', 180), ng = this.mkGain(ctx, .06); chain(n, nf, ng, layerGain); add(n)
    } else if (id === 'noise') {
      const n = this.mkNoise(ctx, 'brown'), f = this.mkFilt(ctx, 'lowpass', 700), g = this.mkGain(ctx, .55); chain(n, f, g, layerGain); add(n)
    } else if (id === 'cafe') {
      const n = this.mkNoise(ctx, 'pink'), f = this.mkFilt(ctx, 'bandpass', 1100), g = this.mkGain(ctx, .22); chain(n, f, g, layerGain); add(n)
      const clink = () => {
        if (!this.ctx) return
        const o = this.ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 1700 + Math.random() * 500
        const g2 = this.ctx.createGain(), now = this.ctx.currentTime
        g2.gain.setValueAtTime(0, now); g2.gain.linearRampToValueAtTime(.05, now + .01); g2.gain.exponentialRampToValueAtTime(.001, now + .45)
        o.connect(g2); g2.connect(layerGain); o.start(); o.stop(now + .46)
      }
      clink(); cafeTimer = setInterval(clink, 2200 + Math.random() * 3500)
      const h = this.mkNoise(ctx, 'white'), hf = this.mkFilt(ctx, 'highpass', 5500), hg = this.mkGain(ctx, .06); chain(h, hf, hg, layerGain); add(h)
    } else if (id === 'wind') {
      const n = this.mkNoise(ctx, 'pink'), f = this.mkFilt(ctx, 'bandpass', 600), g = this.mkGain(ctx, .3)
      const lfo = this.mkOsc(ctx, .07), lg = this.mkGain(ctx, .25); chain(lfo, lg); lg.connect(g.gain as any); chain(n, f, g, layerGain); add(n); add(lfo)
      const h = this.mkNoise(ctx, 'white'), hf = this.mkFilt(ctx, 'highpass', 5000), hg = this.mkGain(ctx, .04); chain(h, hf, hg, layerGain); add(h)
    }

    this.layers.set(id, { nodes, gain: layerGain, cafeTimer })
  }

  async stopLayer(id: string) {
    const layer = this.layers.get(id)
    if (!layer) return
    if (layer.cafeTimer) clearInterval(layer.cafeTimer)
    layer.nodes.forEach(n => { try { n.stop(); n.disconnect() } catch {} })
    layer.gain.disconnect()
    this.layers.delete(id)
  }

  setLayerVolume(id: string, vol: number) {
    const layer = this.layers.get(id)
    if (layer && this.ctx) layer.gain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1)
  }

  isPlaying(id: string) { return this.layers.has(id) }

  async stopAll() {
    for (const id of this.layers.keys()) await this.stopLayer(id)
  }

  cleanup() { this.stopAll(); if (this.ctx) { this.ctx.close(); this.ctx = null } }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MusicPage() {
  const router = useRouter()
  const [moodFilter, setMoodFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'playlists' | 'ambient'>('playlists')
  const [playerReady, setPlayerReady] = useState(false)
  const [playerVisible, setPlayerVisible] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [nowPlaying, setNowPlaying] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [scLoaded, setScLoaded] = useState(false)
  const [volume, setVolumeState] = useState(0.8)

  // Ambient: each layer has its own volume 0–1, or null = off
  const [layerVols, setLayerVols] = useState<Record<string, number>>({})
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null)

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const widgetRef = useRef<any>(null)
  const engineRef = useRef<AmbientEngine | null>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    engineRef.current = new AmbientEngine()
    if ((window as any).SC) { setScLoaded(true); return }
    const s = document.createElement('script')
    s.src = 'https://w.soundcloud.com/player/api.js'
    s.onload = () => setScLoaded(true)
    document.head.appendChild(s)
    return () => { engineRef.current?.cleanup() }
  }, [])

  useEffect(() => {
    if (!scLoaded || !iframeRef.current || widgetRef.current) return
    const SC = (window as any).SC
    const widget = SC.Widget(iframeRef.current)
    widgetRef.current = widget
    widget.bind(SC.Widget.Events.READY, () => { setPlayerReady(true); widget.setVolume(volume * 100) })
    widget.bind(SC.Widget.Events.PLAY, () => { setIsPlaying(true); widget.getCurrentSound((s: any) => { if (s) setNowPlaying(s.title) }) })
    widget.bind(SC.Widget.Events.PAUSE, () => setIsPlaying(false))
    widget.bind(SC.Widget.Events.FINISH, () => setIsPlaying(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scLoaded])

  useEffect(() => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    if (isPlaying && widgetRef.current) {
      progressTimer.current = setInterval(() => {
        widgetRef.current.getPosition((pos: number) => {
          widgetRef.current.getDuration((dur: number) => { if (dur > 0) setProgress(pos / dur) })
        })
      }, 500)
    }
    return () => { if (progressTimer.current) clearInterval(progressTimer.current) }
  }, [isPlaying])

  const toggleLayer = useCallback(async (id: string) => {
    if (!engineRef.current) return
    if (layerVols[id] !== undefined) {
      await engineRef.current.stopLayer(id)
      setLayerVols(v => { const n = { ...v }; delete n[id]; return n })
      if (expandedLayer === id) setExpandedLayer(null)
    } else {
      const vol = 0.5
      await engineRef.current.startLayer(id, vol)
      setLayerVols(v => ({ ...v, [id]: vol }))
      setExpandedLayer(id)
    }
  }, [layerVols, expandedLayer])

  const setLayerVol = useCallback((id: string, vol: number) => {
    engineRef.current?.setLayerVolume(id, vol)
    setLayerVols(v => ({ ...v, [id]: vol }))
  }, [])

  const applyPreset = useCallback(async (preset: typeof PRESETS[0]) => {
    if (!engineRef.current) return
    // stop all current
    await engineRef.current.stopAll()
    setLayerVols({})
    // start preset layers
    const newVols: Record<string, number> = {}
    for (const [id, vol] of Object.entries(preset.layers)) {
      await engineRef.current.startLayer(id, vol)
      newVols[id] = vol
    }
    setLayerVols(newVols)
    setExpandedLayer(null)
  }, [])

  const stopAll = useCallback(async () => {
    await engineRef.current?.stopAll()
    setLayerVols({})
    setExpandedLayer(null)
  }, [])

  const filtered = moodFilter === 'all' ? PLAYLIST_CARDS : PLAYLIST_CARDS.filter(p => p.moods.includes(moodFilter))
  const activeLayerCount = Object.keys(layerVols).length

  const scUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(SC_PLAYLIST_URL)}&color=%23a78bfa&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&buying=false&sharing=false&download=false`

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg,#080612 0%,#0e0a1f 50%,#0a0f1e 100%)', fontFamily: "'Sora','Inter',sans-serif", color: '#fff', overflowX: 'hidden', paddingBottom: 100 }}>
      <div style={{ height: 'env(safe-area-inset-top, 16px)' }} />

      {/* Header */}
      <div style={{ padding: '20px 20px 12px' }}>
        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.12em', color: 'rgba(255,255,255,.3)', marginBottom: 4 }}>Lumina Radio</p>
        <h1 style={{ fontSize: 26, fontWeight: 600, background: 'linear-gradient(135deg,#e2d9f3,#a78bfa,#f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Your Soundtrack</h1>
        <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,.3)', marginTop: 6 }}>Music that meets you where you are.</p>
      </div>

      {/* SoundCloud player */}
      <div style={{ margin: '0 16px 20px', borderRadius: 20, overflow: 'hidden', border: '.5px solid rgba(167,139,250,.2)', background: 'rgba(255,255,255,.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 12px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#ff5500,#ff8800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>☁️</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nowPlaying ?? 'Lumina Radio'}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>
              {!playerReady ? 'Loading…' : isPlaying ? '▶ Now playing' : 'Ready · tap a playlist below'}
            </p>
          </div>
          <button onClick={() => setPlayerVisible(v => !v)} style={{ fontSize: 10, color: 'rgba(167,139,250,.9)', background: 'rgba(139,92,246,.15)', border: '.5px solid rgba(139,92,246,.3)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {playerVisible ? '▲ Hide' : '▼ Show'}
          </button>
        </div>
        <div style={{ overflow: 'hidden', transition: 'height .3s ease', height: playerVisible ? 166 : 0 }}>
          <iframe ref={iframeRef} src={scUrl} height="166" allow="autoplay" title="Lumina Radio" style={{ width: '100%', border: 'none', display: 'block' }} />
        </div>
        {!playerVisible && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 12px' }}>
            <button onClick={() => widgetRef.current?.prev()} style={{ width: 34, height: 34, borderRadius: '50%', border: '.5px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.06)', cursor: 'pointer', fontSize: 13 }}>⏮</button>
            <button onClick={() => widgetRef.current?.isPaused((p: boolean) => p ? widgetRef.current.play() : widgetRef.current.pause())} style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', border: 'none', cursor: 'pointer', fontSize: 16 }}>{isPlaying ? '⏸' : '▶'}</button>
            <button onClick={() => widgetRef.current?.next()} style={{ width: 34, height: 34, borderRadius: '50%', border: '.5px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.06)', cursor: 'pointer', fontSize: 13 }}>⏭</button>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nowPlaying ?? '—'}</p>
              <div style={{ marginTop: 5, height: 2, borderRadius: 2, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', width: `${progress * 100}%`, transition: 'width .5s linear' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 16px 16px', display: 'flex', gap: 6 }}>
        {[{ id: 'playlists', label: '🎵 Playlists' }, { id: 'ambient', label: '🔮 Ambiance' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            style={{ flex: 1, padding: 9, borderRadius: 12, border: `.5px solid ${activeTab === t.id ? 'rgba(139,92,246,.4)' : 'rgba(255,255,255,.07)'}`, background: activeTab === t.id ? 'rgba(139,92,246,.2)' : 'rgba(255,255,255,.04)', color: activeTab === t.id ? 'rgba(196,181,253,.95)' : 'rgba(255,255,255,.35)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            {t.label}
            {t.id === 'ambient' && activeLayerCount > 0 && (
              <span style={{ marginLeft: 6, background: 'rgba(139,92,246,.4)', borderRadius: 8, padding: '1px 6px', fontSize: 9 }}>{activeLayerCount}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'playlists' ? (
        <>
          {/* Mood filters */}
          <div style={{ padding: '0 16px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', gap: 8, whiteSpace: 'nowrap' }}>
              {MOOD_FILTERS.map(f => (
                <button key={f.id} onClick={() => setMoodFilter(f.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 999, border: `.5px solid ${moodFilter === f.id ? 'rgba(139,92,246,.45)' : 'rgba(255,255,255,.08)'}`, background: moodFilter === f.id ? 'rgba(139,92,246,.22)' : 'rgba(255,255,255,.05)', color: moodFilter === f.id ? 'rgba(196,181,253,.95)' : 'rgba(255,255,255,.35)', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <span>{f.emoji}</span><span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.12em', color: 'rgba(255,255,255,.25)', padding: '0 16px 10px' }}>Browse by vibe</p>
          {filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: '60px 20px' }}><div style={{ fontSize: 32, marginBottom: 8 }}>🎵</div><p style={{ fontSize: 13, color: 'rgba(255,255,255,.3)' }}>No playlists for this mood.</p></div>
            : <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
                {filtered.map(pl => (
                  <div key={pl.id} onClick={() => { setPlayerVisible(true); if (playerReady) { widgetRef.current?.skip(pl.scIndex); widgetRef.current?.play() } }}
                    style={{ borderRadius: 20, padding: '18px 16px 16px', cursor: 'pointer', border: '.5px solid rgba(255,255,255,.1)', backdropFilter: 'blur(12px)', background: pl.grad, WebkitTapHighlightColor: 'transparent' }}>
                    <span style={{ fontSize: 28, marginBottom: 10, display: 'block' }}>{pl.emoji}</span>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.95)', lineHeight: 1.3, marginBottom: 5 }}>{pl.title}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pl.desc}</p>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.07em', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,.3)' }} />
                      <span>{playerReady ? 'Tap to play' : 'Loading…'}</span>
                    </div>
                  </div>
                ))}
              </div>
          }
        </>
      ) : (
        // ─── AMBIENT TAB ───────────────────────────────────────────────────────
        <div style={{ padding: '0 16px' }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.12em', color: 'rgba(255,255,255,.3)' }}>Sound Mixer</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', fontWeight: 300, marginTop: 2 }}>Layer sounds · each has its own volume</p>
            </div>
            {activeLayerCount > 0 && (
              <button onClick={stopAll} style={{ fontSize: 10, color: 'rgba(255,120,120,.7)', background: 'rgba(255,80,80,.08)', border: '.5px solid rgba(255,100,100,.15)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Stop all
              </button>
            )}
          </div>

          {/* Preset mixes */}
          <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,.2)', marginBottom: 10 }}>Quick presets</p>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none', marginBottom: 20 }}>
            {PRESETS.map(p => (
              <button key={p.id} onClick={() => applyPreset(p)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 14px', borderRadius: 14, border: '.5px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.04)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>{p.emoji}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Layer cards */}
          <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,.2)', marginBottom: 10 }}>Individual layers</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {AMBIENT_LAYERS.map(layer => {
              const vol = layerVols[layer.id]
              const on = vol !== undefined

              return (
                <motion.div key={layer.id} layout
                  style={{
                    borderRadius: 16,
                    border: on ? `.5px solid ${layer.color}55` : '.5px solid rgba(255,255,255,.07)',
                    background: on ? `${layer.color}18` : 'rgba(255,255,255,.03)',
                    overflow: 'hidden',
                    transition: 'border-color .2s, background .2s',
                  }}
                >
                  {/* Main row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                    {/* Toggle button */}
                    <button onClick={() => toggleLayer(layer.id)}
                      style={{
                        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                        border: on ? `.5px solid ${layer.color}88` : '.5px solid rgba(255,255,255,.1)',
                        background: on ? `${layer.color}28` : 'rgba(255,255,255,.05)',
                        fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .2s',
                      }}>
                      {layer.emoji}
                    </button>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: on ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.5)' }}>{layer.label}</p>
                        {on && (
                          <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 10 }}>
                            {[0, 1, 2].map(j => (
                              <div key={j} style={{
                                width: 3, borderRadius: 2, background: layer.color,
                                animation: `ambbar .7s ease-in-out ${j * .2}s infinite`,
                              }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', marginTop: 1 }}>{layer.desc}</p>
                    </div>

                    {/* Expand/collapse when on */}
                    {on && (
                      <button onClick={() => setExpandedLayer(e => e === layer.id ? null : layer.id)}
                        style={{ width: 28, height: 28, borderRadius: 8, border: '.5px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', cursor: 'pointer', color: 'rgba(255,255,255,.4)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {expandedLayer === layer.id ? '▴' : '▾'}
                      </button>
                    )}

                    {/* Play/stop toggle label */}
                    {!on && (
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Tap</span>
                    )}
                  </div>

                  {/* Volume slider (expanded) */}
                  <AnimatePresence>
                    {on && expandedLayer === layer.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 14px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 12 }}>🔉</span>
                          <div style={{ flex: 1, position: 'relative' }}>
                            <input type="range" min={0} max={1} step={0.02} value={vol}
                              onChange={e => setLayerVol(layer.id, parseFloat(e.target.value))}
                              style={{ width: '100%', accentColor: layer.color }} />
                          </div>
                          <span style={{ fontSize: 12 }}>🔊</span>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', minWidth: 28, textAlign: 'right' }}>{Math.round(vol * 100)}%</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {activeLayerCount === 0 && (
            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,.18)', fontStyle: 'italic' }}>
              Tap a layer or choose a preset to begin ✦
            </p>
          )}

          {/* Active mix summary */}
          {activeLayerCount > 0 && (
            <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,.03)', border: '.5px solid rgba(255,255,255,.07)' }}>
              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,.2)', marginBottom: 8 }}>Active mix</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(layerVols).map(([id, v]) => {
                  const layer = AMBIENT_LAYERS.find(l => l.id === id)!
                  return (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: `${layer.color}18`, border: `.5px solid ${layer.color}40` }}>
                      <span style={{ fontSize: 12 }}>{layer.emoji}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.6)' }}>{Math.round(v * 100)}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ height: 20 }} />
        </div>
      )}

      <style>{`
        @keyframes ambbar { 0%,100% { height: 3px } 50% { height: 10px } }
        input[type=range] { -webkit-appearance: none; height: 3px; border-radius: 2px; background: rgba(255,255,255,.1); outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; cursor: pointer; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30, background: 'rgba(8,6,18,.9)', borderTop: '.5px solid rgba(255,255,255,.07)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'space-around', padding: 'calc(10px) 8px calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        {[{icon:'🏠',label:'Home',href:'/'},{icon:'🎵',label:'Music',href:'/music'},{icon:'✦',label:'Lumina',href:'/companion'},{icon:'📖',label:'Journal',href:'/journal'},{icon:'🤍',label:'You',href:'/profile'}].map(t => (
          <button key={t.href} onClick={() => router.push(t.href as any)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: t.href === '/music' ? 'rgba(139,92,246,.12)' : 'none', border: 'none', cursor: 'pointer', padding: '4px 12px', borderRadius: 14, fontFamily: 'inherit' }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '.08em', color: t.href === '/music' ? 'rgba(196,181,253,.8)' : 'rgba(255,255,255,.3)' }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
