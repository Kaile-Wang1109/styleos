import { useEffect, useState } from 'react'
import { processGarments, type ProcessedGarment } from '../services/garments'

interface Props {
  photos: string[]
  onComplete: (garments: ProcessedGarment[]) => void
}

export default function AIProcessingPage({ photos, onComplete }: Props) {
  const [progress, setProgress] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [manualReview, setManualReview] = useState(false)
  const [error, setError] = useState('')
  const total = photos.length

  useEffect(() => {
    let active = true
    const timer = setInterval(() => setProgress(value => Math.min(value + .025, .9)), 120)
    processGarments(photos).then(results => {
      if (!active) return
      clearInterval(timer)
      setCurrentIndex(total - 1)
      setProgress(1)
      setManualReview(results.some(result => result.processingMode === 'manual-review'))
      setDone(true)
      setTimeout(() => onComplete(results), 450)
    }).catch(reason => {
      if (!active) return
      clearInterval(timer)
      setError(reason instanceof Error ? reason.message : '处理失败，请稍后重试')
    })
    return () => { active = false; clearInterval(timer) }
  }, [])

  const pct = Math.round(progress * 100)
  const circumference = 2 * Math.PI * 52

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#F7F7F7', borderRadius: 50 }}
    >
      {/* Animated ring + image */}
      <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 36 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="70" cy="70" r="52" stroke="#E8E8E8" strokeWidth="4" fill="none" />
          <circle
            cx="70"
            cy="70"
            r="52"
            stroke="#282828"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transform="rotate(-90 70 70)"
            style={{ transition: 'stroke-dashoffset 0.06s linear' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 12,
            borderRadius: 20,
            overflow: 'hidden',
            background: '#E8E8E8',
          }}
        >
          {photos[currentIndex] && (
            <img
              key={currentIndex}
              src={photos[currentIndex]}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: done ? 0.4 : 1, transition: 'opacity 0.3s' }}
            />
          )}
          {done && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.6)' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#282828" />
                <path d="M9 16L13.5 20.5L23 12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#282828', letterSpacing: '-0.4px', marginBottom: 8 }}>
        {error ? '处理未完成' : done ? (manualReview ? '照片导入完成' : '抠图与识别完成') : 'AI 正在抠图并识别'}
      </h2>
      <p style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center', lineHeight: '20px', marginBottom: 32, padding: '0 40px' }}>
        {error ? error : done
          ? (manualReview ? `识别服务尚未连接，已导入 ${total} 件单品，请手动确认信息` : `已处理完 ${total} 件单品，即将进入审核`)
          : `正在处理第 ${currentIndex + 1} / ${total} 张，请稍候…`}
      </p>

      {/* Progress bar */}
      <div style={{ width: 220, height: 4, borderRadius: 999, background: '#E0E0E0', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: '#282828',
            borderRadius: 999,
            transition: 'width 0.06s linear',
          }}
        />
      </div>
      <p style={{ fontSize: 13, color: '#ABABAB', marginTop: 10 }}>{pct}%</p>
    </div>
  )
}
