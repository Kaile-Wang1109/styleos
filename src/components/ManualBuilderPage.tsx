import { useState } from 'react'
import { items, ClothingItem } from '../mockData'

const font = "'Sora', 'PingFang SC', system-ui"

interface Props {
  onBack: () => void
}

const categories = ['全部', '上衣', '外套', '下装', '鞋履', '配饰']

export default function ManualBuilderPage({ onBack }: Props) {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [selected, setSelected] = useState<ClothingItem[]>([])
  const [saved, setSaved] = useState(false)

  const displayItems = activeCategory === '全部' ? items : items.filter(i => i.type === activeCategory)

  const toggle = (item: ClothingItem) => {
    setSelected(prev =>
      prev.some(s => s.id === item.id)
        ? prev.filter(s => s.id !== item.id)
        : [...prev, item]
    )
  }

  const remove = (id: string) => setSelected(prev => prev.filter(s => s.id !== id))

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#FFFFFF', paddingTop: 56 }}>

      {/* ── Nav ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 16px' }}>
        <button
          onClick={onBack}
          style={{ width: 32, height: 32, borderRadius: 999, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#282828', fontFamily: font }}>自由搭配</span>
        <div style={{ width: 32 }} />
      </div>

      {/* ── Selected items strip ── */}
      <div style={{ padding: '0 20px 4px' }}>
        <p style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500, letterSpacing: '0.2px', fontFamily: font, marginBottom: 12 }}>
          已选单品 {selected.length > 0 ? `· ${selected.length} 件` : ''}
        </p>
      </div>

      <div
        style={{
          display: 'flex', gap: 10, overflowX: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 16,
          minHeight: 140, alignItems: 'flex-start', flexShrink: 0,
        }}
        className="scrollbar-hide"
      >
        {selected.length === 0 ? (
          <div style={{
            width: '100%', height: 120, borderRadius: 20, border: '1.5px dashed rgba(40,40,40,0.12)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(40,40,40,0.2)" strokeWidth="1.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span style={{ fontSize: 12, color: 'rgba(40,40,40,0.3)', fontFamily: font }}>从下方选择单品</span>
          </div>
        ) : (
          selected.map(item => (
            <div key={item.id} style={{ flexShrink: 0, width: 88, position: 'relative' }}>
              <div style={{
                width: 88, height: 88, borderRadius: 18, background: '#F7F7F7',
                border: '1px solid rgba(40,40,40,0.06)',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', padding: 8 }} />
              </div>
              {/* × remove */}
              <button
                onClick={() => remove(item.id)}
                style={{
                  position: 'absolute', top: -5, right: -5,
                  width: 20, height: 20, borderRadius: 999,
                  background: '#282828', border: '2px solid #FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <p style={{
                fontSize: 10, color: '#8E8E93', fontFamily: font, marginTop: 6, textAlign: 'center',
                lineHeight: '14px', overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {item.name}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'rgba(40,40,40,0.06)', margin: '0 0 0' }} />

      {/* ── Category filter ── */}
      <div style={{ padding: '14px 20px 10px', flexShrink: 0 }}>
        <p style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500, letterSpacing: '0.2px', fontFamily: font, marginBottom: 12 }}>选择单品</p>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }} className="scrollbar-hide">
          {categories.map(cat => {
            const active = cat === activeCategory
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0, padding: '0 16px 10px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? '#282828' : '#8E8E93', fontFamily: font,
                  borderBottom: active ? '2px solid #282828' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Item grid ── */}
      <div
        className="scrollbar-hide"
        style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 8px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {displayItems.map(item => {
            const isSelected = selected.some(s => s.id === item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggle(item)}
                style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  borderRadius: 16, background: '#F7F7F7',
                  border: isSelected ? '1.5px solid #282828' : '1.5px solid transparent',
                  position: 'relative', aspectRatio: '1', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color 0.15s',
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', padding: 8 }}
                  />
                  {/* Checkmark badge */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: 7, right: 7,
                      width: 20, height: 20, borderRadius: 999,
                      background: '#282828',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6.5L4.5 9L10 3.5" stroke="#CBD77E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <p style={{
                  fontSize: 11, color: isSelected ? '#282828' : '#8E8E93',
                  fontFamily: font, marginTop: 6, fontWeight: isSelected ? 500 : 400,
                  lineHeight: '15px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                }}>
                  {item.name}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div style={{ padding: '12px 20px 28px', background: '#FFFFFF', borderTop: '1px solid rgba(40,40,40,0.05)', flexShrink: 0 }}>
        <button
          onClick={() => {
            if (selected.length === 0) return
            setSaved(true)
            window.setTimeout(onBack, 180)
          }}
          style={{
            width: '100%', height: 52, borderRadius: 999, border: 'none', cursor: selected.length > 0 ? 'pointer' : 'default',
            background: selected.length > 0 ? (saved ? '#CBD77E' : '#282828') : '#EBEBEB',
            color: selected.length > 0 ? (saved ? '#2d3a0e' : '#FFFFFF') : '#B0B0B0',
            fontSize: 15, fontWeight: 600, fontFamily: font,
            transition: 'all 0.2s ease',
          }}
        >
          {saved ? '✓ 穿搭已保存' : selected.length > 0 ? `完成搭配 · ${selected.length} 件` : '请先选择单品'}
        </button>
      </div>
    </div>
  )
}
