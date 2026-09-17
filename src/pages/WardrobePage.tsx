import { useState } from 'react'
import { ClothingItem } from '../mockData'

interface Props {
  onItemTap: (item: ClothingItem) => void
  isEmpty: boolean
  onAddItem: () => void
  items: ClothingItem[]
}

const categories = ['全部', '上衣', '外套', '裤子', '裙子', '鞋子', '包袋', '配饰']
const allSeasons = ['春', '夏', '秋', '冬']

const COLOR_DOT: Record<string, string> = {
  '白色': '#F0F0F0', '深蓝': '#1A2F5E', '卡其': '#B5A07A', '黑色': '#1C1C1C',
  '米色': '#E8DCC8', '藏青': '#1A3050', '米白': '#F0EAD6', '棕色': '#8B6040',
}

export default function WardrobePage({ onItemTap, isEmpty, onAddItem, items }: Props) {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [favorites, setFavorites] = useState<Set<string>>(new Set(items.filter(i => i.favorite).map(i => i.id)))
  const [search, setSearch] = useState('')
  const [showFavOnly, setShowFavOnly] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [filterStyles, setFilterStyles] = useState<string[]>([])
  const [filterColors, setFilterColors] = useState<string[]>([])
  const [filterSeasons, setFilterSeasons] = useState<string[]>([])

  const hasActiveFilters = filterStyles.length > 0 || filterColors.length > 0 || filterSeasons.length > 0
  const allStyles = [...new Set(items.flatMap(i => i.styles))]
  const allColors = [...new Set(items.flatMap(i => i.colors))]

  const filtered = items.filter(item => {
    const matchCat = activeCategory === '全部' || item.type === activeCategory
    const matchSearch = !search || item.name.includes(search) || item.type.includes(search)
    const matchFav = !showFavOnly || favorites.has(item.id)
    const matchStyle = filterStyles.length === 0 || filterStyles.some(s => item.styles.includes(s))
    const matchColor = filterColors.length === 0 || filterColors.some(c => item.colors.includes(c))
    const matchSeason = filterSeasons.length === 0 || filterSeasons.some(s => item.seasons.includes(s))
    return matchCat && matchSearch && matchFav && matchStyle && matchColor && matchSeason
  })

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleChip = <T,>(arr: T[], set: (v: T[]) => void, val: T) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const stats = [
    { value: String(items.length), label: '全部单品' },
    { value: String(items.filter(item => item.wornCount > 0).length), label: '穿过' },
    { value: String(items.filter(item => item.lastWornDays > 30).length), label: '闲置' },
  ]

  if (isEmpty) return (
    <div className="tab-page empty-page">
      <div className="app-page-title"><h1>衣橱</h1></div>
      <div className="empty-state">
        <div className="empty-state-icon">◇</div>
        <h2>衣橱还是空的</h2>
        <p>录入你的第一件真实衣物，之后的推荐都会来自你的个人衣橱。</p>
        <button onClick={onAddItem}>录入第一件单品</button>
      </div>
    </div>
  )

  return (
    <div className="tab-page" style={{ paddingTop: 0, background: '#F7F7F7', minHeight: '100%' }}>
      {/* Nav title bar */}
      <div className="app-page-title">
        <h1 style={{ fontSize: 17, fontWeight: 600, color: '#282828', letterSpacing: '-0.1px', margin: 0, padding: 0 }}>衣橱</h1>
      </div>

      <div className="px-5">
        {/* Stats */}
        <div className="flex items-center justify-center" style={{ marginBottom: 16, gap: 0 }}>
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center">
              <div className="text-center" style={{ padding: '0 26px' }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#282828', lineHeight: '26px', letterSpacing: '-0.5px' }}>{stat.value}</p>
                <p style={{ fontSize: 11, color: '#8E8E93', fontWeight: 400, marginTop: 2 }}>{stat.label}</p>
              </div>
              {i < stats.length - 1 && (
                <div style={{ width: 1, height: 28, background: 'rgba(40,40,40,0.1)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Search + filter row */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="flex items-center gap-2 flex-1 px-3"
            style={{ height: 36, borderRadius: 12, background: '#FFFFFF', border: '1px solid rgba(40,40,40,.07)', boxShadow: '0 2px 10px rgba(40,40,40,.025)' }}
          >
            <SearchIcon />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索我的衣橱"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#282828', fontFamily: 'inherit' }}
            />
          </div>
          {/* Favorites toggle */}
          <button
            onClick={() => setShowFavOnly(v => !v)}
            style={{
              width: 36, height: 36, borderRadius: 12,
              background: showFavOnly ? '#FFF0F0' : '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(40,40,40,.07)', cursor: 'pointer', flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={showFavOnly ? '#E05555' : 'none'}
              stroke={showFavOnly ? '#E05555' : '#8E8E93'}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          {/* Filter toggle */}
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
            <FilterIcon active={hasActiveFilters} />
          </button>
        </div>
      </div>

      {/* Category nav */}
      <div className="flex gap-5 px-5 mb-4 overflow-x-auto scrollbar-hide">
        {categories.map(cat => {
          const isActive = cat === activeCategory
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative flex-shrink-0"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 0 9px' }}
            >
              <span style={{ fontSize: isActive ? 15 : 14, fontWeight: isActive ? 600 : 400, color: isActive ? '#282828' : '#8E8E93', transition: 'all 0.2s ease' }}>
                {cat}
              </span>
              {isActive && <span style={{ position: 'absolute', bottom: 2, left: '50%', width: 18, height: 2, borderRadius: 999, background: '#7E8B31', transform: 'translateX(-50%)' }} />}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="px-5 pb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => onItemTap(item)}
            className="relative cursor-pointer"
            style={{ aspectRatio: '1', borderRadius: 16, background: '#FFFFFF', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', mixBlendMode: 'multiply', padding: 6 }}
            />
            <button
              onClick={e => toggleFav(item.id, e)}
              style={{
                position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: 999,
                background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24"
                fill={favorites.has(item.id) ? '#E05555' : 'none'}
                stroke={favorites.has(item.id) ? '#E05555' : '#C0C0C0'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: '#8E8E93', fontSize: 14 }}>
            没有找到符合条件的单品
          </div>
        )}
      </div>

      {/* Filter sheet */}
      {showFilter && (
        <FilterSheet
          allStyles={allStyles}
          allColors={allColors}
          filterStyles={filterStyles}
          filterColors={filterColors}
          filterSeasons={filterSeasons}
          onToggleStyle={v => toggleChip(filterStyles, setFilterStyles, v)}
          onToggleColor={v => toggleChip(filterColors, setFilterColors, v)}
          onToggleSeason={v => toggleChip(filterSeasons, setFilterSeasons, v)}
          onReset={() => { setFilterStyles([]); setFilterColors([]); setFilterSeasons([]) }}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  )
}

interface FilterSheetProps {
  allStyles: string[]
  allColors: string[]
  filterStyles: string[]
  filterColors: string[]
  filterSeasons: string[]
  onToggleStyle: (v: string) => void
  onToggleColor: (v: string) => void
  onToggleSeason: (v: string) => void
  onReset: () => void
  onClose: () => void
}

function FilterSheet({ allStyles, allColors, filterStyles, filterColors, filterSeasons, onToggleStyle, onToggleColor, onToggleSeason, onReset, onClose }: FilterSheetProps) {
  const chip = (label: string, active: boolean, onTap: () => void, dot?: string) => (
    <button
      key={label}
      onClick={onTap}
      style={{
        height: 32, padding: '0 13px', borderRadius: 999, border: 'none', cursor: 'pointer',
        fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
        background: active ? '#282828' : '#F7F7F7',
        color: active ? '#fff' : '#282828',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'all 0.15s',
      }}
    >
      {dot && <span style={{ width: 10, height: 10, borderRadius: '50%', background: dot, display: 'inline-block', border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />}
      {label}
    </button>
  )

  return (
    <div className="fixed inset-0 flex flex-col" style={{ zIndex: 70, overflow: 'hidden' }}>
      <div className="absolute inset-0" onClick={onClose} style={{ background: 'rgba(40,40,40,0.34)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} />
      <div
        className="absolute bottom-0 inset-x-0 animate-slide-up"
        style={{ borderRadius: '32px 32px 0 0', background: '#FFFFFF', maxHeight: '75%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(40,40,40,0.15)' }} />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <button
            onClick={onReset}
            style={{ fontSize: 14, color: '#8E8E93', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            重置
          </button>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#282828' }}>筛选</p>
          <button
            onClick={onClose}
            style={{ fontSize: 14, fontWeight: 600, color: '#282828', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            完成
          </button>
        </div>

        {/* Sections */}
        <div className="overflow-y-auto flex-1" style={{ padding: '4px 20px 36px' }}>
          {/* Style */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#8E8E93', marginBottom: 10 }}>风格</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {allStyles.map(s => chip(s, filterStyles.includes(s), () => onToggleStyle(s)))}
            </div>
          </div>

          {/* Color */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#8E8E93', marginBottom: 10 }}>颜色</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {allColors.map(c => chip(c, filterColors.includes(c), () => onToggleColor(c), COLOR_DOT[c] ?? '#E0E0E0'))}
            </div>
          </div>

          {/* Season */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#8E8E93', marginBottom: 10 }}>季节</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {allSeasons.map(s => chip(s, filterSeasons.includes(s), () => onToggleSeason(s)))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function FilterIcon({ active }: { active: boolean }) {
  const c = active ? '#FFFFFF' : '#8E8E93'
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  )
}
