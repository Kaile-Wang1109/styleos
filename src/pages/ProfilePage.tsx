import { useState, useRef } from 'react'

interface Props {
  onOpenSheet: (sheet: string) => void
  hasWardrobe: boolean
  itemCount: number
  outfitCount: number
  wearCount: number
}

export default function ProfilePage({ onOpenSheet, hasWardrobe, itemCount, outfitCount, wearCount }: Props) {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const [nickname, setNickname] = useState('Kaile')
  const [editingNickname, setEditingNickname] = useState(false)
  const [nickDraft, setNickDraft] = useState('Kaile')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarSrc(url)
  }

  const commitNickname = () => {
    if (nickDraft.trim()) setNickname(nickDraft.trim())
    setEditingNickname(false)
  }

  return (
    <div style={{ minHeight: '100%', background: '#F7F7F7', paddingTop: 8, paddingBottom: 40 }}>
      {/* Top profile section */}
      <div style={{ background: 'rgba(255,255,255,0)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, paddingRight: 0, paddingLeft: 0, paddingBottom: 20, marginBottom: 12 }}>
        {/* Tappable avatar */}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        <button
          onClick={() => fileRef.current?.click()}
          style={{ position: 'relative', width: 80, height: 80, borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer', marginBottom: 12, background: 'transparent' }}
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt="头像" style={{ width: 80, height: 80, borderRadius: 999, objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: 999,
              background: 'linear-gradient(135deg, #CBD77E 0%, #E6CA9A 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: '#FFFFFF', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
                {nickname.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Camera badge */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 24, height: 24, borderRadius: 999,
            background: '#282828', border: '2px solid #F7F7F7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
              <path d="M4 1H7L8 2.5H10C10.3 2.5 10.5 2.7 10.5 3V8.5C10.5 8.8 10.3 9 10 9H1C0.7 9 0.5 8.8 0.5 8.5V3C0.5 2.7 0.7 2.5 1 2.5H3L4 1Z" stroke="white" strokeWidth="0.8" strokeLinejoin="round" />
              <circle cx="5.5" cy="5.8" r="1.5" stroke="white" strokeWidth="0.8" />
            </svg>
          </div>
        </button>

        {/* Tappable nickname */}
        {editingNickname ? (
          <input
            autoFocus
            value={nickDraft}
            onChange={e => setNickDraft(e.target.value)}
            onBlur={commitNickname}
            onKeyDown={e => { if (e.key === 'Enter') commitNickname() }}
            style={{
              fontSize: 22, fontWeight: 700, color: '#282828', textAlign: 'center',
              background: 'transparent', border: 'none', borderBottom: '1.5px solid #CBD77E',
              outline: 'none', marginBottom: 4, fontFamily: "'Sora', 'PingFang SC', system-ui",
              width: 160,
            }}
          />
        ) : (
          <button
            onClick={() => { setNickDraft(nickname); setEditingNickname(true) }}
            style={{
              fontSize: 22, fontWeight: 700, color: '#282828', background: 'transparent',
              border: 'none', cursor: 'text', padding: 0, marginBottom: 4,
              fontFamily: "'Sora', 'PingFang SC', system-ui",
            }}
          >{nickname}</button>
        )}

        <p style={{ fontSize: 13, color: '#8E8E93', marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>StyleOS ID · 230812</p>
      </div>

      {/* Stats row */}
      <div style={{ background: '#FFFFFF', display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        {([
          { value: hasWardrobe ? String(itemCount) : '0', label: '单品数量' },
          { value: hasWardrobe ? String(outfitCount) : '0', label: '套穿搭' },
          { value: String(wearCount), label: '穿着记录' },
        ] as { value: string; label: string }[]).map((stat, i) => (
          <div key={stat.label} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0',
            borderLeft: i > 0 ? '1px solid rgba(40,40,40,0.10)' : 'none',
          }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#282828', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{stat.value}</span>
            <span style={{ fontSize: 12, color: '#8E8E93', marginTop: 2, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Card group 1 */}
      <div style={{ marginTop: 0, marginLeft: 16, marginRight: 16, marginBottom: 12, background: '#FFFFFF', borderRadius: 20, overflow: 'hidden' }}>
        <MenuItem icon={<PhoneIcon />} label="风格档案" onTap={() => onOpenSheet('style')} />
        <MenuItem icon={<SlidersIcon />} label="AI 偏好设置" badge="BETA" onTap={() => onOpenSheet('ai')} />
        <MenuItem icon={<RulerIcon />} label="身型与尺码" rightText="已更新" onTap={() => onOpenSheet('size')} last />
      </div>

      {/* Card group 2 */}
      <div style={{ margin: '0 16px', background: '#FFFFFF', borderRadius: 20, overflow: 'hidden' }}>
        <MenuItem icon={<DatabaseIcon />} label="数字资产管理" onTap={() => onOpenSheet('data')} />
        <MenuItem icon={<BellIcon />} label="通知与提醒" onTap={() => onOpenSheet('notifications')} last />
      </div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  badge?: string
  rightText?: string
  onTap: () => void
  last?: boolean
}

function MenuItem({ icon, label, badge, rightText, onTap, last }: MenuItemProps) {
  return (
    <button
      onClick={onTap}
      style={{
        width: '100%', height: 56, display: 'flex', alignItems: 'center',
        padding: '0 16px', background: 'transparent', border: 'none', cursor: 'pointer',
        borderBottom: last ? 'none' : '1px solid rgba(40,40,40,0.06)',
        gap: 12, textAlign: 'left', boxSizing: 'border-box',
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 999, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <span style={{ flex: 1, fontSize: 15, color: '#282828', fontFamily: "'Sora', 'PingFang SC', system-ui", fontWeight: 400 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: 10, fontWeight: 600, color: '#282828',
          background: 'rgba(203,215,126,0.20)', borderRadius: 999,
          padding: '2px 7px', marginRight: 4,
          fontFamily: "'Sora', system-ui",
        }}>{badge}</span>
      )}
      {rightText && (
        <span style={{ fontSize: 13, color: '#8E8E93', marginRight: 4, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{rightText}</span>
      )}
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M1 1L6 6L1 11" stroke="rgba(40,40,40,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1" width="10" height="14" rx="2" stroke="#282828" strokeWidth="1.3" />
      <circle cx="8" cy="12.5" r="0.7" fill="#282828" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="2" y1="4" x2="14" y2="4" stroke="#282828" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="2" y1="8" x2="14" y2="8" stroke="#282828" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="2" y1="12" x2="14" y2="12" stroke="#282828" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="5" cy="4" r="1.5" fill="#F7F7F7" stroke="#282828" strokeWidth="1.3" />
      <circle cx="10" cy="8" r="1.5" fill="#F7F7F7" stroke="#282828" strokeWidth="1.3" />
      <circle cx="6" cy="12" r="1.5" fill="#F7F7F7" stroke="#282828" strokeWidth="1.3" />
    </svg>
  )
}

function RulerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="5" width="14" height="6" rx="1.5" stroke="#282828" strokeWidth="1.3" />
      <line x1="4" y1="5" x2="4" y2="8" stroke="#282828" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="5" x2="7" y2="7" stroke="#282828" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="10" y1="5" x2="10" y2="8" stroke="#282828" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="13" y1="5" x2="13" y2="7" stroke="#282828" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function DatabaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="4" rx="5" ry="2" stroke="#282828" strokeWidth="1.3" />
      <path d="M3 4v4c0 1.1 2.24 2 5 2s5-.9 5-2V4" stroke="#282828" strokeWidth="1.3" />
      <path d="M3 8v4c0 1.1 2.24 2 5 2s5-.9 5-2V8" stroke="#282828" strokeWidth="1.3" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C5.79 1.5 4 3.29 4 5.5v4.5l-1 1h10l-1-1V5.5C12 3.29 10.21 1.5 8 1.5z" stroke="#282828" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.5 11.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="#282828" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
