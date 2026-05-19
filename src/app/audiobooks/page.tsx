'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ============================================================
// Audiobook data — YouTube IDs
// Each ytId should be a full audiobook or long reading on YouTube
// Replace ytId values with whatever audiobook videos you want
// ============================================================
const GENRE_FILTERS = [
  { id: 'all',       label: 'All',        emoji: '✦' },
  { id: 'fiction',   label: 'Fiction',    emoji: '🌌' },
  { id: 'selfhelp',  label: 'Self-Help',  emoji: '🌱' },
  { id: 'philosophy',label: 'Philosophy', emoji: '🔮' },
  { id: 'romance',   label: 'Romance',    emoji: '🌸' },
  { id: 'mystery',   label: 'Mystery',    emoji: '🌙' },
  { id: 'biography', label: 'Biography',  emoji: '🕊️' },
]

const AUDIOBOOKS = [
  {
    id: 'alchemist',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    duration: '4h 10m',
    emoji: '🌅',
    genre: 'fiction',
    desc: 'A journey of following your personal legend.',
    grad: 'linear-gradient(135deg,rgba(245,158,11,0.55) 0%,rgba(234,88,12,0.5) 100%)',
    ytId: 'H14bBuluwB8',
  },
  {
    id: 'littleprince',
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    duration: '1h 38m',
    emoji: '🌟',
    genre: 'fiction',
    desc: 'A timeless story about love, loss and what matters.',
    grad: 'linear-gradient(135deg,rgba(99,102,241,0.55) 0%,rgba(139,92,246,0.5) 100%)',
    ytId: 'IfNKMzFMkSA',
  },
  {
    id: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    duration: '4h 10m',
    emoji: '🔮',
    genre: 'philosophy',
    desc: 'Private notes of a Roman emperor on stoic philosophy.',
    grad: 'linear-gradient(135deg,rgba(79,70,229,0.6) 0%,rgba(30,27,75,0.75) 100%)',
    ytId: 'd5E2AQKuCyU',
  },
  {
    id: 'power-now',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    duration: '7h 37m',
    emoji: '🌿',
    genre: 'selfhelp',
    desc: 'A guide to spiritual enlightenment and presence.',
    grad: 'linear-gradient(135deg,rgba(34,197,94,0.5) 0%,rgba(6,182,212,0.45) 100%)',
    ytId: 'OFDtdHpYvhw',
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    duration: '5h 35m',
    emoji: '⚡',
    genre: 'selfhelp',
    desc: 'Tiny changes, remarkable results.',
    grad: 'linear-gradient(135deg,rgba(234,179,8,0.55) 0%,rgba(249,115,22,0.5) 100%)',
    ytId: 'PRl0oEeqiX4',
  },
  {
    id: 'pride-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    duration: '11h 35m',
    emoji: '🌸',
    genre: 'romance',
    desc: 'The timeless love story of Elizabeth Bennet.',
    grad: 'linear-gradient(135deg,rgba(236,72,153,0.5) 0%,rgba(196,181,253,0.5) 100%)',
    ytId: 'ym_ozKwDlUk',
  },
  {
    id: 'sherlock',
    title: 'Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    duration: '7h 4m',
    emoji: '🔍',
    genre: 'mystery',
    desc: 'The complete adventures of the world\'s greatest detective.',
    grad: 'linear-gradient(135deg,rgba(55,65,81,0.7) 0%,rgba(17,24,39,0.8) 100%)',
    ytId: 'Xe3OW1AAAU8',
  },
  {
    id: 'sapiens',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    duration: '15h 17m',
    emoji: '🌍',
    genre: 'biography',
    desc: 'A brief history of humankind.',
    grad: 'linear-gradient(135deg,rgba(14,165,233,0.5) 0%,rgba(99,102,241,0.5) 100%)',
    ytId: 'krizTCUVFhQ',
  },
]

export default function AudiobooksPage() {
  const router = useRouter()
  const [genre, setGenre] = useState('all')
  const [activeBook, setActiveBook] = useState<string | null>(null)
  const [volume, setVolume] = useState(0.8)
  const [isPlaying, setIsPlaying] = useState(false)
  const ytRefs = useRef<Record<string, HTMLIFrameElement | null>>({})

  const filtered = genre === 'all' ? AUDIOBOOKS : AUDIOBOOKS.filter(b => b.genre === genre)

  const postToYT = (id: string, cmd: object) => {
    const iframe = ytRefs.current[id]
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify(cmd), '*')
    }
  }

  const handlePlay = useCallback((id: string) => {
    if (activeBook === id) {
      // Toggle play/pause
      if (isPlaying) {
        postToYT(id, { event: 'command', func: 'pauseVideo', args: [] })
        setIsPlaying(false)
      } else {
        postToYT(id, { event: 'command', func: 'playVideo', args: [] })
        setIsPlaying(true)
      }
      return
    }
    // Stop previous
    if (activeBook) {
      postToYT(activeBook, { event: 'command', func: 'pauseVideo', args: [] })
    }
    setActiveBook(id)
    setIsPlaying(true)
    setTimeout(() => {
      postToYT(id, { event: 'command', func: 'playVideo', args: [] })
      postToYT(id, { event: 'command', func: 'setVolume', args: [Math.round(volume * 100)] })
    }, 300)
  }, [activeBook, isPlaying, volume])

  const handleVolume = useCallback((v: number) => {
    setVolume(v)
    if (activeBook) {
      postToYT(activeBook, { event: 'command', func: 'setVolume', args: [Math.round(v * 100)] })
    }
  }, [activeBook])

  const activeBookData = AUDIOBOOKS.find(b => b.id === activeBook)

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#080612;color:rgba(255,255,255,.92);font-family:'DM Sans',system-ui,sans-serif;min-height:100vh}
        .pg{padding:0 0 100px;max-width:500px;margin:0 auto;position:relative}

        /* Header */
        .hdr{padding:56px 20px 24px}
        .hdr-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:rgba(167,139,250,.6);margin-bottom:8px}
        .hdr-h1{font-size:26px;font-weight:700;letter-spacing:-.02em;line-height:1.2;margin-bottom:6px;background:linear-gradient(135deg,#fff 0%,#a78bfa 60%,#f9a8d4 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hdr-sub{font-size:13px;color:rgba(255,255,255,.35);font-weight:300}

        /* Now playing bar */
        .now-bar{margin:0 16px 20px;padding:14px 16px;border-radius:18px;background:rgba(139,92,246,.12);border:.5px solid rgba(139,92,246,.3);display:flex;align-items:center;gap:12px}
        .now-ico{font-size:24px;flex-shrink:0}
        .now-info{flex:1;min-width:0}
        .now-title{font-size:13px;font-weight:600;color:rgba(255,255,255,.95);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .now-author{font-size:11px;color:rgba(255,255,255,.4);margin-top:2px}
        .now-ctrl{display:flex;align-items:center;gap:8px}
        .now-btn{background:none;border:none;cursor:pointer;font-size:18px;color:rgba(255,255,255,.7);padding:4px;transition:color .2s;-webkit-tap-highlight-color:transparent}
        .now-btn:hover{color:#fff}
        .now-play{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#ec4899);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;transition:opacity .2s;-webkit-tap-highlight-color:transparent}
        .now-play:active{opacity:.8}

        /* Volume */
        .vol-row{display:flex;align-items:center;gap:8px;padding:0 16px;margin-bottom:20px}
        .vol-lbl{font-size:11px;color:rgba(255,255,255,.25)}
        input[type=range]{flex:1;accent-color:#8b5cf6;height:3px;cursor:pointer}

        /* Genre filters */
        .filters{padding:0 16px;margin-bottom:16px;overflow-x:auto;scrollbar-width:none}
        .filters::-webkit-scrollbar{display:none}
        .f-row{display:flex;gap:8px;width:max-content;padding-bottom:4px}
        .f-btn{display:flex;align-items:center;gap:5px;padding:7px 13px;border-radius:20px;border:.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:rgba(255,255,255,.5);font-size:12px;font-weight:500;cursor:pointer;white-space:nowrap;transition:all .2s;font-family:inherit;-webkit-tap-highlight-color:transparent}
        .f-btn.on{background:rgba(139,92,246,.2);border-color:rgba(139,92,246,.5);color:rgba(255,255,255,.95)}

        /* Section label */
        .s-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.25);padding:0 20px;margin-bottom:12px}

        /* Book grid */
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px}

        /* Book card */
        .bk{border-radius:20px;padding:18px 14px 14px;cursor:pointer;position:relative;transition:transform .2s,box-shadow .2s;-webkit-tap-highlight-color:transparent;border:.5px solid rgba(255,255,255,.08)}
        .bk:active{transform:scale(.97)}
        .bk.on{box-shadow:0 0 0 1.5px rgba(167,139,250,.6),0 8px 32px rgba(139,92,246,.25)}
        .bk-ico{font-size:28px;margin-bottom:10px;display:block}
        .bk-title{font-size:12px;font-weight:600;color:rgba(255,255,255,.95);line-height:1.3;margin-bottom:3px}
        .bk-author{font-size:10px;color:rgba(255,255,255,.45);margin-bottom:6px}
        .bk-desc{font-size:10px;color:rgba(255,255,255,.35);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px}
        .bk-foot{display:flex;align-items:center;justify-content:space-between}
        .bk-dur{font-size:9px;color:rgba(255,255,255,.4);display:flex;align-items:center;gap:4px}
        .bk-play{width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.12);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;transition:background .2s;-webkit-tap-highlight-color:transparent}
        .bk.on .bk-play{background:rgba(139,92,246,.5)}
        .badge{position:absolute;top:10px;right:10px;background:rgba(139,92,246,.3);border:.5px solid rgba(167,139,250,.5);border-radius:6px;padding:2px 7px;font-size:8px;text-transform:uppercase;letter-spacing:.08em;color:rgba(196,181,253,.9)}

        /* Bars animation */
        .bars{display:flex;gap:2px;align-items:flex-end;height:10px}
        .bar{width:2px;border-radius:2px;background:rgba(196,181,253,.8)}
        @keyframes bd{0%,100%{height:2px}50%{height:10px}}
        .bar.on{animation:bd .8s ease-in-out infinite}

        /* Nav */
        .nav{position:fixed;bottom:0;left:0;right:0;z-index:30;background:rgba(8,6,18,.9);border-top:.5px solid rgba(255,255,255,.07);backdrop-filter:blur(20px);display:flex;justify-content:space-around;padding:10px 8px calc(12px + env(safe-area-inset-bottom,0px))}
        .nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;cursor:pointer;padding:4px 12px;border-radius:14px;transition:background .2s;font-family:inherit;-webkit-tap-highlight-color:transparent}
        .nav-btn.on{background:rgba(139,92,246,.12)}
        .nav-ico{font-size:18px}
        .nav-lbl{font-size:8px;text-transform:uppercase;letter-spacing:.08em}
      `}</style>

      {/* Hidden YouTube iframes — one per book, loaded once */}
      <div style={{position:'absolute',width:0,height:0,overflow:'hidden',pointerEvents:'none',opacity:0}}>
        {AUDIOBOOKS.map(b => (
          <iframe
            key={b.id}
            ref={el => { ytRefs.current[b.id] = el }}
            src={`https://www.youtube.com/embed/${b.ytId}?enablejsapi=1&loop=1&playlist=${b.ytId}&autoplay=0&controls=0&mute=0`}
            allow="autoplay"
            title={b.title}
          />
        ))}
      </div>

      <div className="pg">

        <div className="hdr">
          <p className="hdr-lbl">Lumina Library</p>
          <h1 className="hdr-h1">Audiobooks 🎧</h1>
          <p className="hdr-sub">Listen wherever you are. Just tap and go.</p>
        </div>

        {/* Now playing bar */}
        {activeBook && activeBookData && (
          <div className="now-bar">
            <span className="now-ico">{activeBookData.emoji}</span>
            <div className="now-info">
              <p className="now-title">{activeBookData.title}</p>
              <p className="now-author">{activeBookData.author}</p>
            </div>
            <div className="now-ctrl">
              {isPlaying && (
                <div className="bars">
                  {[0,1,2].map(j => <div key={j} className="bar on" style={{animationDelay:`${j*.18}s`}}/>)}
                </div>
              )}
              <button className="now-play" onClick={() => handlePlay(activeBook)}>
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        )}

        {/* Volume */}
        {activeBook && (
          <div className="vol-row">
            <span className="vol-lbl">🔉</span>
            <input type="range" min={0} max={1} step={0.02} value={volume}
              onChange={e => handleVolume(parseFloat(e.target.value))} />
            <span className="vol-lbl">🔊</span>
          </div>
        )}

        {/* Genre filters */}
        <div className="filters">
          <div className="f-row">
            {GENRE_FILTERS.map(f => (
              <button key={f.id} className={`f-btn${genre === f.id ? ' on' : ''}`}
                onClick={() => setGenre(f.id)}>
                <span>{f.emoji}</span><span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="s-lbl">{filtered.length} book{filtered.length !== 1 ? 's' : ''} · tap to listen</p>

        <div className="grid">
          {filtered.map(b => {
            const on = activeBook === b.id
            return (
              <div key={b.id} className={`bk${on ? ' on' : ''}`}
                style={{background: b.grad}}
                onClick={() => handlePlay(b.id)}>
                {on && <div className="badge">{isPlaying ? 'Playing' : 'Paused'}</div>}
                <span className="bk-ico">{b.emoji}</span>
                <p className="bk-title">{b.title}</p>
                <p className="bk-author">{b.author}</p>
                <p className="bk-desc">{b.desc}</p>
                <div className="bk-foot">
                  <span className="bk-dur">🎧 {b.duration}</span>
                  <button className="bk-play" onClick={e => { e.stopPropagation(); handlePlay(b.id) }}>
                    {on && isPlaying ? '⏸' : '▶'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      <nav className="nav">
        {[
          {icon:'🏠', label:'Home',       href:'/home'},
          {icon:'🎵', label:'Music',      href:'/music'},
          {icon:'✦',  label:'Lumina',     href:'/lumina'},
          {icon:'📚', label:'Library',    href:'/library'},
          {icon:'🎧', label:'Audio',      href:'/audiobooks'},
          {icon:'📖', label:'Journal',    href:'/journal'},
        ].map(t => (
          <button key={t.href} className={`nav-btn${t.href === '/audiobooks' ? ' on' : ''}`}
            onClick={() => router.push(t.href as any)}>
            <span className="nav-ico">{t.icon}</span>
            <span className="nav-lbl" style={{color: t.href === '/audiobooks' ? 'rgba(196,181,253,.8)' : 'rgba(255,255,255,.3)'}}>
              {t.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  )
}
