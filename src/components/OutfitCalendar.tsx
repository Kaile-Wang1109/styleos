import { useState } from 'react'
import { CalendarRecord } from '../mockData'

const font = "'Sora', 'PingFang SC', system-ui"
const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

const TODAY_STR = (() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})()

interface Props {
  records: CalendarRecord[]
  onRecordTap?: (record: CalendarRecord) => void
}

export default function OutfitCalendar({ records, onRecordTap }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth()) // 0-indexed

  const recordMap = new Map<string, CalendarRecord>()
  records.forEach(r => recordMap.set(r.date, r))

  // Build grid cells (Mon-first)
  const firstDay = new Date(viewYear, viewMonth, 1)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  let startWeekday = firstDay.getDay()
  startWeekday = (startWeekday + 6) % 7 // Mon=0 … Sun=6

  const cells: (number | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const monthRecords = records.filter(r => {
    const [y, m] = r.date.split('-').map(Number)
    return y === viewYear && m === viewMonth + 1
  })

  const canGoForward = () => {
    const ty = today.getFullYear(), tm = today.getMonth()
    return viewYear < ty || (viewYear === ty && viewMonth < tm)
  }

  const goBack = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const goForward = () => {
    if (!canGoForward()) return
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const fmtDate = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '20px 16px 28px' }}>
      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <NavBtn onClick={goBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </NavBtn>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#282828', fontFamily: font, lineHeight: 1 }}>
            {viewYear}年{viewMonth + 1}月
          </p>
        </div>
        <NavBtn onClick={goForward} disabled={!canGoForward()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={canGoForward() ? '#282828' : '#D0D0D0'} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </NavBtn>
      </div>

      {/* Stats */}
      <p style={{ fontSize: 12, color: '#8E8E93', textAlign: 'center', marginBottom: 20, fontFamily: font }}>
        本月已记录&nbsp;<span style={{ color: '#282828', fontWeight: 600 }}>{monthRecords.length}</span>&nbsp;天穿搭
      </p>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 10 }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, color: '#C0C0C0', fontWeight: 500, fontFamily: font, letterSpacing: '0.2px' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 10 }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const dateStr = fmtDate(day)
          const record = recordMap.get(dateStr)
          const isToday = dateStr === TODAY_STR
          const isPast = dateStr < TODAY_STR

          return (
            <DayCell
              key={dateStr}
              day={day}
              isToday={isToday}
              isPast={isPast}
              record={record}
              onTap={() => record && onRecordTap?.(record)}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(40,40,40,0.05)' }}>
        <LegendItem dot="img" label="已记录穿搭" />
        <LegendItem dot="today" label="今天" />
        <LegendItem dot="empty" label="未记录" />
      </div>
    </div>
  )
}

function DayCell({ day, isToday, isPast, record, onTap }: {
  day: number
  isToday: boolean
  isPast: boolean
  record?: CalendarRecord
  onTap: () => void
}) {
  return (
    <div
      onClick={record ? onTap : undefined}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: record ? 'pointer' : 'default' }}
    >
      {/* Circle */}
      <div style={{
        width: 34, height: 34, borderRadius: 999, overflow: record ? 'hidden' : undefined,
        background: record ? undefined : isToday ? 'rgba(203,215,126,0.15)' : 'transparent',
        border: isToday && !record ? '1.5px solid #CBD77E' : isToday && record ? '2px solid #CBD77E' : '1.5px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transition: 'opacity 0.15s',
      }}>
        {record ? (
          <img src={record.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : isPast ? (
          <div style={{ width: 4, height: 4, borderRadius: 999, background: '#E8E8E8' }} />
        ) : null}
      </div>

      {/* Date number */}
      <span style={{
        fontSize: 10, lineHeight: 1,
        color: isToday ? '#282828' : record ? '#282828' : isPast ? '#C8C8C8' : '#D8D8D8',
        fontWeight: isToday ? 700 : record ? 500 : 400,
        fontFamily: font,
      }}>
        {day}
      </span>
    </div>
  )
}

function NavBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32, height: 32, borderRadius: 999, border: 'none', cursor: disabled ? 'default' : 'pointer',
        background: disabled ? 'transparent' : '#F7F7F7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.3 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {children}
    </button>
  )
}

function LegendItem({ dot, label }: { dot: 'img' | 'today' | 'empty'; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{
        width: 10, height: 10, borderRadius: 999, flexShrink: 0,
        background: dot === 'img' ? '#B0B0B0' : dot === 'today' ? 'rgba(203,215,126,0.4)' : '#F0F0F0',
        border: dot === 'today' ? '1.5px solid #CBD77E' : undefined,
      }} />
      <span style={{ fontSize: 10, color: '#B0B0B0', fontFamily: font }}>{label}</span>
    </div>
  )
}
