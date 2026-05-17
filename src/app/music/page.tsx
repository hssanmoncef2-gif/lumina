'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ============================================================
// Types
// ============================================================
interface AmbientPreset {
  id: string
  label: string
  emoji: string
  color: string
}

// ============================================================
// Constants
// ============================================================
const SC_PLAYLIST_URL = 'https://soundcloud.com/moncef-hssan/sets/lumina-radio'

const MOOD_FILTERS = [
  { id:'all',      label:'All',     emoji:'✦' },
  { id:'alive',    label:'Energy',  emoji:'⚡' },
  { id:'joyful',   label:'Joyful',  emoji:'✨' },
  { id:'soft',     label:'Tender',  emoji:'🌸' },
  { id:'drifting', label:'Adrift',  emoji:'🌙' },
  { id:'healing',  label:'Healing', emoji:'🌱' },
  { id:'heavy',    label:'Release', emoji:'🌧' },
  { id:'calm',     label:'Still',   emoji:'🌊' },
]

const PLAYLIST_CARDS = [
  { id:'arabic-fire',    title:'Arabic Fire 🔥',    description:'High-energy Arabic pop to ignite your night.',          emoji:'🔥',  gradient:'linear-gradient(135deg,rgba(239,68,68,0.6) 0%,rgba(245,158,11,0.55) 100%)', moods:['alive','joyful'] },
  { id:'arabic-soft',    title:'Arabic Soft 🌸',    description:'Tender voices and warm melodies.',                      emoji:'🌸',  gradient:'linear-gradient(135deg,rgba(236,72,153,0.5) 0%,rgba(196,181,253,0.5) 100%)', moods:['soft','healing','calm'] },
  { id:'arabic-nights',  title:'Arabic Nights 🌙',  description:'Late nights and longing hearts.',                       emoji:'🌙',  gradient:'linear-gradient(135deg,rgba(139,92,246,0.6) 0%,rgba(30,27,75,0.75) 100%)',  moods:['drifting','heavy'] },
  { id:'arabic-healing', title:'Arabic Healing 🌿', description:'Songs that understand your heart.',                     emoji:'🌿',  gradient:'linear-gradient(135deg,rgba(34,197,94,0.45) 0%,rgba(6,182,212,0.45) 100%)', moods:['healing','soft'] },
  { id:'britney',        title:'Britney Era ⚡',     description:'Early 2000s pop energy. Iconic, unapologetic, electric.',emoji:'⚡', gradient:'linear-gradient(135deg,rgba(234,179,8,0.6) 0%,rgba(249,115,22,0.55) 100%)',  moods:['alive','joyful'] },
  { id:'bruno',          title:'Bruno Vibes 🌟',     description:'Smooth, feel-good grooves.',                            emoji:'🌟',  gradient:'linear-gradient(135deg,rgba(251,191,36,0.5) 0%,rgba(234,179,8,0.45) 100%)',  moods:['joyful','alive','soft'] },
  { id:'dystinct',       title:'DYSTINCT Mode 👑',   description:'Arabic trap swagger. Walk tall, feel unstoppable.',     emoji:'👑',  gradient:'linear-gradient(135deg,rgba(79,70,229,0.65) 0%,rgba(139,92,246,0.6) 100%)',  moods:['alive','joyful'] },
  { id:'french',         title:'French Drift 🌧️',   description:'French sounds for rainy evenings.',                     emoji:'🌧️', gradient:'linear-gradient(135deg,rgba(99,102,241,0.6) 0%,rgba(59,130,246,0.5) 100%)',   moods:['soft','drifting','calm'] },
  { id:'queen',          title:'Queen Catharsis 🎸', description:'For when you need to feel it all.',                     emoji:'🎸',  gradient:'linear-gradient(135deg,rgba(99,102,241,0.65) 0%,rgba(139,92,246,0.6) 100%)', moods:['heavy','healing','alive'] },
]

const AMBIENT_PRESETS: AmbientPreset[] = [
  { id:'rain',   label:'Rain',        emoji:'🌧️', color:'rgba(99,102,241,0.5)'  },
  { id:'ocean',  label:'Ocean',       emoji:'🌊', color:'rgba(14,165,233,0.5)'  },
  { id:'forest', label:'Forest',      emoji:'🌲', color:'rgba(34,197,94,0.5)'   },
  { id:'space',  label:'Deep Space',  emoji:'🌌', color:'rgba(139,92,246,0.5)'  },
  { id:'noise',  label:'Brown Noise', emoji:'🤎', color:'rgba(180,120,60,0.5)'  },
  { id:'cafe',   label:'Café',        emoji:'☕', color:'rgba(217,119,6,0.5)'   },
]

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
    const start = (n: AudioBufferSourceNode | OscillatorNode) => { n.start(); this.nodes.push(n) }

    if (presetId === 'rain') {
      const n = noise('pink'); const g = gain(0.4)
      const filter = ctx.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value=1200
      connect(n, filter, g, master); start(n)
      const rumble = noise('brown'); const rg = gain(0.15)
      const lfo = osc(0.08); const lg = gain(0.12)
      connect(lfo, lg, rg.gain as any); connect(rumble, rg, master)
      start(rumble); start(lfo)
    } else if (presetId === 'ocean') {
      const n = noise('pink'); const g = gain(0.35)
      const f1 = ctx.createBiquadFilter(); f1.type='lowpass'; f1.frequency.value=800
      const lfo = osc(0.12); const lg = gain(0.28)
      connect(lfo, lg, g.gain as any); connect(n, f1, g, master); start(n); start(lfo)
      const deep = noise('brown'); const dg = gain(0.12)
      connect(deep, dg, master); start(deep)
    } else if (presetId === 'forest') {
      const n = noise('pink'); const g = gain(0.18)
      const f = ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=3000; f.Q.value=0.5
      connect(n, f, g, master); start(n)
      const wind = noise('white'); const wg = gain(0.06)
      const wf = ctx.createBiquadFilter(); wf.type='highpass'; wf.frequency.value=4000
      connect(wind, wf, wg, master); start(wind)
    } else if (presetId === 'space') {
      const freqs = [55, 82.5, 110, 165]
      freqs.forEach((f, i) => {
        const o = osc(f + i * 0.3); const g = gain(0.06)
        const lfo = osc(0.04 + i * 0.015); const lg = gain(0.03)
        connect(lfo, lg, g.gain as any); connect(o, g, master); start(o); start(lfo)
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
      ;(this as any)._cafeInterval = setInterval(clink, 2500 + Math.random()*3000)
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
// Main Page
// ============================================================
export default function MusicPage() {
  const router = useRouter()
  const [moodFilter, setMoodFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'playlists'|'ambient'>('playlists')
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null)
  const [ambientVolume, setAmbientVolume] = useState(0.4)
  const [ambientStarted, setAmbientStarted] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const ambientRef = useRef<AmbientEngine | null>(null)

  useEffect(() => {
    ambientRef.current = new AmbientEngine()
    return () => { ambientRef.current?.cleanup() }
  }, [])

  const filteredCards = moodFilter === 'all'
    ? PLAYLIST_CARDS
    : PLAYLIST_CARDS.filter(pl => pl.moods.includes(moodFilter))

  const handleAmbient = useCallback(async (id: string) => {
    if (!ambientRef.current) return
    setAmbientStarted(true)
    if (activeAmbient === id) {
      ambientRef.current.stop(); setActiveAmbient(null)
    } else {
      await ambientRef.current.play(id, ambientVolume)
      setActiveAmbient(id)
    }
  }, [activeAmbient, ambientVolume])

  const handleAmbientVolume = useCallback((v: number) => {
    setAmbientVolume(v)
    ambientRef.current?.setVolume(v)
  }, [])

  const scEmbedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(SC_PLAYLIST_URL)}&color=%23a78bfa&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&buying=false&sharing=false&download=false`

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .mp{min-height:100dvh;background:linear-gradient(180deg,#080612 0%,#0e0a1f 50%,#0a0f1e 100%);font-family:'Sora','Inter',sans-serif;color:white;overflow-x:hidden;padding-bottom:100px}
        .safe-top{height:env(safe-area-inset-top,16px)}
        .hdr{padding:20px 20px 12px}
        .hdr-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.3);margin-bottom:4px}
        .hdr-title{font-size:26px;font-weight:600;background:linear-gradient(135deg,#e2d9f3,#a78bfa,#f9a8d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hdr-sub{font-size:13px;font-weight:300;color:rgba(255,255,255,.3);margin-top:6px}
        .sc-section{margin:0 16px 20px;border-radius:20px;overflow:hidden;border:0.5px solid rgba(167,139,250,.2);background:rgba(255,255,255,.03)}
        .sc-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 12px}
        .sc-label{display:flex;align-items:center;gap:10px}
        .sc-icon{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#ff5500,#ff8800);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
        .sc-name{font-size:13px;font-weight:600;color:rgba(255,255,255,.9)}
        .sc-sub{font-size:10px;color:rgba(255,255,255,.35);margin-top:1px}
        .sc-toggle{font-size:10px;color:rgba(167,139,250,.9);background:rgba(139,92,246,.15);border:0.5px solid rgba(139,92,246,.3);border-radius:8px;padding:6px 12px;cursor:pointer;font-family:inherit;transition:all .2s;white-space:nowrap}
        .sc-toggle:active{background:rgba(139,92,246,.3)}
        .sc-player{overflow:hidden;transition:all .3s ease}
        .sc-player iframe{width:100%;border:none;display:block}
        .tabs{padding:0 16px 16px;display:flex;gap:6px}
        .tab-btn{flex:1;padding:9px;border-radius:12px;border:0.5px solid rgba(255,255,255,.07);background:rgba(255,255,255,.04);color:rgba(255,255,255,.35);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;font-family:inherit}
        .tab-btn.active{background:rgba(139,92,246,.2);border-color:rgba(139,92,246,.4);color:rgba(196,181,253,.95)}
        .filters{padding:0 16px 16px;overflow-x:auto;scrollbar-width:none}
        .filters::-webkit-scrollbar{display:none}
        .filters-row{display:flex;gap:8px;white-space:nowrap}
        .f-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:999px;border:0.5px solid rgba(255,255,255,.08);background:rgba(255,255,255,.05);color:rgba(255,255,255,.35);font-size:11px;font-weight:500;cursor:pointer;transition:all .2s;font-family:inherit}
        .f-btn.active{background:rgba(139,92,246,.22);border-color:rgba(139,92,246,.45);color:rgba(196,181,253,.95)}
        .section-label{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.25);padding:0 16px 10px}
        .grid-wrap{padding:0 16px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .pl-card{border-radius:20px;padding:18px 16px 16px;cursor:pointer;border:0.5px solid rgba(255,255,255,.1);backdrop-filter:blur(12px);transition:transform .18s;-webkit-tap-highlight-color:transparent}
        .pl-card:active{transform:scale(.96)}
        .pl-emoji{font-size:28px;margin-bottom:10px;display:block}
        .pl-title{font-size:12px;font-weight:600;color:rgba(255,255,255,.95);line-height:1.3;margin-bottom:5px}
        .pl-desc{font-size:10px;color:rgba(255,255,255,.45);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:12px}
        .pl-hint{font-size:9px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:4px}
        .pl-hint-dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.2);flex-shrink:0}
        .empty{text-align:center;padding:60px 20px}
        .empty p:first-child{font-size:32px;margin-bottom:8px}
        .empty p:last-child{font-size:13px;color:rgba(255,255,255,.3)}
        .amb-wrap{padding:0 16px}
        .amb-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .amb-title{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.3)}
        .amb-sub{font-size:11px;color:rgba(255,255,255,.3);font-weight:300;margin-top:2px}
        .vol-wrap{display:flex;align-items:center;gap:8px}
        .vol-lbl{font-size:9px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.06em}
        input[type=range]{accent-color:#a78bfa;width:64px}
        .amb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .amb-btn{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;border:0.5px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);cursor:pointer;font-family:inherit;transition:all .3s;-webkit-tap-highlight-color:transparent}
        .amb-btn.on{border-color:rgba(139,92,246,.5);background:rgba(139,92,246,.12)}
        .amb-emoji{font-size:22px}
        .amb-lbl{font-size:10px;font-weight:500;color:rgba(255,255,255,.4);text-align:center}
        .amb-lbl.on{color:rgba(255,255,255,.9)}
        .bars{display:flex;gap:2px;align-items:flex-end;height:12px}
        .bar{width:3px;border-radius:2px;background:rgba(255,255,255,.6)}
        @keyframes bd{0%,100%{height:3px}50%{height:12px}}
        .bar.on{animation:bd .8s ease-in-out infinite}
        .amb-tip{text-align:center;margin-top:12px;font-size:10px;color:rgba(255,255,255,.2)}
        .nav{position:fixed;bottom:0;left:0;right:0;z-index:30;background:rgba(8,6,18,.9);border-top:0.5px solid rgba(255,255,255,.07);backdrop-filter:blur(20px);display:flex;justify-content:space-around;padding:10px 8px calc(12px + env(safe-area-inset-bottom,0px))}
        .nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;cursor:pointer;padding:4px 12px;border-radius:14px;transition:background .2s;font-family:inherit;-webkit-tap-highlight-color:transparent}
        .nav-btn.active{background:rgba(139,92,246,.12)}
        .nav-icon{font-size:18px}
        .nav-lbl{font-size:8px;text-transform:uppercase;letter-spacing:.08em}
      `}</style>

      <div className="mp">
        <div className="safe-top" />

        {/* Header */}
        <div className="hdr">
          <p className="hdr-lbl">Lumina Radio</p>
          <h1 className="hdr-title">Your Soundtrack</h1>
          <p className="hdr-sub">Music that meets you where you are.</p>
        </div>

        {/* SoundCloud Player Card */}
        <div className="sc-section">
          <div className="sc-header">
            <div className="sc-label">
              <div className="sc-icon">☁️</div>
              <div>
                <p className="sc-name">Lumina Radio</p>
                <p className="sc-sub">{showPlayer ? 'Playing from SoundCloud' : 'Tap to open player'}</p>
              </div>
            </div>
            <button className="sc-toggle" onClick={() => setShowPlayer(p => !p)}>
              {showPlayer ? '▲ Hide' : '▶ Play'}
            </button>
          </div>

          <div className="sc-player" style={{ height: showPlayer ? 166 : 0 }}>
            {showPlayer && (
              <iframe
                src={scEmbedUrl}
                height="166"
                allow="autoplay"
                title="Lumina Radio"
              />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[{id:'playlists',label:'🎵 Playlists'},{id:'ambient',label:'🔮 Ambiance'}].map(t => (
            <button key={t.id} className={`tab-btn${activeTab===t.id?' active':''}`} onClick={() => setActiveTab(t.id as any)}>
              {t.label}
            </button>
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

            <p className="section-label">Browse by vibe</p>

            <div className="grid-wrap">
              {filteredCards.length === 0 ? (
                <div className="empty"><p>🎵</p><p>No playlists for this mood yet.</p></div>
              ) : (
                <div className="grid">
                  {filteredCards.map(pl => (
                    <div
                      key={pl.id}
                      className="pl-card"
                      style={{ background: pl.gradient }}
                      onClick={() => { setShowPlayer(true); window.scrollTo({top: 0, behavior: 'smooth'}) }}
                    >
                      <span className="pl-emoji">{pl.emoji}</span>
                      <p className="pl-title">{pl.title}</p>
                      <p className="pl-desc">{pl.description}</p>
                      <div className="pl-hint">
                        <div className="pl-hint-dot" />
                        <span>Tap to open player</span>
                      </div>
                    </div>
                  ))}
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
              {AMBIENT_PRESETS.map(p => {
                const on = activeAmbient === p.id
                return (
                  <button key={p.id} className={`amb-btn${on?' on':''}`}
                    style={on ? {borderColor:p.color,background:p.color.replace('.5)','.15)')} : {}}
                    onClick={() => handleAmbient(p.id)}>
                    <span className="amb-emoji">{p.emoji}</span>
                    <span className={`amb-lbl${on?' on':''}`}>{p.label}</span>
                    {on && (
                      <div className="bars">
                        {[0,1,2].map(j => <div key={j} className="bar on" style={{animationDelay:`${j*.18}s`}} />)}
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

      {/* Bottom Nav */}
      <nav className="nav">
        {[
          {icon:'🏠', label:'Home',    href:'/'},
          {icon:'🎵', label:'Music',   href:'/music'},
          {icon:'✦',  label:'Lumina',  href:'/companion'},
          {icon:'📖', label:'Journal', href:'/journal'},
          {icon:'🤍', label:'You',     href:'/profile'},
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