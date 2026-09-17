import { useEffect, useState, useRef } from 'react'
import { outfits, Outfit, CalendarRecord, items, ClothingItem } from '../mockData'

interface Props {
  onOutfitTap: (outfit: Outfit) => void
  onAISetup: (seedItem?: ClothingItem) => void
  onManual: () => void
  calendarRecords: CalendarRecord[]
  isFirstUse: boolean
  onAddFirstItem: () => void
  onTryDemo: () => void
}

type CurrentWeather = { temperature: number; condition: string; location: string }

const weatherLabel = (code: number) => {
  if (code === 0) return '晴天'
  if (code <= 3) return '多云'
  if (code <= 48) return '有雾'
  if (code <= 67 || (code >= 80 && code <= 82)) return '有雨'
  if (code <= 77 || code >= 85) return '有雪'
  return '雷阵雨'
}

// Soft palette per outfit index
const cardBgs = ['#EDE9E3', '#E3E8ED', '#EBE3ED', '#E3EDE7']

// Flat-lay fashion Unsplash images (portrait, soft bg)
const flatLayImages = [outfits[0].coverImage]

// Card descriptions
const cardDescriptions = ['机车皮夹克搭配高腰直筒牛仔裤，复古街头感利落统一']

// ── Week Strip ──────────────────────────────────────────────────────────────

const font = "'Sora', 'PingFang SC', system-ui"
const DAY_ABBR = ['日', '一', '二', '三', '四', '五', '六']

function WeekStrip({ records }: { records: CalendarRecord[] }) {
  const recordMap = new Map<string, CalendarRecord>()
  records.forEach(r => recordMap.set(r.date, r))

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return { d, dateStr, isToday: i === 6, record: recordMap.get(dateStr) }
  })

  const wornCount = days.filter(d => d.record).length

  return (
    <div style={{ padding: '0 20px', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#282828', fontFamily: font }}>穿搭日历</h2>
        <span style={{ fontSize: 12, color: '#8E8E93', fontFamily: font }}>近 7 天 · {wornCount} 套记录</span>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '16px 12px 20px', boxShadow: '0 2px 14px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
          {days.map(({ d, dateStr, isToday, record }) => (
            <div key={dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, color: isToday ? '#CBD77E' : '#C0C0C0', fontWeight: isToday ? 700 : 400, fontFamily: font }}>
                {isToday ? '今' : DAY_ABBR[d.getDay()]}
              </span>
              <div style={{
                width: 36, height: 36, borderRadius: 999,
                overflow: record ? 'hidden' : undefined,
                background: record ? undefined : isToday ? 'rgba(203,215,126,0.12)' : 'transparent',
                border: isToday && !record
                  ? '1.5px solid #CBD77E'
                  : isToday && record
                  ? '2px solid #CBD77E'
                  : '1.5px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {record ? (
                  <img src={record.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 4, height: 4, borderRadius: 999, background: isToday ? 'rgba(203,215,126,0.5)' : '#EBEBEB' }} />
                )}
              </div>
              <span style={{
                fontSize: 10, color: isToday ? '#282828' : record ? '#282828' : '#C8C8C8',
                fontWeight: isToday ? 700 : record ? 500 : 400,
                fontFamily: font, lineHeight: 1,
              }}>
                {d.getDate()}
              </span>
              {record && isToday && (
                <span style={{
                  fontSize: 9, color: '#CBD77E', fontWeight: 600, fontFamily: font,
                  background: 'rgba(203,215,126,0.15)', borderRadius: 999, padding: '1px 5px',
                  whiteSpace: 'nowrap',
                }}>已记录</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage({ onOutfitTap, onAISetup, onManual, calendarRecords, isFirstUse, onAddFirstItem, onTryDemo }: Props) {
  const [cardIndex, setCardIndex] = useState(0)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['o1', 'o3']))
  const [selectedIdleItem, setSelectedIdleItem] = useState<ClothingItem | null>(null)
  const touchStartX = useRef<number | null>(null)
  const [weather, setWeather] = useState<CurrentWeather>({ temperature: 26, condition: '晴天', location: '正在定位' })

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeather(current => ({ ...current, location: '当地天气' }))
      return
    }
    navigator.geolocation.getCurrentPosition(async position => {
      try {
        const { latitude, longitude } = position.coords
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`)
        const data = await response.json()
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          condition: weatherLabel(data.current.weather_code),
          location: '当前位置',
        })
      } catch {
        setWeather(current => ({ ...current, location: '当地天气' }))
      }
    }, () => setWeather(current => ({ ...current, location: '定位未授权' })), { timeout: 8000 })
  }, [])

  const idleItems = items.filter(i => i.lastWornDays > 14).sort((a, b) => b.lastWornDays - a.lastWornDays)

  const total = outfits.length

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta < -50) setCardIndex(i => (i + 1) % total)
    else if (delta > 50) setCardIndex(i => (i - 1 + total) % total)
  }

  const onPointerEnd = (clientX: number) => {
    if (touchStartX.current === null) return
    const delta = clientX - touchStartX.current
    touchStartX.current = null
    if (delta < -50) setCardIndex(i => (i + 1) % total)
    else if (delta > 50) setCardIndex(i => (i - 1 + total) % total)
  }

  const getOutfit = (offset: number) => outfits[(cardIndex + offset) % total]

  return (
    <div style={{ paddingTop: 16, paddingBottom: 32, background: '#F7F7F7', minHeight: '100%' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', marginBottom: 20 }}>
        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: 999, flexShrink: 0,
          background: 'linear-gradient(135deg, #CBD77E 0%, #E6CA9A 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: "'Sora', system-ui" }}>K</span>
        </div>

        {/* Greeting */}
        <div style={{ flex: 1, marginLeft: 12 }}>
          <p style={{ fontSize: 13, color: '#8E8E93', lineHeight: '18px', marginBottom: 1, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
            下午好 👋
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#282828', lineHeight: '26px', letterSpacing: '-0.2px', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
            Kaile
          </h1>
        </div>

        {/* Bell */}
        <div style={{
          width: 44, height: 44, borderRadius: 999, flexShrink: 0,
          background: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
      </div>

      {/* ── Weather ── */}
      <div style={{
        margin: '0 20px 22px',
        padding: '14px 18px',
        background: '#FFFFFF',
        borderRadius: 24,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
      }}>
        <SunIcon size={32} />
        <div style={{ display: 'flex', alignItems: 'baseline', marginLeft: 12, gap: 2 }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: '#282828', lineHeight: 1, fontFamily: "'Sora', system-ui" }}>{weather.temperature}</span>
          <span style={{ fontSize: 15, color: '#282828' }}>°C</span>
        </div>
        <div style={{ marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 13, color: '#282828', fontWeight: 600, fontFamily: font }}>{weather.condition}</span>
          <span style={{ fontSize: 11, color: '#8E8E93', fontFamily: font }}>{weather.location} · 今日实时</span>
        </div>
      </div>

      {isFirstUse ? (
        <div className="first-use-empty">
          <div className="first-use-icon">＋</div>
          <h2>从第一件衣物开始</h2>
          <p>拍摄或导入你的真实衣物，背景处理完成后，就能获得属于你的穿搭建议。</p>
          <button onClick={onAddFirstItem}>录入第一件单品</button>
          <button className="demo-link" onClick={onTryDemo}>先体验示例穿搭</button>
        </div>
      ) : <>
      {/* ── Today's picks header ── */}
      <div style={{ padding: '0 20px', marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#282828', letterSpacing: '-0.1px', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>今日推荐</h2>
      </div>

      {/* ── Card Stack ── */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onPointerDown={e => { touchStartX.current = e.clientX }}
        onPointerUp={e => onPointerEnd(e.clientX)}
        style={{ position: 'relative', height: 390, margin: '0 20px 8px', touchAction: 'pan-y' }}
      >
        {/* Card 3 (furthest back) */}
        <CardLayer
          outfit={getOutfit(2)}
          zIndex={1}
          translateY={0}
          scale={0.92}
          bgColor={cardBgs[(cardIndex + 2) % cardBgs.length]}
          imgSrc={flatLayImages[(cardIndex + 2) % flatLayImages.length]}
        />
        {/* Card 2 (middle) */}
        <CardLayer
          outfit={getOutfit(1)}
          zIndex={2}
          translateY={14}
          scale={0.96}
          bgColor={cardBgs[(cardIndex + 1) % cardBgs.length]}
          imgSrc={flatLayImages[(cardIndex + 1) % flatLayImages.length]}
        />
        {/* Card 1 (front) */}
        <div
          onClick={() => onOutfitTap(getOutfit(0))}
          style={{
            position: 'absolute', inset: 0, zIndex: 3,
            borderRadius: 28, overflow: 'hidden',
            background: cardBgs[cardIndex % cardBgs.length],
            boxShadow: '0 12px 40px -8px rgba(0,0,0,0.18)',
            transform: 'translateY(28px) scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1)',
            cursor: 'pointer',
          }}
        >
          {/* Outfit image */}
          <img
            src={flatLayImages[cardIndex % flatLayImages.length]}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: 20 }}
          />

          {/* Heart button */}
          <button
            onClick={e => toggleFav(getOutfit(0).id, e)}
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 36, height: 36, borderRadius: 999,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            <HeartIcon filled={favorites.has(getOutfit(0).id)} />
          </button>

          {/* Frosted glass bottom bar */}
          <div style={{
            position: 'absolute', bottom: 14, left: 14, right: 14,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.35)',
            padding: '12px 14px',
          }}>
            {/* Tags row */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              {getOutfit(0).tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: 11, fontWeight: 500, color: '#282828',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 999, padding: '3px 10px',
                    fontFamily: "'Sora', 'PingFang SC', system-ui",
                  }}
                >
                  {tag}
                </span>
              ))}
              <span
                style={{
                  fontSize: 11, fontWeight: 600, color: '#344014',
                  background: 'rgba(203,215,126,0.35)',
                  borderRadius: 999, padding: '3px 10px',
                  fontFamily: "'Sora', system-ui",
                }}
              >
                {getOutfit(0).weatherTag}
              </span>
            </div>
            {/* Description */}
            <p style={{
              fontSize: 12, color: '#3A3A3C', lineHeight: '17px',
              fontFamily: "'Sora', 'PingFang SC', system-ui",
              margin: 0,
            }}>
              {cardDescriptions[cardIndex % cardDescriptions.length]}
            </p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
        {outfits.map((_, i) => (
          <button
            key={i}
            onClick={() => setCardIndex(i)}
            style={{
              width: i === cardIndex ? 18 : 6, height: 6, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer',
              background: i === cardIndex ? '#282828' : '#D0D0D0',
              transition: 'all 0.25s ease',
            }}
          />
        ))}
      </div>

      {/* ── Outfit Calendar Week Strip ── */}
      <WeekStrip records={calendarRecords} />

      {/* ── Wardrobe insight ── */}
      <div style={{ padding: '0 20px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#282828', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>衣橱洞察</h2>
          <span style={{ fontSize: 12, color: '#8E8E93', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{idleItems.length} 件闲置单品</span>
        </div>

        {/* Hint text */}
        <p style={{ fontSize: 13, color: '#8E8E93', marginBottom: 16, lineHeight: '18px', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
          这些单品好久没穿了，选一件用它搭一套新造型吧
        </p>

        {/* Idle item thumbnails */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}
          className="scrollbar-hide">
          {idleItems.map(item => {
            const isSelected = selectedIdleItem?.id === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSelectedIdleItem(isSelected ? null : item)}
                style={{
                  flexShrink: 0, width: 88, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                <div style={{
                  width: 88, height: 88, borderRadius: 20,
                  background: isSelected ? '#282828' : '#FFFFFF',
                  boxShadow: isSelected ? '0 6px 20px rgba(40,40,40,0.18)' : '0 2px 10px rgba(0,0,0,0.05)',
                  border: isSelected ? '2px solid #282828' : '1.5px solid rgba(40,40,40,0.06)',
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: isSelected ? 'normal' : 'multiply', padding: 8 }}
                  />
                  {isSelected && (
                    <div style={{ position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 999, background: '#CBD77E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5.5L4 7.5L8 3" stroke="#282828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <p style={{ fontSize: 11, color: isSelected ? '#282828' : '#8E8E93', fontWeight: isSelected ? 600 : 400, fontFamily: "'Sora', 'PingFang SC', system-ui", lineHeight: '15px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: 10, color: '#C0C0C0', fontFamily: "'Sora', system-ui", margin: '2px 0 0' }}>
                    {item.lastWornDays}天未穿
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Action buttons — shown when item selected */}
        {selectedIdleItem && (
          <div style={{ display: 'flex', gap: 10, animation: 'fadeSlideUp 0.2s ease both' }}>
            <button
              onClick={() => onAISetup(selectedIdleItem)}
              style={{
                flex: 1, height: 48, borderRadius: 999, background: '#282828',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 14, fontWeight: 600, color: '#FFFFFF', fontFamily: "'Sora', 'PingFang SC', system-ui",
                transition: 'opacity 0.15s',
              }}
            >
              <span style={{ fontSize: 12 }}>✦</span>
              <span>AI 帮我搭</span>
            </button>
            <button
              onClick={onManual}
              style={{
                flex: 1, height: 48, borderRadius: 999, background: '#FFFFFF',
                border: '1.5px solid rgba(40,40,40,0.12)', cursor: 'pointer',
                fontSize: 14, fontWeight: 500, color: '#282828', fontFamily: "'Sora', 'PingFang SC', system-ui",
              }}
            >
              手动搭配
            </button>
          </div>
        )}
      </div>
      </>}
    </div>
  )
}

function CardLayer({
  translateY, scale, bgColor, imgSrc, zIndex,
}: {
  outfit: Outfit
  zIndex: number
  translateY: number
  scale: number
  bgColor: string
  imgSrc: string
}) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      zIndex,
      borderRadius: 28, overflow: 'hidden',
      background: bgColor,
      transform: `translateX(${zIndex === 1 ? -7 : 7}px) translateY(${translateY}px) rotate(${zIndex === 1 ? -4 : 3}deg) scale(${scale})`,
      transformOrigin: 'center top',
      transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1)',
    }}>
      <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: 20 }} />
    </div>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#E05555' : 'none'} stroke={filled ? '#E05555' : '#282828'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function SunIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="7" stroke="#F5A623" strokeWidth="2" />
      <line x1="18" y1="3" x2="18" y2="7" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="29" x2="18" y2="33" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="18" x2="7" y2="18" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
      <line x1="29" y1="18" x2="33" y2="18" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
      <line x1="7.4" y1="7.4" x2="10.2" y2="10.2" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
      <line x1="25.8" y1="25.8" x2="28.6" y2="28.6" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
      <line x1="28.6" y1="7.4" x2="25.8" y2="10.2" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
      <line x1="10.2" y1="25.8" x2="7.4" y2="28.6" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function WeatherMiniIcon({ icon }: { icon: string }) {
  if (icon === 'sun') return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="#F5A623" strokeWidth="1.4" />
      <line x1="8" y1="1" x2="8" y2="3" stroke="#F5A623" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="8" y1="13" x2="8" y2="15" stroke="#F5A623" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="1" y1="8" x2="3" y2="8" stroke="#F5A623" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="13" y1="8" x2="15" y2="8" stroke="#F5A623" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
  if (icon === 'rain') return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M3 10a4 4 0 0 1 4-7.5A3.5 3.5 0 0 1 13 6a2.5 2.5 0 0 1 0 5H3z" stroke="#6B9FD4" strokeWidth="1.3" strokeLinejoin="round" />
      <line x1="5" y1="13" x2="4" y2="15" stroke="#6B9FD4" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="8" y1="13" x2="7" y2="15" stroke="#6B9FD4" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11" y1="13" x2="10" y2="15" stroke="#6B9FD4" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M3 10a3.5 3.5 0 0 1 3-6.5A3 3 0 0 1 12 6a2 2 0 0 1 0 4H3z" stroke="#8E8E93" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}
