import { useState, useEffect } from 'react'
import { outfits, getOutfitItems } from '../mockData'

interface Props {
  scene: string
  styles: string[]
  onBack: () => void
  onSaved: () => void
}

export default function AIResultPage({ scene, styles, onBack, onSaved }: Props) {
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(t)
  }, [])

  const outfit = outfits[0]
  const items = getOutfitItems(outfit).slice(0, 4)

  return (
    <div className="flex flex-col" style={{ minHeight: '100%', background: '#FFFFFF', paddingTop: 56 }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-5 pb-5">
        <button
          onClick={onBack}
          style={{ width: 36, height: 36, borderRadius: 12, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#282828' }}>AI 为你搭配</h2>
        <button
          onClick={() => setIsFav(v => !v)}
          style={{ width: 36, height: 36, borderRadius: 12, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#E05555' : 'none'} stroke={isFav ? '#E05555' : '#282828'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-5">
          <div style={{ position: 'relative', width: 80, height: 80 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 999,
              border: '3px solid #F0F0F0',
              borderTopColor: '#CBD77E',
              animation: 'spin 0.9s linear infinite',
            }} />
          </div>
          <div className="text-center">
            <p style={{ fontSize: 17, fontWeight: 500, color: '#282828', marginBottom: 6 }}>AI 正在为你搭配</p>
            <p style={{ fontSize: 13, color: '#8E8E93' }}>根据你的偏好和衣橱生成中…</p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div className="px-5 flex-1 overflow-y-auto scrollbar-hide pb-8 animate-scale-in">
          {/* Outfit image */}
          <div style={{ position: 'relative', height: 220, borderRadius: 24, overflow: 'hidden', background: '#F0F0F0', marginBottom: 16 }}>
            <img src={outfit.coverImage} alt="" className="w-full h-full object-cover" />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {[scene, ...styles.slice(0, 2)].map(tag => (
              <span
                key={tag}
                className="px-3"
                style={{ height: 26, borderRadius: 999, background: '#F7F7F7', display: 'inline-flex', alignItems: 'center', fontSize: 12, color: '#8E8E93' }}
              >
                {tag}
              </span>
            ))}
            <div
              className="flex items-center gap-1.5 px-2.5"
              style={{ height: 26, borderRadius: 999, background: 'rgba(203,215,126,0.2)', border: '1px solid rgba(203,215,126,0.4)' }}
            >
              <span style={{ width: 5, height: 5, borderRadius: 999, background: '#CBD77E', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 500, color: '#282828' }}>契合度 96%</span>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8E8E93' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B5943A" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              26℃
            </span>
          </div>

          {/* AI reason */}
          <p style={{ fontSize: 14, color: '#282828', lineHeight: '22px', marginBottom: 20 }}>
            今天温度适中，这套搭配既适合{scene}，也符合你的{styles[0] || '简约'}风格。整体造型干净舒适，非常适合今日的天气与场合。
          </p>

          {/* Items 2x2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {items.map(item => (
              <div
                key={item.id}
                style={{ position: 'relative', aspectRatio: '1', borderRadius: 16, background: '#FFFFFF', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', mixBlendMode: 'multiply', padding: 8 }} />
                <button
                  style={{
                    position: 'absolute', top: 8, left: 8, width: 24, height: 24, borderRadius: 999,
                    background: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#282828',
                  }}
                >×</button>
                <button
                  style={{
                    position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 999,
                    background: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                  }}
                >⇄</button>
              </div>
            ))}
          </div>

          {/* Save CTA */}
          <button
            onClick={() => { setSaved(true); window.setTimeout(onSaved, 180) }}
            className="w-full flex items-center justify-center"
            style={{
              height: 52,
              borderRadius: 999,
              background: saved ? '#CBD77E' : '#282828',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600,
              color: saved ? '#282828' : '#FFFFFF',
              fontFamily: 'inherit',
              transition: 'all 0.25s ease',
            }}
          >
            {saved ? '✓ 已保存到穿搭库' : '保存这套穿搭'}
          </button>
        </div>
      )}
    </div>
  )
}
