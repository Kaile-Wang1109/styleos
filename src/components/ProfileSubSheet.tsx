import { useState, useRef } from 'react'
import type { ClothingItem } from '../mockData'

interface Props {
  sheet: string
  onClose: () => void
  items: ClothingItem[]
}

export default function ProfileSubSheet({ sheet, onClose, items }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 40,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      className="animate-fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', top: 64, left: 0, right: 0, bottom: 0,
          background: '#FFFFFF',
          borderRadius: '32px 32px 0 0',
          overflowY: 'auto',
        }}
        className="animate-slide-up scrollbar-hide"
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(40,40,40,0.15)' }} />
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 8px' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#282828', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
            {sheetTitle(sheet)}
          </span>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 999, background: '#F7F7F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="#282828" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '8px 20px 40px' }}>
          {sheet === 'style' && <StyleContent items={items} />}
          {sheet === 'ai' && <AIContent />}
          {sheet === 'size' && <SizeContent />}
          {sheet === 'data' && <DataContent />}
          {sheet === 'notifications' && <NotificationsContent />}
        </div>
      </div>
    </div>
  )
}

function sheetTitle(sheet: string): string {
  const map: Record<string, string> = {
    style: '风格档案',
    ai: 'AI 偏好设置',
    size: '身型与尺码',
    data: '数字资产管理',
    notifications: '通知与提醒',
  }
  return map[sheet] ?? sheet
}

/* ─── EDIT PROFILE CONTENT ─── */

function EditProfileContent() {
  const [nickname, setNickname] = useState('Kaile')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [avatarColor, setAvatarColor] = useState(0)
  const [saved, setSaved] = useState(false)

  const avatarOptions = [
    'linear-gradient(135deg, #CBD77E 0%, #E6CA9A 100%)',
    'linear-gradient(135deg, #8EB4D4 0%, #B8D4E8 100%)',
    'linear-gradient(135deg, #D4A0A0 0%, #E8C8C8 100%)',
    'linear-gradient(135deg, #A0C4A0 0%, #C8E0C8 100%)',
    'linear-gradient(135deg, #282828 0%, #505050 100%)',
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      {/* Avatar picker */}
      <SectionTitle>头像</SectionTitle>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 999,
          background: avatarOptions[avatarColor],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: '#FFFFFF', fontFamily: "'Sora', system-ui" }}>
            {nickname.charAt(0).toUpperCase() || 'K'}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: '#8E8E93', marginBottom: 10, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>选择头像颜色</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {avatarOptions.map((grad, i) => (
              <button
                key={i}
                onClick={() => setAvatarColor(i)}
                style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: grad, border: 'none', cursor: 'pointer',
                  boxShadow: avatarColor === i ? '0 0 0 2.5px #CBD77E, 0 0 0 4px rgba(203,215,126,0.3)' : 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Basic info */}
      <SectionTitle>基本信息</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 14, overflow: 'hidden' }}>
        {[
          { label: '昵称', value: nickname, onChange: setNickname, placeholder: '你的昵称' },
          { label: '个人简介', value: bio, onChange: setBio, placeholder: '介绍一下自己的穿衣风格…' },
        ].map((field, i) => (
          <div key={field.label} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '13px 16px',
            borderTop: i > 0 ? '1px solid rgba(40,40,40,0.06)' : 'none',
          }}>
            <span style={{ fontSize: 14, color: '#8E8E93', width: 52, flexShrink: 0, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{field.label}</span>
            <input
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              style={{
                flex: 1, fontSize: 14, color: '#282828', background: 'transparent',
                border: 'none', outline: 'none', fontFamily: "'Sora', 'PingFang SC', system-ui",
              }}
            />
          </div>
        ))}
      </div>

      {/* Contact */}
      <SectionTitle>联系方式</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 14, overflow: 'hidden' }}>
        {[
          { label: '手机号码', value: phone, onChange: setPhone, placeholder: '绑定手机号码', type: 'tel' },
        ].map((field, i) => (
          <div key={field.label} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '13px 16px',
            borderTop: i > 0 ? '1px solid rgba(40,40,40,0.06)' : 'none',
          }}>
            <span style={{ fontSize: 14, color: '#8E8E93', width: 52, flexShrink: 0, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{field.label}</span>
            <input
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              type={field.type}
              style={{
                flex: 1, fontSize: 14, color: '#282828', background: 'transparent',
                border: 'none', outline: 'none', fontFamily: "'Sora', 'PingFang SC', system-ui",
              }}
            />
            {!field.value && (
              <span style={{ fontSize: 12, color: '#CBD77E', fontWeight: 500, fontFamily: "'Sora', system-ui" }}>去绑定</span>
            )}
          </div>
        ))}
      </div>

      {/* Address */}
      <SectionTitle>地址信息</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 14, overflow: 'hidden' }}>
        {[
          { label: '城市', value: city, onChange: setCity, placeholder: '所在城市' },
          { label: '详细地址', value: address, onChange: setAddress, placeholder: '街道、门牌号等' },
        ].map((field, i) => (
          <div key={field.label} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '13px 16px',
            borderTop: i > 0 ? '1px solid rgba(40,40,40,0.06)' : 'none',
          }}>
            <span style={{ fontSize: 14, color: '#8E8E93', width: 52, flexShrink: 0, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{field.label}</span>
            <input
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              style={{
                flex: 1, fontSize: 14, color: '#282828', background: 'transparent',
                border: 'none', outline: 'none', fontFamily: "'Sora', 'PingFang SC', system-ui",
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        style={{
          width: '100%', height: 52, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: saved ? '#CBD77E' : '#282828',
          color: saved ? '#2d3a0e' : '#FFFFFF',
          fontSize: 15, fontWeight: 600, marginTop: 28,
          fontFamily: "'Sora', 'PingFang SC', system-ui",
          transition: 'all 0.2s',
        }}
      >
        {saved ? '✓ 保存成功' : '保存'}
      </button>
    </div>
  )
}

/* ─── HELPERS ─── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500, letterSpacing: '0.2px', marginBottom: 8, marginTop: 20, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
      {children}
    </p>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 50, height: 28, borderRadius: 999,
        background: on ? '#CBD77E' : '#E0E0E0',
        position: 'relative', flexShrink: 0,
        transition: 'background 0.2s',
        border: 'none', cursor: 'pointer', padding: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, width: 22, height: 22, borderRadius: 999,
        background: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        left: on ? 25 : 3,
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

function SelectPill({ children, selected, onClick }: { children: React.ReactNode; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500,
        background: selected ? '#282828' : '#F7F7F7',
        color: selected ? '#FFFFFF' : '#282828',
        border: 'none', cursor: 'pointer',
        fontFamily: "'Sora', 'PingFang SC', system-ui",
        transition: 'all 0.15s ease',
      }}
    >{children}</button>
  )
}

/* ─── DONUT CHART ─── */

function DonutChart({ data }: { data: { label: string; color: string; pct: number }[] }) {
  const r = 38
  const circ = 2 * Math.PI * r
  let offset = 0

  return (
    <svg width={82} height={82} viewBox="0 0 96 96">
      {/* Base track */}
      <circle cx={48} cy={48} r={r} fill="none" stroke="#F0F0F0" strokeWidth={14} />
      {data.map((seg, i) => {
        const dash = (seg.pct / 100) * circ
        const gap = circ - dash
        const rot = -90 + (offset / 100) * 360
        offset += seg.pct
        return (
          <circle
            key={i}
            cx={48} cy={48} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={14}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
            transform={`rotate(${rot} 48 48)`}
          />
        )
      })}
    </svg>
  )
}

/* ─── STYLE CONTENT ─── */

function StyleContent({ items }: { items: ClothingItem[] }) {
  const palette = ['#282828', '#5A5A5A', '#8E8E93', '#B0B0B0', '#D0D0D0']
  const colorHex: Record<string, string> = { 黑色: '#282828', 白色: '#E2E2E2', 灰色: '#999999', 浅蓝: '#7898BF', 靛蓝: '#395A88', 藏青: '#1A3050', 米色: '#E6CA9A', 卡其: '#B5A07A', 棕色: '#8B6040', 绿色: '#4A7A50', 红色: '#C04040', 粉色: '#E8A0A0', 银色: '#B8BBC1' }
  const distribution = (values: string[]) => {
    const counts = values.reduce<Record<string, number>>((result, value) => ({ ...result, [value]: (result[value] ?? 0) + 1 }), {})
    const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const total = rows.reduce((sum, [, count]) => sum + count, 0)
    return rows.map(([label, count], index) => ({ label, pct: total ? Math.round(count / total * 100) : 0, color: palette[index] }))
  }
  const dnaData = distribution(items.flatMap(item => item.styles))
  const colorData = distribution(items.flatMap(item => item.colors)).map(row => ({ ...row, color: colorHex[row.label] ?? row.color }))
  const sceneData = distribution(items.map(item => item.type))
  const seasonTags = items.flatMap(item => item.seasons)
  const seasonTotal = Math.max(1, seasonTags.length)
  const thickPct = Math.round(seasonTags.filter(season => season === '冬').length / seasonTotal * 100)
  const lightPct = Math.round(seasonTags.filter(season => season === '夏').length / seasonTotal * 100)
  const midPct = Math.max(0, 100 - thickPct - lightPct)
  const totalWears = items.reduce((sum, item) => sum + item.wornCount, 0)
  const habitsData = [
    { label: '衣橱单品', value: `${items.length} 件` },
    { label: '已穿单品', value: `${items.filter(item => item.wornCount > 0).length} 件` },
    { label: '累计穿着', value: `${totalWears} 次` },
    { label: '最常见类型', value: sceneData[0]?.label ?? '暂无数据' },
  ]
  const aiConclusions = [
    { icon: '◎', text: dnaData[0] ? `衣橱中出现最多的风格标签是“${dnaData[0].label}”，占已记录风格标签的 ${dnaData[0].pct}%。` : '录入单品风格后，这里会生成风格分析。' },
    { icon: '△', text: colorData[0] ? `使用最多的主题色是“${colorData[0].label}”，占已记录主题色的 ${colorData[0].pct}%。` : '录入单品主题色后，这里会生成色彩分析。' },
    { icon: '✦', text: `当前分析仅依据 ${items.length} 件衣橱单品和 ${totalWears} 次穿着记录生成。` },
  ]

  if (items.length === 0) return <div style={{ padding: '72px 20px', textAlign: 'center', color: '#8E8E93', lineHeight: '22px' }}>衣橱中还没有单品。录入衣物后，这里会根据真实数据生成风格档案。</div>

  return (
    <div>
      {/* DNA donut */}
      <div style={{ background: '#F7F7F7', borderRadius: 16, padding: '18px 16px' }}>
        <p style={{ fontSize: 11, color: '#8E8E93', fontWeight: 500, marginBottom: 16, letterSpacing: '0.3px', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
          风格 DNA · 基于衣橱数据分析
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <DonutChart data={dnaData} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#282828', fontFamily: "'Sora', system-ui", lineHeight: 1 }}>{dnaData[0]?.pct ?? 0}%</span>
              <span style={{ fontSize: 9, color: '#8E8E93', marginTop: 2, whiteSpace: 'nowrap', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{dnaData[0]?.label ?? '暂无'}</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {dnaData.map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: item.color, flexShrink: 0 }} />
                <span style={{ width: 38, flexShrink: 0, fontSize: 12, color: '#282828', whiteSpace: 'nowrap', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{item.label}</span>
                <div style={{ flex: 1, minWidth: 24, maxWidth: 44, height: 4, borderRadius: 999, background: '#E8E8E8' }}>
                  <div style={{ height: '100%', width: `${item.pct}%`, borderRadius: 999, background: item.color }} />
                </div>
                <span style={{ fontSize: 11, color: '#8E8E93', fontWeight: 600, width: 30, flexShrink: 0, textAlign: 'right', fontFamily: "'Sora', system-ui" }}>{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#8E8E93', marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(40,40,40,0.06)', lineHeight: '18px', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
          {dnaData[0] ? `当前衣橱以“${dnaData[0].label}”标签占比最高；以上结果会随单品信息和穿着记录自动更新。` : '暂无可分析的风格标签。'}
        </p>
      </div>

      {/* Color donut */}
      <SectionTitle>衣橱色彩分布</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 16, padding: '18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <DonutChart data={colorData} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#282828', fontFamily: "'Sora', system-ui", lineHeight: 1 }}>{colorData[0]?.pct ?? 0}%</span>
              <span style={{ fontSize: 9, color: '#8E8E93', marginTop: 2, whiteSpace: 'nowrap', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{colorData[0]?.label ?? '暂无'}</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {colorData.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: c.color, flexShrink: 0, border: c.color === '#C8C8C8' ? '1px solid #E0E0E0' : 'none' }} />
                <span style={{ width: 38, flexShrink: 0, fontSize: 12, color: '#282828', whiteSpace: 'nowrap', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{c.label}</span>
                <div style={{ flex: 1, minWidth: 24, maxWidth: 44, height: 4, borderRadius: 999, background: '#E8E8E8' }}>
                  <div style={{ height: '100%', width: `${c.pct}%`, borderRadius: 999, background: c.color, border: c.color === '#C8C8C8' ? '1px solid #D0D0D0' : 'none' }} />
                </div>
                <span style={{ fontSize: 11, color: '#8E8E93', width: 30, flexShrink: 0, textAlign: 'right', fontFamily: "'Sora', system-ui" }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scene */}
      <SectionTitle>单品类型分布</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sceneData.map(row => (
          <div key={row.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#282828', whiteSpace: 'nowrap', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#282828', fontFamily: "'Sora', system-ui" }}>{row.pct}%</span>
            </div>
            <div style={{ height: 5, borderRadius: 999, background: '#E8E8E8' }}>
              <div style={{ height: '100%', width: `${row.pct}%`, borderRadius: 999, background: '#282828', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Climate thickness */}
      <SectionTitle>气候穿衣厚度偏好</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 16, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[
            { label: '冬季单品', value: `${thickPct}%`, sub: '季节标签：冬' },
            { label: '春秋/四季', value: `${midPct}%`, sub: '季节标签：春秋' },
            { label: '夏季单品', value: `${lightPct}%`, sub: '季节标签：夏' },
          ].map(item => (
            <div key={item.label} style={{ flex: 1, background: '#FFFFFF', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#282828', fontFamily: "'Sora', system-ui" }}>{item.value}</p>
              <p style={{ fontSize: 11, color: '#282828', fontWeight: 500, marginTop: 2, whiteSpace: 'nowrap', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{item.label}</p>
              <p style={{ fontSize: 10, color: '#8E8E93', marginTop: 2, whiteSpace: 'nowrap', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{item.sub}</p>
            </div>
          ))}
        </div>
        {/* Segmented bar */}
        <div style={{ display: 'flex', height: 6, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
          <div style={{ width: `${thickPct}%`, background: '#282828', borderRadius: '999px 0 0 999px' }} />
          <div style={{ width: `${midPct}%`, background: '#8E8E93' }} />
          <div style={{ width: `${lightPct}%`, background: '#D0D0D0', borderRadius: '0 999px 999px 0' }} />
        </div>
      </div>

      {/* Habits */}
      <SectionTitle>穿衣习惯</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 16, overflow: 'hidden' }}>
        {habitsData.map((row, i) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px',
            borderTop: i > 0 ? '1px solid rgba(40,40,40,0.06)' : 'none',
          }}>
            <span style={{ fontSize: 13, color: '#8E8E93', whiteSpace: 'nowrap', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#282828', whiteSpace: 'nowrap', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* AI conclusions */}
      <SectionTitle>AI 衣橱建议</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {aiConclusions.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            background: '#F7F7F7', borderRadius: 14, padding: '14px 16px',
          }}>
            <span style={{ fontSize: 14, color: '#CBD77E', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
            <p style={{ fontSize: 13, color: '#282828', lineHeight: '20px', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── AI CONTENT ─── */

const styleContrasts: { left: string; right: string; default: number }[] = [
  { left: '简约', right: '繁复', default: 25 },
  { left: '休闲', right: '正式', default: 60 },
  { left: '经典', right: '潮流', default: 45 },
  { left: '低调', right: '张扬', default: 20 },
]

function readStored<T>(key: string): T | null {
  try { return JSON.parse(localStorage.getItem(key) || 'null') as T | null } catch { return null }
}

function AIContent() {
  const stored = readStored<{ prefs: { noRepeat: boolean; weather: boolean; scene: boolean }; excluded: string[]; occasions: string[]; tempPref: number; styleSliders: number[] }>('styleos.aiPreferences')
  const [prefs, setPrefs] = useState(stored?.prefs ?? { noRepeat: true, weather: true, scene: true })
  const prefKeys = ['noRepeat', 'weather', 'scene'] as const
  const prefLabels = ['避免重复穿搭', '参考天气推荐', '根据场景筛选']

  const [excluded, setExcluded] = useState<string[]>(stored?.excluded ?? ['过于正式', '运动风'])
  const [addingTag, setAddingTag] = useState(false)
  const [newTag, setNewTag] = useState('')

  const allOccasions = ['通勤', '约会', '旅行', '聚会', '运动']
  const [occasions, setOccasions] = useState<Set<string>>(new Set(stored?.occasions ?? ['通勤', '旅行']))

  const [tempPref, setTempPref] = useState(stored?.tempPref ?? 40)
  const [styleSliders, setStyleSliders] = useState<number[]>(stored?.styleSliders ?? styleContrasts.map(s => s.default))

  const [saved, setSaved] = useState(false)

  const addTag = () => {
    if (newTag.trim()) setExcluded(prev => [...prev, newTag.trim()])
    setNewTag('')
    setAddingTag(false)
  }

  const handleSave = () => {
    localStorage.setItem('styleos.aiPreferences', JSON.stringify({ prefs, excluded, occasions: [...occasions], tempPref, styleSliders }))
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  return (
    <div>
      <SectionTitle>搭配偏好</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 14, overflow: 'hidden' }}>
        {prefKeys.map((key, i) => (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            borderTop: i > 0 ? '1px solid rgba(40,40,40,0.06)' : 'none',
          }}>
            <span style={{ fontSize: 15, color: '#282828', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{prefLabels[i]}</span>
            <Toggle on={prefs[key]} onChange={() => setPrefs(p => ({ ...p, [key]: !p[key] }))} />
          </div>
        ))}
      </div>

      <SectionTitle>风格过滤</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 14, padding: 16 }}>
        <p style={{ fontSize: 12, color: '#8E8E93', marginBottom: 10, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>不喜欢的风格</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {excluded.map(tag => (
            <button
              key={tag}
              onClick={() => setExcluded(prev => prev.filter(t => t !== tag))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 10px 5px 12px', borderRadius: 999, fontSize: 13,
                background: '#FFFFFF', color: '#282828', border: 'none', cursor: 'pointer',
                fontFamily: "'Sora', 'PingFang SC', system-ui",
              }}
            >
              {tag}<span style={{ fontSize: 10, color: '#8E8E93' }}>✕</span>
            </button>
          ))}
          {addingTag ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                autoFocus value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTag() }}
                placeholder="输入风格"
                style={{ width: 80, height: 32, borderRadius: 999, border: '1px solid rgba(40,40,40,0.2)', padding: '0 10px', fontSize: 13, outline: 'none', fontFamily: "'Sora', 'PingFang SC', system-ui" }}
              />
              <button onClick={addTag} style={{ padding: '5px 10px', borderRadius: 999, fontSize: 12, background: '#282828', color: '#fff', border: 'none', cursor: 'pointer' }}>确认</button>
            </div>
          ) : (
            <button onClick={() => setAddingTag(true)} style={{ padding: '5px 12px', borderRadius: 999, fontSize: 13, color: '#8E8E93', background: 'transparent', border: '1px dashed rgba(40,40,40,0.2)', fontFamily: "'Sora', 'PingFang SC', system-ui", cursor: 'pointer' }}>+ 添加</button>
          )}
        </div>
      </div>

      <SectionTitle>场合偏好 · 多选</SectionTitle>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {allOccasions.map(o => (
          <SelectPill key={o} selected={occasions.has(o)} onClick={() => {
            const next = new Set(occasions)
            next.has(o) ? next.delete(o) : next.add(o)
            setOccasions(next)
          }}>
            {occasions.has(o) ? '✓ ' : ''}{o}
          </SelectPill>
        ))}
      </div>

      <SectionTitle>风格偏好</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 14, padding: '4px 16px 16px' }}>
        <p style={{ fontSize: 12, color: '#8E8E93', padding: '12px 0 8px', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
          拖动滑块调节对立风格的偏好占比
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {styleContrasts.map((pair, idx) => {
            const val = styleSliders[idx]
            const leftPct = val
            const rightPct = 100 - val
            return (
              <div key={pair.left}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: leftPct >= rightPct ? '#282828' : '#8E8E93', fontFamily: "'Sora', 'PingFang SC', system-ui", transition: 'color 0.2s' }}>
                    {pair.left} {leftPct}%
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: rightPct > leftPct ? '#282828' : '#8E8E93', fontFamily: "'Sora', 'PingFang SC', system-ui", transition: 'color 0.2s' }}>
                    {rightPct}% {pair.right}
                  </span>
                </div>
                <div style={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center' }}>
                  {/* Track background */}
                  <div style={{ position: 'absolute', inset: 0, top: '50%', transform: 'translateY(-50%)', height: 6, borderRadius: 999, background: '#E0E0E0' }} />
                  {/* Left fill */}
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', height: 6, width: `${val}%`, borderRadius: 999, background: 'linear-gradient(90deg, #CBD77E, #282828)', transition: 'width 0.05s' }} />
                  <input
                    type="range" min={0} max={100} value={val}
                    onChange={e => setStyleSliders(prev => prev.map((v, i) => i === idx ? Number(e.target.value) : v))}
                    style={{ position: 'relative', width: '100%', accentColor: '#282828', cursor: 'pointer', background: 'transparent', zIndex: 1 }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <SectionTitle>温度偏好</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 14, padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: '#8E8E93', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>偏好穿厚</span>
          <span style={{ fontSize: 12, color: '#282828', fontWeight: 600, fontFamily: "'Sora', system-ui" }}>{tempPref}%</span>
          <span style={{ fontSize: 12, color: '#8E8E93', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>偏好穿薄</span>
        </div>
        <input
          type="range" min={0} max={100} value={tempPref}
          onChange={e => setTempPref(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#282828', cursor: 'pointer' }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          width: '100%', height: 52, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: saved ? '#CBD77E' : '#282828',
          color: saved ? '#282828' : '#FFFFFF',
          fontSize: 15, fontWeight: 600, marginTop: 28,
          fontFamily: "'Sora', 'PingFang SC', system-ui",
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        {saved ? '✓ 偏好已保存' : '保存 AI 偏好'}
      </button>
    </div>
  )
}

/* ─── SIZE CONTENT ─── */

function SizeContent() {
  const stored = readStored<{ basic: Record<string, string>; body3d: Record<string, string>; fit: string; bodyShape: string }>('styleos.bodyProfile')
  const [basic, setBasic] = useState(stored?.basic ?? {
    身高: '167cm', 体重: '52kg', 上装: 'M', 下装: '27', 鞋码: '37', 肩宽: '38cm',
  })
  const [body3d, setBody3d] = useState(stored?.body3d ?? {
    胸围: '86cm', 腰围: '64cm', 臀围: '90cm',
  })
  const [editing, setEditing] = useState<string | null>(null)
  const [editVal, setEditVal] = useState('')
  const [fit, setFit] = useState<string>(stored?.fit ?? '宽松')
  const [bodyShape, setBodyShape] = useState<string>(stored?.bodyShape ?? '沙漏型')
  const [synced, setSynced] = useState(false)

  const startEdit = (label: string, val: string) => { setEditing(label); setEditVal(val) }
  const commitEdit = (store: 'basic' | '3d') => {
    if (!editing) return
    if (store === 'basic') setBasic(prev => ({ ...prev, [editing]: editVal }))
    else setBody3d(prev => ({ ...prev, [editing]: editVal }))
    setEditing(null)
  }

  const sizeOptions: Record<string, string[]> = {
    上装: ['XS', 'S', 'M', 'L', 'XL'],
    下装: ['25', '26', '27', '28', '29', '30'],
    鞋码: ['35', '36', '37', '38', '39', '40'],
  }

  const bodyShapes = [
    { key: 'H型', desc: '肩臀等宽，腰部不明显' },
    { key: '梨形', desc: '臀部宽于肩部' },
    { key: '沙漏型', desc: '肩臀等宽，腰细' },
    { key: '苹果型', desc: '腰腹较丰满' },
    { key: '倒三角', desc: '肩宽臀窄' },
  ]

  const renderCell = (label: string, value: string, store: 'basic' | '3d') => (
    <div
      key={label}
      onClick={() => editing !== label && startEdit(label, value)}
      style={{
        background: editing === label ? 'rgba(203,215,126,0.12)' : '#F7F7F7',
        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
        border: editing === label ? '1.5px solid rgba(203,215,126,0.6)' : '1.5px solid transparent',
        transition: 'all 0.15s',
      }}
    >
      <p style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{label}</p>
      {editing === label ? (
        sizeOptions[label] ? (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {sizeOptions[label].map(opt => (
              <button
                key={opt}
                onClick={e => { e.stopPropagation(); if (store === 'basic') setBasic(prev => ({ ...prev, [label]: opt })); setEditing(null) }}
                style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                  background: value === opt ? '#282828' : '#FFFFFF',
                  color: value === opt ? '#FFFFFF' : '#282828',
                  border: 'none', cursor: 'pointer',
                }}
              >{opt}</button>
            ))}
          </div>
        ) : (
          <input
            autoFocus
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onBlur={() => commitEdit(store)}
            onKeyDown={e => e.key === 'Enter' && commitEdit(store)}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', fontSize: 18, fontWeight: 700, color: '#282828',
              background: 'transparent', border: 'none', outline: 'none',
              fontFamily: "'Sora', system-ui",
            }}
          />
        )
      ) : (
        <p style={{ fontSize: 18, fontWeight: 700, color: '#282828', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{value}</p>
      )}
    </div>
  )

  return (
    <div>
      <p style={{ fontSize: 12, color: '#8E8E93', marginBottom: 10, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
        点击数值编辑
      </p>

      {/* Basic measurements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {(Object.entries(basic) as [string, string][]).map(([l, v]) => renderCell(l, v, 'basic'))}
      </div>

      {/* 3D body measurements */}
      <SectionTitle>三围数据</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {(Object.entries(body3d) as [string, string][]).map(([l, v]) => renderCell(l, v, '3d'))}
      </div>

      {/* Body shape */}
      <SectionTitle>身材类别</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bodyShapes.map(s => (
          <button
            key={s.key}
            onClick={() => setBodyShape(s.key)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 16px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: bodyShape === s.key ? '#282828' : '#F7F7F7',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                background: bodyShape === s.key ? 'rgba(255,255,255,0.18)' : 'rgba(40,40,40,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                color: bodyShape === s.key ? '#FFFFFF' : '#282828',
              }}>
                {bodyShape === s.key ? '✓' : ''}
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: bodyShape === s.key ? '#FFFFFF' : '#282828', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{s.key}</span>
            </div>
            <span style={{ fontSize: 12, color: bodyShape === s.key ? 'rgba(255,255,255,0.65)' : '#8E8E93', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{s.desc}</span>
          </button>
        ))}
      </div>

      {/* Fit preference */}
      <SectionTitle>版型偏好</SectionTitle>
      <div style={{ display: 'flex', gap: 8 }}>
        {['宽松', '正常', '修身'].map(p => (
          <SelectPill key={p} selected={fit === p} onClick={() => setFit(p)}>
            {fit === p ? '✓ ' : ''}{p}
          </SelectPill>
        ))}
      </div>

      <button
        onClick={() => {
          localStorage.setItem('styleos.bodyProfile', JSON.stringify({ basic, body3d, fit, bodyShape }))
          setSynced(true)
          setTimeout(() => setSynced(false), 1600)
        }}
        style={{
          width: '100%', height: 52, borderRadius: 999,
          background: synced ? '#CBD77E' : '#282828',
          color: '#FFFFFF',
          border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 24,
          fontFamily: "'Sora', 'PingFang SC', system-ui",
          transition: 'background 0.2s',
        }}
      >
        {synced ? '✓ 已同步' : '同步到 AI 推荐'}
      </button>
    </div>
  )
}

/* ─── DATA CONTENT ─── */

function DataContent() {
  const [toast, setToast] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<string | null>(null)
  const [storageUsed, setStorageUsed] = useState(48)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), 2200)
  }

  const handleDangerConfirm = (item: string) => {
    if (item === '清空穿搭记录') setStorageUsed(prev => Math.max(0, prev - 18))
    if (item === '重置 AI 偏好') showToast('AI 偏好已重置')
    setConfirm(null)
    showToast(`已完成：${item}`)
  }

  return (
    <div style={{ position: 'relative' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 100, left: '50%', transform: 'translateX(-50%)',
          background: '#282828', color: '#fff', borderRadius: 999,
          padding: '10px 20px', fontSize: 13, zIndex: 999,
          fontFamily: "'Sora', 'PingFang SC', system-ui",
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.2s ease both',
        }}>
          {toast}
        </div>
      )}

      <div style={{ background: '#F7F7F7', borderRadius: 16, padding: 20, marginBottom: 4 }}>
        <p style={{ fontSize: 13, color: '#8E8E93', marginBottom: 8, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>已用 {(storageUsed / 100 * 5).toFixed(1)} GB / 5 GB</p>
        <div style={{ height: 8, borderRadius: 999, background: '#E0E0E0' }}>
          <div style={{ height: '100%', width: `${storageUsed}%`, borderRadius: 999, background: storageUsed > 70 ? '#E05555' : '#282828', transition: 'width 0.4s ease' }} />
        </div>
        <p style={{ fontSize: 12, color: '#8E8E93', marginTop: 6, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{storageUsed}% 已使用</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
        {[
          { value: '128', label: '件单品' },
          { value: '36', label: '套穿搭' },
          { value: '24', label: '次 AI 生成' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#F7F7F7', borderRadius: 14, padding: '14px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#282828', fontFamily: "'Sora', system-ui" }}>{s.value}</span>
            <span style={{ fontSize: 11, color: '#8E8E93', marginTop: 2, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <SectionTitle>数据操作</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 14, overflow: 'hidden' }}>
        {['导出衣橱数据', '备份穿搭记录', '从相册重新导入'].map((item, i) => (
          <button
            key={item}
            onClick={() => showToast(`正在处理：${item}…`)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px 16px', borderTop: i > 0 ? '1px solid rgba(40,40,40,0.06)' : 'none',
              background: 'transparent', border: 'none', cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 15, color: '#282828', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{item}</span>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M1 1L6 6L1 11" stroke="rgba(40,40,40,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      <SectionTitle>危险操作</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 14, overflow: 'hidden' }}>
        {['清空穿搭记录', '重置 AI 偏好'].map((item, i) => (
          <div key={item}>
            <button
              onClick={() => setConfirm(confirm === item ? null : item)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', padding: '15px 16px',
                borderTop: i > 0 ? '1px solid rgba(40,40,40,0.06)' : 'none',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 15, color: '#E05555', fontFamily: "'Sora', 'PingFang SC', system-ui", flex: 1, textAlign: 'left' }}>{item}</span>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1L6 6L1 11" stroke="#E05555" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {confirm === item && (
              <div style={{ padding: '12px 16px', background: 'rgba(224,85,85,0.06)', borderTop: '1px solid rgba(40,40,40,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#8E8E93', flex: 1, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>此操作无法撤销，确认吗？</span>
                <button
                  onClick={() => setConfirm(null)}
                  style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(40,40,40,0.15)', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: "'Sora', 'PingFang SC', system-ui" }}
                >取消</button>
                <button
                  onClick={() => handleDangerConfirm(item)}
                  style={{ padding: '6px 14px', borderRadius: 999, border: 'none', background: '#E05555', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'Sora', 'PingFang SC', system-ui" }}
                >确认</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: '#8E8E93', textAlign: 'center', marginTop: 20, lineHeight: 1.5, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
        数据存储于本地设备，不会上传至云端
      </p>
    </div>
  )
}

/* ─── TIME PICKER ─── */

function TimePicker({ hour, minute, onHourChange, onMinuteChange, fmt }: {
  hour: number; minute: number
  onHourChange: (h: number) => void
  onMinuteChange: (m: number) => void
  fmt: (n: number) => string
}) {
  const dragRef = useRef<{ field: 'h' | 'm'; startY: number; startVal: number } | null>(null)

  const startDrag = (field: 'h' | 'm', clientY: number) => {
    dragRef.current = { field, startY: clientY, startVal: field === 'h' ? hour : minute }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', stopDrag)
  }

  const onMove = (e: MouseEvent) => applyDrag(e.clientY)
  const onTouchMove = (e: TouchEvent) => { e.preventDefault(); applyDrag(e.touches[0].clientY) }

  const applyDrag = (clientY: number) => {
    if (!dragRef.current) return
    const { field, startY, startVal } = dragRef.current
    const delta = Math.round((startY - clientY) / 14)
    if (field === 'h') onHourChange((startVal + delta + 240) % 24)
    else onMinuteChange(Math.round(((startVal + delta * 15 + 600) % 60) / 15) * 15 % 60)
  }

  const stopDrag = () => {
    dragRef.current = null
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', stopDrag)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', stopDrag)
  }

  const digitStyle = (field: 'h' | 'm'): React.CSSProperties => ({
    fontSize: 56, fontWeight: 700, color: '#282828', letterSpacing: '-2px',
    fontFamily: "'Sora', system-ui", lineHeight: 1,
    cursor: 'ns-resize', userSelect: 'none', WebkitUserSelect: 'none',
    padding: '8px 6px',
    borderRadius: 12,
    background: 'rgba(40,40,40,0.05)',
    transition: 'background 0.15s',
  })

  return (
    <div style={{ background: '#F7F7F7', borderRadius: 20, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

      {/* Hint */}
      <p style={{ fontSize: 11, color: '#B0B0B0', marginBottom: 16, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>
        上下拖动数字调节时间
      </p>

      {/* Time digits */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
        <span
          style={digitStyle('h')}
          onMouseDown={e => startDrag('h', e.clientY)}
          onTouchStart={e => startDrag('h', e.touches[0].clientY)}
        >{fmt(hour)}</span>
        <span style={{ fontSize: 40, fontWeight: 200, color: 'rgba(40,40,40,0.25)', fontFamily: "'Sora', system-ui", lineHeight: 1, padding: '0 2px', alignSelf: 'center' }}>:</span>
        <span
          style={digitStyle('m')}
          onMouseDown={e => startDrag('m', e.clientY)}
          onTouchStart={e => startDrag('m', e.touches[0].clientY)}
        >{fmt(minute)}</span>
      </div>

      {/* +/− buttons */}
      <div style={{ display: 'flex', gap: 10, width: '100%', marginBottom: 16 }}>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          <button onClick={() => onHourChange((hour - 1 + 24) % 24)} style={adjBtn}>−</button>
          <span style={adjLabel}>时</span>
          <button onClick={() => onHourChange((hour + 1) % 24)} style={adjBtn}>＋</button>
        </div>
        <div style={{ width: 1, background: 'rgba(40,40,40,0.08)', alignSelf: 'stretch' }} />
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          <button onClick={() => onMinuteChange((minute - 15 + 60) % 60)} style={adjBtn}>−</button>
          <span style={adjLabel}>分</span>
          <button onClick={() => onMinuteChange((minute + 15) % 60)} style={adjBtn}>＋</button>
        </div>
      </div>

      {/* Quick picks */}
      <div style={{ display: 'flex', gap: 8 }}>
        {([[7, 0], [8, 0], [9, 0], [12, 0]] as [number, number][]).map(([h, m]) => (
          <button
            key={h}
            onClick={() => { onHourChange(h); onMinuteChange(m) }}
            style={{
              padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: hour === h && minute === m ? '#282828' : 'rgba(40,40,40,0.08)',
              color: hour === h && minute === m ? '#FFFFFF' : '#8E8E93',
              fontSize: 12, fontWeight: 500, fontFamily: "'Sora', system-ui",
              transition: 'all 0.15s',
            }}
          >{fmt(h)}:00</button>
        ))}
      </div>
    </div>
  )
}

const adjBtn: React.CSSProperties = {
  flex: 1, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
  background: 'rgba(40,40,40,0.07)', color: '#282828', fontSize: 18, fontWeight: 300,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const adjLabel: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flex: '0 0 28px', fontSize: 11, color: '#B0B0B0',
  fontFamily: "'Sora', 'PingFang SC', system-ui",
}

/* ─── NOTIFICATIONS CONTENT ─── */

function NotificationsContent() {
  const [daily, setDaily] = useState({ outfit: true, weather: true })
  const [smart, setSmart] = useState({ idle: true, season: false, weekly: true })
  const [hour, setHour] = useState(8)
  const [minute, setMinute] = useState(0)
  const [pushEnabled, setPushEnabled] = useState(true)

  const fmt = (n: number) => String(n).padStart(2, '0')

  return (
    <div>
      {/* Master switch — always visible */}
      <SectionTitle>通知权限</SectionTitle>
      <div style={{ background: '#F7F7F7', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 15, color: '#282828', marginBottom: 2, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>推送通知</p>
          <p style={{ fontSize: 12, color: '#8E8E93', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{pushEnabled ? '已开启，可配置推送内容与时间' : '关闭后将不接收任何通知'}</p>
        </div>
        <Toggle on={pushEnabled} onChange={() => setPushEnabled(p => !p)} />
      </div>

      {/* Rest only shown when push is enabled */}
      {pushEnabled && (
        <>
          <SectionTitle>每日推送</SectionTitle>
          <div style={{ background: '#F7F7F7', borderRadius: 14, overflow: 'hidden' }}>
            {([
              { key: 'outfit' as const, label: '今日穿搭建议', sub: '根据时间推送' },
              { key: 'weather' as const, label: '天气穿衣提醒', sub: '根据天气变化提醒' },
            ]).map((row, i) => (
              <div key={row.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 16px', borderTop: i > 0 ? '1px solid rgba(40,40,40,0.06)' : 'none',
              }}>
                <div>
                  <p style={{ fontSize: 15, color: '#282828', marginBottom: 2, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{row.label}</p>
                  <p style={{ fontSize: 12, color: '#8E8E93', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{row.sub}</p>
                </div>
                <Toggle on={daily[row.key]} onChange={() => setDaily(p => ({ ...p, [row.key]: !p[row.key] }))} />
              </div>
            ))}
          </div>

          <SectionTitle>智能提醒</SectionTitle>
          <div style={{ background: '#F7F7F7', borderRadius: 14, overflow: 'hidden' }}>
            {([
              { key: 'idle' as const, label: '闲置单品提醒', sub: '超过 30 天未穿的单品' },
              { key: 'season' as const, label: '换季整理提醒', sub: '季节切换时整理衣橱' },
              { key: 'weekly' as const, label: '穿搭周报', sub: '每周日晚总结本周穿搭' },
            ]).map((row, i) => (
              <div key={row.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 16px', borderTop: i > 0 ? '1px solid rgba(40,40,40,0.06)' : 'none',
              }}>
                <div>
                  <p style={{ fontSize: 15, color: '#282828', marginBottom: 2, fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{row.label}</p>
                  <p style={{ fontSize: 12, color: '#8E8E93', fontFamily: "'Sora', 'PingFang SC', system-ui" }}>{row.sub}</p>
                </div>
                <Toggle on={smart[row.key]} onChange={() => setSmart(p => ({ ...p, [row.key]: !p[row.key] }))} />
              </div>
            ))}
          </div>

          <SectionTitle>推送时间</SectionTitle>
          <TimePicker hour={hour} minute={minute} onHourChange={setHour} onMinuteChange={setMinute} fmt={fmt} />
        </>
      )}

      <button style={{
        width: '100%', height: 48, borderRadius: 999, background: 'transparent',
        border: '1px solid rgba(40,40,40,0.20)', color: '#282828',
        fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 16,
        fontFamily: "'Sora', 'PingFang SC', system-ui",
      }}>前往系统设置</button>
    </div>
  )
}
