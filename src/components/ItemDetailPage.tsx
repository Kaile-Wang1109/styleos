import { useState } from 'react'
import { ClothingItem } from '../mockData'

const COLOR_HEX: Record<string, string> = {
  '白色': '#F2F2F2', '黑色': '#1C1C1C', '灰色': '#909090', '深蓝': '#1A2F5E',
  '蓝色': '#3A6EA8', '卡其': '#B5A07A', '米色': '#E8DCC8', '藏青': '#1A3050',
  '米白': '#F0EAD6', '棕色': '#8B6040', '绿色': '#4A7A50', '红色': '#C04040',
  '粉色': '#E8A0A0', '橄榄': '#6B7A3A', '驼色': '#C8A060',
  '浅蓝': '#7898BF', '靛蓝': '#395A88', '银色': '#B8BBC1',
}

const font = "'Sora', 'PingFang SC', system-ui"

interface Props {
  item: ClothingItem
  onBack: () => void
  onSave: (item: ClothingItem) => void
}

const OPTIONS = {
  type: ['上衣', '外套', '下装', '连衣裙', '鞋履', '包袋', '配饰'],
  subtype: ['T恤', '衬衫', '针织衫', '夹克', '风衣', '牛仔裤', '休闲裤', '半身裙', '运动鞋'],
  styles: ['简约', '休闲', '通勤', '复古', '街头', '运动', '优雅', '甜美'],
  colors: ['黑色', '白色', '灰色', '浅蓝', '靛蓝', '藏青', '米色', '卡其', '棕色', '绿色', '红色', '粉色'],
  material: ['棉', '棉质牛仔布', '皮革', '羊毛', '针织', '亚麻', '涤纶', '丝绸'],
  seasons: ['春', '夏', '秋', '冬', '四季'],
}

function TagField({ label, values, options, max, single, color, onChange }: { label: string; values: string[]; options: string[]; max?: number; single?: boolean; color?: boolean; onChange: (values: string[]) => void }) {
  const [custom, setCustom] = useState('')
  const toggle = (value: string) => {
    if (values.includes(value)) return onChange(values.filter(item => item !== value))
    if (single) return onChange([value])
    if (max && values.length >= max) return
    onChange([...values, value])
  }
  const add = () => {
    const value = custom.trim()
    if (!value || values.includes(value) || (max && values.length >= max)) return
    onChange(single ? [value] : [...values, value])
    setCustom('')
  }
  return <div style={{ display: 'grid', gap: 8 }}>
    <span style={{ fontSize: 12, color: '#8E8E93' }}>{label}{max ? `（最多${max}个）` : ''}</span>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
      {[...new Set([...options, ...values])].map(option => {
        const active = values.includes(option)
        return <button key={option} type="button" onClick={() => toggle(option)} style={{ height: 32, padding: '0 12px', borderRadius: 999, border: active ? '1px solid #282828' : '1px solid #E3E3E3', background: active ? '#282828' : '#FFF', color: active ? '#FFF' : '#4A4A4A', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          {color && <span style={{ width: 13, height: 13, borderRadius: '50%', background: COLOR_HEX[option] ?? option, border: '1px solid rgba(0,0,0,.12)' }} />}{option}
        </button>
      })}
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      <input value={custom} onChange={event => setCustom(event.target.value)} onKeyDown={event => event.key === 'Enter' && add()} placeholder={color ? '输入颜色名或 #色值' : `新增${label}`} style={{ flex: 1, height: 38, border: '1px solid #E6E6E6', borderRadius: 12, padding: '0 11px', fontSize: 12, outline: 'none' }} />
      <button type="button" onClick={add} style={{ width: 64, border: 0, borderRadius: 12, background: '#E9EDC5', color: '#344014', fontSize: 12, fontWeight: 600 }}>新增</button>
    </div>
  </div>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500, letterSpacing: '0.2px', marginBottom: 8, marginTop: 20, fontFamily: font }}>
      {children}
    </p>
  )
}

export default function ItemDetailPage({ item, onBack, onSave }: Props) {
  const [isFav, setIsFav] = useState(item.favorite)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item)

  const infoRows = [
    { label: '类型', values: [draft.type, draft.subtype] },
    { label: '风格', values: draft.styles },
    { label: '颜色', values: draft.colors.slice(0, 2) },
    { label: '材质', values: [draft.material] },
    { label: '季节', values: draft.seasons },
  ]

  const commit = () => {
    const updated = { ...draft, colors: draft.colors.filter(Boolean).slice(0, 2), favorite: isFav }
    setDraft(updated)
    onSave(updated)
    setEditing(false)
  }

  return (
    <div style={{ minHeight: '100%', background: '#FFFFFF', paddingTop: 56, display: 'flex', flexDirection: 'column' }}>
      {/* Nav bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px' }}>
        <button
          onClick={onBack}
          style={{ width: 32, height: 32, borderRadius: 999, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#282828', fontFamily: font }}>{draft.name}</span>
        <button
          onClick={() => setIsFav(v => !v)}
          style={{ width: 32, height: 32, borderRadius: 999, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? '#E05555' : 'none'} stroke={isFav ? '#E05555' : '#282828'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, padding: '0 20px' }}>
        {/* Image */}
        <div style={{ borderRadius: 28, background: '#F7F7F7', height: 260, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
          <img
            src={item.image}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', mixBlendMode: 'multiply', padding: 20 }}
          />
        </div>

        {/* Wear reminder */}
        {item.lastWornDays > 14 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, borderRadius: 999, background: 'rgba(230,202,154,0.2)', border: '1px solid rgba(230,202,154,0.4)', padding: '0 16px', marginTop: 12 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B5943A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>
            <span style={{ fontSize: 13, color: '#282828', fontFamily: font }}>已经 {item.lastWornDays} 天没有穿过了，用它搭一套吧</span>
          </div>
        )}

        {/* Info table */}
        <SectionTitle>单品信息</SectionTitle>
        {editing && (
          <div style={{ background: '#F7F7F7', borderRadius: 16, padding: 14, display: 'grid', gap: 16 }}>
            <label style={{ display: 'grid', gap: 6, fontSize: 12, color: '#8E8E93' }}>名称<input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} style={{ height: 42, border: 0, borderRadius: 12, background: '#fff', padding: '0 12px', fontSize: 14, color: '#282828', outline: 'none' }} /></label>
            <TagField label="类型" values={[draft.type]} options={OPTIONS.type} single onChange={values => setDraft({ ...draft, type: values[0] ?? '' })} />
            <TagField label="子类" values={[draft.subtype]} options={OPTIONS.subtype} single onChange={values => setDraft({ ...draft, subtype: values[0] ?? '' })} />
            <TagField label="风格" values={draft.styles} options={OPTIONS.styles} onChange={values => setDraft({ ...draft, styles: values })} />
            <TagField label="主题色" values={draft.colors.slice(0, 2)} options={OPTIONS.colors} max={2} color onChange={values => setDraft({ ...draft, colors: values })} />
            <TagField label="材质" values={[draft.material]} options={OPTIONS.material} single onChange={values => setDraft({ ...draft, material: values[0] ?? '' })} />
            <TagField label="季节" values={draft.seasons} options={OPTIONS.seasons} onChange={values => setDraft({ ...draft, seasons: values })} />
          </div>
        )}
        {!editing && (
        <div style={{ background: '#F7F7F7', borderRadius: 14, overflow: 'hidden' }}>
          {infoRows.map((row, i) => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderTop: i > 0 ? '1px solid rgba(40,40,40,0.06)' : 'none' }}>
              <span style={{ fontSize: 13, color: '#8E8E93', width: 36, flexShrink: 0, fontFamily: font }}>{row.label}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1 }}>
                {row.label === '颜色' ? row.values.map(v => (
                  <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: COLOR_HEX[v] ?? '#E0E0E0', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.1)', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#282828', fontFamily: font }}>{v}</span>
                  </div>
                )) : row.values.map(v => (
                  <span key={v} style={{ height: 26, borderRadius: 999, background: '#FFFFFF', display: 'inline-flex', alignItems: 'center', padding: '0 10px', fontSize: 13, color: '#282828', fontFamily: font }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        )}
        <button onClick={() => editing ? commit() : setEditing(true)} style={{ width: '100%', height: 52, margin: '18px 0 32px', borderRadius: 999, border: 'none', background: '#282828', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {editing ? '保存修改' : '修改单品'}
        </button>
      </div>
    </div>
  )
}
