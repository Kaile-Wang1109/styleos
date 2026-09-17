import { useState } from 'react'
import { Outfit, ClothingItem, getOutfitItems } from '../mockData'

interface Props {
  outfit: Outfit
  onClose: () => void
  onItemTap: (item: ClothingItem) => void
  onWear: (outfit: Outfit) => boolean
}

export default function OutfitDetailSheet({ outfit, onClose, onItemTap, onWear }: Props) {
  const [isFav, setIsFav] = useState(outfit.favorite)
  const [items, setItems] = useState(getOutfitItems(outfit))

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <div className="absolute inset-0 z-30 flex flex-col animate-fade-in" style={{ borderRadius: 50, overflow: 'hidden' }}>
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
      />

      {/* Bottom sheet */}
      <div
        className="absolute bottom-0 inset-x-0 overflow-y-auto scrollbar-hide animate-slide-up"
        style={{
          borderRadius: '32px 32px 0 0',
          background: '#FFFFFF',
          maxHeight: 'calc(100% - 60px)',
          paddingBottom: 32,
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-4">
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(40,40,40,0.15)' }} />
        </div>

        {/* Outfit image */}
        <div style={{ position: 'relative', height: 240, background: '#F0F0F0', margin: '0 20px', borderRadius: 24, overflow: 'hidden' }}>
          <img src={outfit.coverImage} alt="" className="w-full h-full object-cover" />
          <button
            onClick={() => setIsFav(v => !v)}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 36,
              height: 36,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill={isFav ? '#E05555' : 'none'} stroke={isFav ? '#E05555' : '#282828'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 px-5 mt-4 flex-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5943A" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <span style={{ fontSize: 13, color: '#8E8E93' }}>{outfit.weatherTag}</span>
          {outfit.tags.map(tag => (
            <span
              key={tag}
              className="px-3"
              style={{ height: 26, borderRadius: 999, background: '#F7F7F7', display: 'inline-flex', alignItems: 'center', fontSize: 12, color: '#8E8E93' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* AI reason */}
        <div className="px-5 mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span style={{ fontSize: 13, fontWeight: 500, color: '#282828' }}>✦</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#282828' }}>AI 推荐理由</span>
          </div>
          <p style={{ fontSize: 14, color: '#282828', lineHeight: '22px' }}>{outfit.aiReason}</p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(40,40,40,0.06)', margin: '20px 20px' }} />

        {/* Item grid 2x2 */}
        <div className="px-5">
          <p style={{ fontSize: 13, fontWeight: 500, color: '#282828', marginBottom: 12 }}>单品组合</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {items.slice(0, 4).map(item => (
              <div
                key={item.id}
                onClick={() => onItemTap(item)}
                style={{ position: 'relative', aspectRatio: '1', borderRadius: 16, background: '#FFFFFF', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', mixBlendMode: 'multiply', padding: 8 }} />
                {/* Remove button */}
                <button
                  onClick={e => { e.stopPropagation(); removeItem(item.id) }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.85)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: '#282828',
                    fontWeight: 500,
                  }}
                >×</button>
                {/* Replace button */}
                <button
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.85)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                  }}
                >⇄</button>
                {/* Item name */}
                <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0', padding: '4px 6px' }}>
                  <p style={{ fontSize: 10, color: '#8E8E93', fontWeight: 500, lineHeight: 1.2, textAlign: 'center' }}>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 mt-6">
          <button
            onClick={() => onWear(outfit)}
            className="w-full flex items-center justify-center"
            style={{
              height: 52,
              borderRadius: 999,
              background: '#282828',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600,
              color: '#FFFFFF',
              fontFamily: 'inherit',
            }}
          >
            穿这套
          </button>
        </div>
      </div>
    </div>
  )
}
