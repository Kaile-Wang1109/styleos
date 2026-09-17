import { useEffect, useState } from 'react'

interface Props {
  count: number
  onGoWardrobe: () => void
  onGoHome: () => void
}

export default function ImportCompletePage({ count, onGoWardrobe, onGoHome }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#F7F7F7', borderRadius: 50 }}
    >
      {/* Check circle */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: '#282828',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
          transform: show ? 'scale(1)' : 'scale(0.4)',
          opacity: show ? 1 : 0,
          transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M9 20L16.5 27.5L31 13"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="36"
            strokeDashoffset={show ? 0 : 36}
            style={{ transition: 'stroke-dashoffset 0.5s ease 0.28s' }}
          />
        </svg>
      </div>

      <h1
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: '#282828',
          letterSpacing: '-0.5px',
          marginBottom: 8,
          opacity: show ? 1 : 0,
          transform: show ? 'none' : 'translateY(8px)',
          transition: 'opacity 0.4s ease 0.12s, transform 0.4s ease 0.12s',
        }}
      >
        导入完成
      </h1>
      <p
        style={{
          fontSize: 15,
          color: '#8E8E93',
          marginBottom: 52,
          opacity: show ? 1 : 0,
          transition: 'opacity 0.4s ease 0.2s',
        }}
      >
        成功添加{' '}
        <span style={{ color: '#282828', fontWeight: 600 }}>{count}</span>{' '}
        件单品到衣橱
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: 260,
          opacity: show ? 1 : 0,
          transition: 'opacity 0.4s ease 0.3s',
        }}
      >
        <button
          onClick={onGoWardrobe}
          style={{
            height: 54,
            borderRadius: 16,
            background: '#282828',
            border: 'none',
            cursor: 'pointer',
            fontSize: 17,
            fontWeight: 600,
            color: '#fff',
            fontFamily: 'inherit',
            letterSpacing: '-0.2px',
          }}
        >
          查看衣橱
        </button>
        <button
          onClick={onGoHome}
          style={{
            height: 46,
            borderRadius: 16,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: 15,
            fontWeight: 500,
            color: '#ABABAB',
            fontFamily: 'inherit',
          }}
        >
          返回首页
        </button>
      </div>
    </div>
  )
}
