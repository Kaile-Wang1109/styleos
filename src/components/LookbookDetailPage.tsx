import { useState } from 'react'
import { ClothingItem, Outfit, getOutfitItems } from '../mockData'
import OutfitComposition from './OutfitComposition'

const font = "'Sora', 'PingFang SC', system-ui"

interface Props {
  outfit: Outfit
  onBack: () => void
  onWear?: (outfit: Outfit) => boolean
  catalog: ClothingItem[]
  onSave: (outfit: Outfit, mode: 'replace' | 'copy') => void
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500, letterSpacing: '0.2px', marginBottom: 8, marginTop: 20, fontFamily: font }}>
      {children}
    </p>
  )
}

export default function LookbookDetailPage({ outfit, onBack, onWear, catalog, onSave }: Props) {
  const [isFav, setIsFav] = useState(outfit.favorite)
  const [worn, setWorn] = useState(false)
  const [editing, setEditing] = useState(false)
  const [selectedIds, setSelectedIds] = useState(outfit.itemIds)
  const [showSaveChoice, setShowSaveChoice] = useState(false)
  const draftOutfit = { ...outfit, itemIds: selectedIds }
  const items = getOutfitItems(draftOutfit, catalog)
  const toggleItem = (id: string) => setSelectedIds(current => current.includes(id) ? current.filter(itemId => itemId !== id) : [...current, id])

  return (
    <div style={{ minHeight: '100%', background: '#FFFFFF', paddingTop: 56, display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px' }}>
        <button
          onClick={onBack}
          style={{ width: 32, height: 32, borderRadius: 999, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#282828', fontFamily: font }}>穿搭详情</span>
        <button
          onClick={() => editing ? setEditing(false) : setEditing(true)}
          style={{ width: 32, height: 32, borderRadius: 999, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 12, color: '#282828' }}>{editing ? '取消' : '修改'}</span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>
        {/* Outfit image */}
        <OutfitComposition outfit={draftOutfit} catalog={catalog} style={{ width: '100%', borderRadius: 28, marginBottom: 4 }} />

        {editing && <>
          <SectionTitle>选择组成这套穿搭的单品</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9 }}>
            {catalog.map(item => {
              const selected = selectedIds.includes(item.id)
              return <button key={item.id} onClick={() => toggleItem(item.id)} style={{ aspectRatio: '1', borderRadius: 14, border: selected ? '2px solid #282828' : '1px solid #E6E6E6', background: '#F7F7F7', position: 'relative', padding: 5 }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                {selected && <span style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: '#282828', color: '#FFF', fontSize: 12, display: 'grid', placeItems: 'center' }}>✓</span>}
              </button>
            })}
          </div>
          <button disabled={selectedIds.length === 0} onClick={() => setShowSaveChoice(true)} style={{ width: '100%', height: 50, marginTop: 18, borderRadius: 999, border: 0, background: selectedIds.length ? '#282828' : '#DDD', color: '#FFF', fontSize: 15, fontWeight: 600 }}>完成修改</button>
        </>}

        {/* Tags */}
        <SectionTitle>标签</SectionTitle>
        <div style={{ background: '#F7F7F7', borderRadius: 14, padding: '13px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {outfit.tags.map(tag => (
            <span key={tag} style={{ height: 26, borderRadius: 999, background: '#FFFFFF', display: 'inline-flex', alignItems: 'center', padding: '0 10px', fontSize: 13, color: '#282828', fontFamily: font }}>
              {tag}
            </span>
          ))}
          <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 13, color: '#8E8E93', fontFamily: font }}>{outfit.season}</span>
        </div>

        {/* Stats */}
        <SectionTitle>穿着记录</SectionTitle>
        <div style={{ background: '#F7F7F7', borderRadius: 14, padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#8E8E93', fontFamily: font }}>累计穿着次数</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#282828', fontFamily: font }}>{outfit.wornCount} 次</span>
        </div>

        {/* AI reason */}
        <SectionTitle>AI 搭配理由</SectionTitle>
        <div style={{ background: '#F7F7F7', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#CBD77E', flexShrink: 0, marginTop: 1 }}>✦</span>
          <p style={{ fontSize: 13, color: '#282828', lineHeight: '20px', fontFamily: font }}>{outfit.aiReason}</p>
        </div>

        {/* Items */}
        <SectionTitle>单品详情</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {items.map(item => (
            <div key={item.id} style={{ borderRadius: 14, background: '#F7F7F7', overflow: 'hidden', aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', flex: 1, objectFit: 'contain', display: 'block', mixBlendMode: 'multiply' }} />
              <p style={{ fontSize: 11, color: '#8E8E93', fontWeight: 500, textAlign: 'center', padding: '6px 4px 2px', fontFamily: font, lineHeight: 1.3 }}>{item.name}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            const recorded = onWear?.(outfit) ?? false
            if (recorded) setWorn(true)
          }}
          style={{
            width: '100%', height: 52, borderRadius: 999,
            background: worn ? '#CBD77E' : '#282828',
            border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 600,
            color: worn ? '#282828' : '#FFFFFF',
            fontFamily: font,
            transition: 'all 0.25s ease',
            marginTop: 24,
          }}
        >
          {worn ? '✓ 今天就穿这套' : '今天穿这套'}
        </button>
      </div>
      {showSaveChoice && <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'rgba(0,0,0,.42)', display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(6px)' }}>
        <div style={{ width: '100%', borderRadius: '28px 28px 0 0', background: '#FFF', padding: '24px 20px 30px' }}>
          <h3 style={{ margin: 0, fontSize: 18, color: '#282828' }}>如何保存这次调整？</h3>
          <p style={{ margin: '8px 0 18px', fontSize: 13, lineHeight: '20px', color: '#8E8E93' }}>你可以更新当前穿搭，也可以保留原搭配并创建一套新的穿搭。</p>
          <button onClick={() => onSave(draftOutfit, 'replace')} style={{ width: '100%', height: 50, borderRadius: 999, border: 0, background: '#282828', color: '#FFF', fontWeight: 600, marginBottom: 10 }}>更新这套穿搭</button>
          <button onClick={() => onSave(draftOutfit, 'copy')} style={{ width: '100%', height: 50, borderRadius: 999, border: '1px solid #D8D8D8', background: '#FFF', color: '#282828', fontWeight: 600, marginBottom: 10 }}>另存为新穿搭</button>
          <button onClick={() => setShowSaveChoice(false)} style={{ width: '100%', height: 42, border: 0, background: 'transparent', color: '#8E8E93' }}>暂不保存</button>
        </div>
      </div>}
    </div>
  )
}
