import { useState, useRef } from 'react'
import type { ProcessedGarment } from '../services/garments'

const CATEGORIES = ['上衣', '裤子', '裙子', '外套', '鞋子', '包袋', '配饰']
const SEASONS = ['春', '夏', '秋', '冬', '四季']

const PRESET_STYLES = ['简约', '休闲', '街头', '复古', '运动', '优雅', '商务', '户外', '度假', 'Y2K', '法式', '极简']

// Simulated AI-generated names per index
const AI_NAMES = [
  '卡其工装衬衫外套',
  '珍珠扣针织开衫',
  '直筒牛仔长裤',
  '羽绒夹克外套',
  '宽松棉质T恤',
  '工装休闲长裤',
  '毛呢格纹大衣',
  '丝绒吊带连衣裙',
]

// Simulated AI-extracted color palettes
const AI_COLOR_SETS = [
  ['#C4B9A8', '#8B7D6B', '#5C4F3D'],
  ['#ECC5C0', '#D49898', '#C07878'],
  ['#2B3F6E', '#4A6090', '#8090B4'],
  ['#1C1C1C', '#3A3A3A', '#787878'],
  ['#F0F0F0', '#D8D8D8', '#B0B0B0'],
  ['#4A5240', '#6B7A5C', '#3A4230'],
  ['#C8A878', '#A08858', '#786440'],
  ['#6B4E7A', '#9870A8', '#C4A0D0'],
]

const DEFAULT_CATEGORIES = ['外套', '上衣', '裤子', '外套', '上衣', '裤子', '外套', '裙子']

export interface ReviewedGarment {
  photoUrl: string
  name: string
  category: string
  subcategory: string
  colors: string[]
  material: string
  season: string
  styles: string[]
}

interface Props {
  garments: ProcessedGarment[]
  onBack: () => void
  onComplete: (items: ReviewedGarment[]) => void
}

export default function ItemReviewPage({ garments, onBack, onComplete }: Props) {
  const [edits, setEdits] = useState<ReviewedGarment[]>(() =>
    garments.map((garment, i) => ({
      photoUrl: garment.processedImageUrl,
      name: garment.suggestions.name || AI_NAMES[i % AI_NAMES.length],
      category: garment.suggestions.category || DEFAULT_CATEGORIES[i % DEFAULT_CATEGORIES.length],
      subcategory: garment.suggestions.subcategory || garment.suggestions.category || '待确认',
      colors: garment.suggestions.colorHexes?.length ? garment.suggestions.colorHexes.slice(0, 2) : AI_COLOR_SETS[i % AI_COLOR_SETS.length].slice(0, 2),
      material: garment.suggestions.material || '待确认',
      season: garment.suggestions.seasons?.[0] || '四季',
      styles: garment.suggestions.styles || [],
    }))
  )
  const [index, setIndex] = useState(0)
  const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null)
  const [allStyles, setAllStyles] = useState([...PRESET_STYLES])
  const [showAddStyle, setShowAddStyle] = useState(false)
  const [newStyle, setNewStyle] = useState('')
  const styleInputRef = useRef<HTMLInputElement>(null)
  const touchStartX = useRef<number | null>(null)

  const total = garments.length
  const item = edits[index]
  const isLast = index === total - 1

  const update = <K extends keyof ReviewedGarment>(field: K, value: ReviewedGarment[K]) => {
    setEdits(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const toggleStyle = (s: string) => {
    const cur = item.styles
    update('styles', cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s])
  }

  const confirmAddStyle = () => {
    const tag = newStyle.trim()
    if (tag && !allStyles.includes(tag)) {
      setAllStyles(prev => [...prev, tag])
      update('styles', [...item.styles, tag])
    } else if (tag && !item.styles.includes(tag)) {
      update('styles', [...item.styles, tag])
    }
    setNewStyle('')
    setShowAddStyle(false)
  }

  const navigate = (dir: 'left' | 'right') => {
    const next = dir === 'left' ? index + 1 : index - 1
    if (next < 0 || next >= total) return
    setAnimDir(dir)
    setTimeout(() => { setIndex(next); setAnimDir(null) }, 180)
  }

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (dx < -50) navigate('left')
    else if (dx > 50) navigate('right')
  }

  const pct = ((index + 1) / total) * 100

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#F7F7F7', borderRadius: 50 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div style={{ height: 3, background: '#E0E0E0', flexShrink: 0, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#282828', transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between px-5 flex-shrink-0" style={{ paddingTop: 52, paddingBottom: 6 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, marginLeft: -6 }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="#282828" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p style={{ fontSize: 15, fontWeight: 500, color: '#282828' }}>{index + 1} / {total}</p>
        <div style={{ width: 22 }} />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 110 }}>

        {/* Image — no card bg, floats on page color */}
        <div
          style={{
            margin: '4px 20px 0',
            height: 248,
            borderRadius: 28,
            background: '#F7F7F7',
            boxShadow: '0 1px 0 0 rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: animDir ? 0 : 1,
            transform: animDir === 'left' ? 'translateX(-18px)' : animDir === 'right' ? 'translateX(18px)' : 'none',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
          }}
        >
          <img
            src={item.photoUrl}
            alt={item.name}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', padding: 24, mixBlendMode: 'multiply' }}
          />
          {/* Dot nav */}
          {total > 1 && (
            <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{ width: i === index ? 14 : 5, height: 5, borderRadius: 999, background: i === index ? '#282828' : '#C8C8C8', transition: 'all 0.2s' }} />
              ))}
            </div>
          )}
        </div>

        {/* Fields */}
        <div style={{ padding: '16px 20px 0' }}>

          {/* Name — AI pre-filled, editable */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
              <label style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500 }}>名称</label>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#ABABAB', fontWeight: 500 }}>
                <SparkleSmall />AI 生成
              </span>
            </div>
            <input
              type="text"
              value={item.name}
              onChange={e => update('name', e.target.value)}
              style={{
                width: '100%',
                height: 46,
                borderRadius: 14,
                background: '#fff',
                border: 'none',
                padding: '0 15px',
                fontSize: 15,
                color: '#282828',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                fontWeight: 500,
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500, display: 'block', marginBottom: 8 }}>分类</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => update('category', cat)}
                  style={{
                    height: 32, padding: '0 13px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                    background: item.category === cat ? '#282828' : '#fff',
                    color: item.category === cat ? '#fff' : '#282828',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Colors — extracted swatches */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500 }}>主色</label>
              <span style={{ fontSize: 11, color: '#ABABAB', fontWeight: 500 }}>AI 提取</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {item.colors.map((hex, ci) => (
                <div key={ci} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: hex,
                      boxShadow: '0 0 0 2px #F7F7F7, 0 0 0 3px rgba(0,0,0,0.1)',
                      cursor: 'default',
                    }}
                  />
                  <span style={{ fontSize: 10, color: '#ABABAB', fontFamily: 'monospace', letterSpacing: '0.3px' }}>
                    {hex.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Season */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500, display: 'block', marginBottom: 8 }}>季节</label>
            <div style={{ display: 'flex', gap: 7 }}>
              {SEASONS.map(s => (
                <button
                  key={s}
                  onClick={() => update('season', s)}
                  style={{
                    height: 32, padding: '0 13px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                    background: item.season === s ? '#282828' : '#fff',
                    color: item.season === s ? '#fff' : '#282828',
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Style tags */}
          <div>
            <label style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500, display: 'block', marginBottom: 8 }}>风格标签</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {allStyles.map(s => (
                <button
                  key={s}
                  onClick={() => toggleStyle(s)}
                  style={{
                    height: 32, padding: '0 13px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                    background: item.styles.includes(s) ? '#282828' : '#fff',
                    color: item.styles.includes(s) ? '#fff' : '#282828',
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}

              {/* Add custom style */}
              {showAddStyle ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    ref={styleInputRef}
                    autoFocus
                    type="text"
                    value={newStyle}
                    onChange={e => setNewStyle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') confirmAddStyle(); if (e.key === 'Escape') { setShowAddStyle(false); setNewStyle('') } }}
                    placeholder="输入标签"
                    style={{
                      height: 32, width: 90, borderRadius: 999, border: '1.5px solid #282828',
                      padding: '0 10px', fontSize: 13, color: '#282828', outline: 'none',
                      fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={confirmAddStyle}
                    style={{
                      height: 32, padding: '0 10px', borderRadius: 999, border: 'none',
                      background: '#282828', color: '#fff', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    确认
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowAddStyle(true); setTimeout(() => styleInputRef.current?.focus(), 50) }}
                  style={{
                    height: 32, padding: '0 11px', borderRadius: 999,
                    border: '1.5px dashed #CCCCCC', background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#ABABAB', fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: 16, lineHeight: 1, marginTop: -1 }}>+</span>
                  自定义
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: 'absolute', bottom: 0, insetInline: 0,
          padding: '10px 20px 36px',
          background: 'linear-gradient(to top, #F7F7F7 75%, transparent)',
          display: 'flex', gap: 10,
        }}
      >
        {index > 0 && (
          <button
            onClick={() => navigate('right')}
            style={{
              width: 52, height: 54, borderRadius: 16, background: '#fff', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9L9 17" stroke="#282828" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <button
          onClick={() => isLast ? onComplete(edits) : navigate('left')}
          style={{
            flex: 1, height: 54, borderRadius: 16, background: '#282828', border: 'none',
            cursor: 'pointer', fontSize: 17, fontWeight: 600, color: '#fff',
            fontFamily: 'inherit', letterSpacing: '-0.2px',
          }}
        >
          {isLast ? '完成导入' : '保存并继续'}
        </button>
      </div>
    </div>
  )
}

function SparkleSmall() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L13.5 9L20 10.5L13.5 12L12 19L10.5 12L4 10.5L10.5 9L12 2Z" />
    </svg>
  )
}
