import { useState } from 'react'
import { ClothingItem } from '../mockData'

interface Props {
  seedItem?: ClothingItem
  onBack: () => void
  onGenerate: (scene: string, styles: string[]) => void
}

const scenes = [
  { label: '通勤' },
  { label: '约会' },
  { label: '旅行' },
  { label: '聚会' },
  { label: '运动' },
  { label: '休闲' },
]

const styleOptions = ['简约', '松弛', '优雅', '复古', '街头', '通勤', '法式', '学院']

export default function AISetupPage({ seedItem, onBack, onGenerate }: Props) {
  const [selectedScene, setSelectedScene] = useState<string | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [otherText, setOtherText] = useState('')

  const toggleStyle = (s: string) => {
    setSelectedStyles(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const canGenerate = selectedScene !== null

  return (
    <div className="flex flex-col" style={{ minHeight: '100%', background: '#FFFFFF', paddingTop: 56 }}>
      {/* Nav */}
      <div className="flex items-center px-5 pb-6">
        <button
          onClick={onBack}
          style={{ width: 36, height: 36, borderRadius: 12, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', marginRight: 'auto' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>

      <div className="px-5 flex-1 overflow-y-auto scrollbar-hide pb-8">
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#282828', letterSpacing: '-0.2px', marginBottom: 6 }}>AI 生成穿搭</h1>
        <p style={{ fontSize: 14, color: '#8E8E93', lineHeight: '20px', marginBottom: 28 }}>告诉我，你今天想怎么穿？</p>

        {/* Seed item hint */}
        {seedItem && (
          <div
            className="flex items-center gap-3 px-4 mb-6"
            style={{ height: 56, borderRadius: 16, background: 'rgba(203,215,126,0.12)', border: '1px solid rgba(203,215,126,0.3)' }}
          >
            <img src={seedItem.image} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'contain', mixBlendMode: 'multiply', background: '#FFFFFF' }} />
            <div>
              <p style={{ fontSize: 12, color: '#8E8E93', lineHeight: 1.2 }}>已选起点单品</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#282828' }}>{seedItem.name}</p>
            </div>
          </div>
        )}

        {/* Scene */}
        <div className="mb-7">
          <p style={{ fontSize: 15, fontWeight: 500, color: '#282828', marginBottom: 12 }}>场景</p>
          <div className="flex flex-wrap gap-2">
            {scenes.map(scene => {
              const isActive = selectedScene === scene.label
              return (
                <button
                  key={scene.label}
                  onClick={() => setSelectedScene(isActive ? null : scene.label)}
                  className="flex items-center gap-1.5 px-3.5"
                  style={{
                    height: 36,
                    borderRadius: 999,
                    background: isActive ? '#CBD77E' : '#F7F7F7',
                    border: `1px solid ${isActive ? 'transparent' : 'transparent'}`,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: '#282828',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{scene.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Style */}
        <div className="mb-7">
          <p style={{ fontSize: 15, fontWeight: 500, color: '#282828', marginBottom: 12 }}>风格</p>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map(style => {
              const isActive = selectedStyles.includes(style)
              return (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className="px-4"
                  style={{
                    height: 36,
                    borderRadius: 999,
                    background: isActive ? '#CBD77E' : '#F7F7F7',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: '#282828',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {style}
                </button>
              )
            })}
          </div>
        </div>

        {/* Current weather */}
        <div className="mb-7">
          <p style={{ fontSize: 15, fontWeight: 500, color: '#282828', marginBottom: 12 }}>当前天气</p>
          <div
            className="flex items-center gap-2 px-4"
            style={{ height: 44, borderRadius: 14, background: 'rgba(230,202,154,0.2)', border: '1px solid rgba(230,202,154,0.35)', display: 'inline-flex' }}
          >
            <SunIcon />
            <span style={{ fontSize: 15, fontWeight: 500, color: '#282828' }}>26℃</span>
            <span style={{ fontSize: 13, color: '#8E8E93' }}>• 晴朗</span>
          </div>
        </div>

        {/* Other input */}
        <div className="mb-8">
          <p style={{ fontSize: 15, fontWeight: 500, color: '#282828', marginBottom: 12 }}>其他需求（可选）</p>
          <textarea
            value={otherText}
            onChange={e => setOtherText(e.target.value)}
            placeholder="例如：不要高跟鞋，今天想穿得舒服一点…"
            style={{
              width: '100%',
              height: 100,
              borderRadius: 16,
              background: '#F7F7F7',
              border: 'none',
              padding: '14px 16px',
              fontSize: 14,
              color: '#282828',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              lineHeight: '22px',
            }}
          />
        </div>

        {/* Generate CTA */}
        <button
          onClick={() => canGenerate && onGenerate(selectedScene!, selectedStyles)}
          className="w-full flex items-center justify-center gap-2"
          style={{
            height: 52,
            borderRadius: 999,
            background: canGenerate ? '#282828' : '#E8E8E8',
            border: 'none',
            cursor: canGenerate ? 'pointer' : 'default',
            fontSize: 16,
            fontWeight: 600,
            color: canGenerate ? '#FFFFFF' : '#B0B0B0',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          <span>开始生成</span>
          <span>✦</span>
        </button>
      </div>
    </div>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5943A" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}
