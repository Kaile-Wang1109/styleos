import { useState } from 'react'
import { Outfit, CalendarRecord } from '../mockData'
import OutfitCalendar from '../components/OutfitCalendar'
import OutfitComposition from '../components/OutfitComposition'

interface Props {
  onOutfitTap: (outfit: Outfit) => void
  calendarRecords: CalendarRecord[]
  isEmpty: boolean
  onCreate: () => void
  outfits: Outfit[]
}

const tabs = ['全部穿搭', '收藏', '日历']
export default function LookbookPage({ onOutfitTap, calendarRecords, isEmpty, onCreate, outfits }: Props) {
  const allTags = [...new Set(outfits.flatMap(o => o.tags))]
  const [activeTab, setActiveTab] = useState(0)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(outfits.filter(o => o.favorite).map(o => o.id)))
  const [showFilter, setShowFilter] = useState(false)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const hasActiveFilters = filterTags.length > 0

  const baseList = activeTab === 1 ? outfits.filter(o => favorites.has(o.id)) : outfits
  const displayed = baseList
    .filter(o => !search || o.tags.some(t => t.includes(search)))
    .filter(o => !hasActiveFilters || filterTags.some(t => o.tags.includes(t)))
  const isCalendar = activeTab === 2
  const isGrid = !isCalendar

  const toggleTag = (t: string) =>
    setFilterTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  if (isEmpty) return (
    <div className="tab-page empty-page">
      <div className="app-page-title"><h1>穿搭</h1></div>
      <div className="empty-state">
        <div className="empty-state-icon">✦</div>
        <h2>还没有穿搭</h2>
        <p>先录入衣物，再让 AI 根据天气、场景和个人偏好生成第一套穿搭。</p>
        <button onClick={onCreate}>开始建立衣橱</button>
      </div>
    </div>
  )

  return (
    <div className="tab-page" style={{ paddingTop: 0, background: '#F7F7F7', minHeight: '100%' }}>
      {/* Nav title bar */}
      <div className="app-page-title">
        <h1 style={{ fontSize: 17, fontWeight: 600, color: '#282828', letterSpacing: '-0.1px', margin: 0, padding: 0 }}>穿搭</h1>
      </div>

      <div className="px-5">
        {/* Tab switcher */}
        <div className="flex gap-6 mb-5">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className="relative pb-2"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 0 9px' }}
            >
              <span style={{ fontSize: 17, fontWeight: i === activeTab ? 600 : 400, color: i === activeTab ? '#282828' : '#8E8E93' }}>
                {tab}
              </span>
              {i === activeTab && (
                <div style={{ position: 'absolute', bottom: 2, left: '50%', width: 20, height: 2, background: '#7E8B31', borderRadius: 999, transform: 'translateX(-50%)' }} />
              )}
            </button>
          ))}
        </div>

        {/* Search row — only for grid tabs */}
        {isGrid && (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 px-3" style={{ height: 36, borderRadius: 12, background: '#FFFFFF', border: '1px solid rgba(40,40,40,.07)', boxShadow: '0 2px 10px rgba(40,40,40,.025)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索穿搭"
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#282828', fontFamily: 'inherit' }}
              />
            </div>
            <button
              onClick={() => setShowFilter(true)}
              style={{
                width: 36, height: 36, borderRadius: 12,
                background: hasActiveFilters ? '#282828' : '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(40,40,40,.07)', cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={hasActiveFilters ? '#FFFFFF' : '#8E8E93'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Weather banner — only for grid tabs */}
        {isGrid && (
          <div
            className="flex items-center gap-2 px-4 mb-5"
            style={{ height: 40, borderRadius: 14, background: 'rgba(230,202,154,0.2)', border: '1px solid rgba(230,202,154,0.35)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5943A" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            <span style={{ fontSize: 12, color: '#282828' }}>今日天气适合的穿搭优先展示</span>
          </div>
        )}
      </div>

      {/* Outfit grid (2 columns) */}
      {isGrid && (
        <div className="px-5 pb-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {displayed.map(outfit => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              wornCount={calendarRecords.filter(record => record.outfitId === outfit.id).length}
              isFav={favorites.has(outfit.id)}
              onTap={() => onOutfitTap(outfit)}
              onFav={e => {
                e.stopPropagation()
                setFavorites(prev => {
                  const next = new Set(prev)
                  next.has(outfit.id) ? next.delete(outfit.id) : next.add(outfit.id)
                  return next
                })
              }}
            />
          ))}
        </div>
      )}

      {/* Calendar view */}
      {isCalendar && (
        <CalendarView records={calendarRecords} />
      )}

      {/* Filter sheet */}
      {showFilter && (
        <OutfitFilterSheet
          allTags={allTags}
          filterTags={filterTags}
          onToggleTag={toggleTag}
          onReset={() => setFilterTags([])}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  )
}

function OutfitFilterSheet({
  allTags, filterTags, onToggleTag, onReset, onClose,
}: {
  allTags: string[]
  filterTags: string[]
  onToggleTag: (t: string) => void
  onReset: () => void
  onClose: () => void
}) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ zIndex: 70, overflow: 'hidden' }}>
      <div className="absolute inset-0" onClick={onClose} style={{ background: 'rgba(40,40,40,0.34)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} />
      <div
        className="absolute bottom-0 inset-x-0 animate-slide-up"
        style={{ borderRadius: '32px 32px 0 0', background: '#FFFFFF', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-center pt-3">
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(40,40,40,0.15)' }} />
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <button onClick={onReset} style={{ fontSize: 14, color: '#8E8E93', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>重置</button>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#282828' }}>筛选风格</p>
          <button onClick={onClose} style={{ fontSize: 14, fontWeight: 600, color: '#282828', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>完成</button>
        </div>
        <div style={{ padding: '4px 20px 40px' }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#8E8E93', marginBottom: 10 }}>风格标签</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {allTags.map(tag => {
              const active = filterTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => onToggleTag(tag)}
                  style={{
                    height: 32, padding: '0 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                    background: active ? '#282828' : '#F7F7F7',
                    color: active ? '#fff' : '#282828',
                    transition: 'all 0.15s',
                  }}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Calendar View ────────────────────────────────────────────────────────────

function CalendarView({ records }: { records: CalendarRecord[] }) {
  const font = "'Sora', 'PingFang SC', system-ui"

  const totalDays = records.length
  const thisMonth = (() => {
    const d = new Date()
    return records.filter(r => {
      const [y, m] = r.date.split('-').map(Number)
      return y === d.getFullYear() && m === d.getMonth() + 1
    }).length
  })()

  return (
    <div style={{ padding: '0 20px 40px' }}>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { label: '本月记录', value: thisMonth, unit: '天' },
          { label: '累计穿搭', value: totalDays, unit: '套' },
          { label: '平均频率', value: '5', unit: '天/周' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: '#FFFFFF', borderRadius: 18, padding: '14px 0',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#282828', fontFamily: font, lineHeight: 1 }}>{s.value}</span>
            <span style={{ fontSize: 10, color: '#B0B0B0', fontFamily: font }}>{s.unit}</span>
            <span style={{ fontSize: 10, color: '#8E8E93', fontFamily: font, marginTop: 1 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar card */}
      <OutfitCalendar records={records} />

      {/* Recent list */}
      <div style={{ marginTop: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#282828', fontFamily: font, marginBottom: 14 }}>最近穿搭</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 6).map(r => {
            const [, m, d] = r.date.split('-')
            return (
              <div key={r.date} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: '#FFFFFF', borderRadius: 18, padding: '10px 14px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                {/* Thumbnail */}
                <div style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={r.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {r.tags.map(t => (
                      <span key={t} style={{ fontSize: 12, color: '#282828', fontFamily: font, fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: '#B0B0B0', fontFamily: font, marginTop: 3 }}>
                    {parseInt(m)}月{parseInt(d)}日
                  </p>
                </div>
                {/* Dot */}
                <div style={{ width: 6, height: 6, borderRadius: 999, background: '#E8E8E8', flexShrink: 0 }} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function OutfitCard({
  outfit, wornCount, isFav, onTap, onFav,
}: {
  outfit: Outfit
  wornCount: number
  isFav: boolean
  onTap: () => void
  onFav: (e: React.MouseEvent) => void
}) {
  return (
    <div
      onClick={onTap}
      className="cursor-pointer"
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        background: '#F7F7F7',
        boxShadow: '0 6px 24px -2px rgba(0,0,0,0.04)',
        border: '1px solid rgba(40,40,40,0.04)',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/5', background: '#EBEBEB' }}>
        <OutfitComposition outfit={outfit} style={{ width: '100%', height: '100%' }} />
        <button
          onClick={onFav}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={isFav ? '#E05555' : 'none'} stroke={isFav ? '#E05555' : '#8E8E93'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="px-3 py-3">
        <div className="flex flex-wrap gap-1 mb-1.5">
          {outfit.tags.map(tag => (
            <span
              key={tag}
              style={{ fontSize: 11, color: '#8E8E93', fontWeight: 400 }}
            >
              {tag}{outfit.tags.indexOf(tag) < outfit.tags.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#B0B0B0', fontWeight: 400 }}>穿过 {wornCount} 次</p>
      </div>
    </div>
  )
}
