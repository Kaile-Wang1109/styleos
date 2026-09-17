import { useRef, useState } from 'react'

const GALLERY_PHOTOS = [
  'photo-1521572163474-6864f9cf17ab',
  'photo-1542272454315-4c01d7abdf4a',
  'photo-1551488831-00ddcb6c6bd3',
  'photo-1591047139829-d91aecb6caea',
  'photo-1556905055-8f358a7a47b2',
  'photo-1594938298603-c8148c4b5e7e',
  'photo-1588117305388-c2631a279f82',
  'photo-1582552938357-32b906df40cb',
  'photo-1620012253295-c15cc3e65df4',
  'photo-1515886657613-9f3515b0c78f',
  'photo-1539109136881-3be0616acf4b',
  'photo-1496217590455-aa63a8350edc',
  'photo-1483985988355-763728e1935b',
  'photo-1434389677669-e08b4cac3105',
  'photo-1469334031218-e382a71b716b',
  'photo-1509631179647-0177331693ae',
  'photo-1503342394128-c104d54dba01',
  'photo-1516762689617-e1cffcef479d',
  'photo-1548126032-079a0fb0099d',
  'photo-1586790170083-2f9ceadc732d',
  'photo-1604695573706-53170668f6a6',
  'photo-1599391398131-cd12dfc6c24f',
  'photo-1611312449408-fcece27cdbb7',
  'photo-1562572159-4efd90232aff',
]

interface Props {
  onClose: () => void
  onConfirm: (photoUrls: string[]) => void
}

type Mode = 'choose' | 'gallery'

export default function PhotoPickerSheet({ onClose, onConfirm }: Props) {
  const [mode, setMode] = useState<Mode>('choose')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const cameraInput = useRef<HTMLInputElement>(null)
  const galleryInput = useRef<HTMLInputElement>(null)

  const acceptFiles = (files: FileList | null) => {
    if (!files?.length) return
    onConfirm(Array.from(files).map(file => URL.createObjectURL(file)))
  }

  const toggle = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const handleConfirm = () => {
    const urls = Array.from(selected)
      .sort((a, b) => a - b)
      .map(i => `https://images.unsplash.com/${GALLERY_PHOTOS[i]}?w=600&h=750&fit=crop&auto=format`)
    onConfirm(urls)
  }

  const count = selected.size

  if (mode === 'choose') {
    return (
      <div
        className="absolute inset-0 z-40 flex flex-col justify-end animate-fade-in"
        style={{ borderRadius: 50, overflow: 'hidden' }}
      >
        <div
          className="absolute inset-0"
          onClick={onClose}
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        />
        <div
          className="animate-slide-up"
          style={{
            position: 'relative',
            background: '#fff',
            borderRadius: '32px 32px 0 0',
            padding: '12px 16px 48px',
          }}
        >
          <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={event => acceptFiles(event.target.files)} />
          <input ref={galleryInput} type="file" accept="image/*" multiple hidden onChange={event => acceptFiles(event.target.files)} />
          <div className="flex justify-center pb-5">
            <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(40,40,40,0.15)' }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#282828', marginBottom: 16, paddingLeft: 4 }}>
            添加单品图片
          </h2>
          {/* Camera option */}
          <button
            onClick={() => cameraInput.current?.click()}
            style={{
              width: '100%',
              height: 72,
              borderRadius: 20,
              background: '#F7F7F7',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '0 20px',
              marginBottom: 10,
              fontFamily: 'inherit',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(40,40,40,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CameraIcon />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 16, fontWeight: 500, color: '#282828', lineHeight: '22px' }}>拍照</p>
              <p style={{ fontSize: 12, color: '#8E8E93', lineHeight: '17px' }}>使用相机拍摄衣物</p>
            </div>
          </button>
          {/* Gallery option */}
          <button
            onClick={() => galleryInput.current?.click()}
            style={{
              width: '100%',
              height: 72,
              borderRadius: 20,
              background: '#F7F7F7',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '0 20px',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(40,40,40,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GalleryIcon />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 16, fontWeight: 500, color: '#282828', lineHeight: '22px' }}>从相册选择</p>
              <p style={{ fontSize: 12, color: '#8E8E93', lineHeight: '17px' }}>可多选，批量导入</p>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Gallery grid
  return (
    <div
      className="absolute inset-0 z-40 flex flex-col animate-fade-in"
      style={{ background: '#000', borderRadius: 50, overflow: 'hidden' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 flex-shrink-0"
        style={{ background: '#1C1C1E', paddingTop: 56, paddingBottom: 14 }}
      >
        <button
          onClick={() => setMode('choose')}
          style={{ fontSize: 17, color: '#0A84FF', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
        >
          取消
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: '22px' }}>所有照片</p>
          {count > 0 && (
            <p style={{ fontSize: 12, color: '#0A84FF', lineHeight: '16px', marginTop: 1 }}>已选 {count} 张</p>
          )}
        </div>
        <button
          onClick={handleConfirm}
          disabled={count === 0}
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: count > 0 ? '#0A84FF' : 'rgba(255,255,255,0.3)',
            background: 'none',
            border: 'none',
            cursor: count > 0 ? 'pointer' : 'default',
            padding: '4px 0',
          }}
        >
          {count > 0 ? `添加(${count})` : '添加'}
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#000' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {GALLERY_PHOTOS.map((id, i) => {
            const isSel = selected.has(i)
            const order = isSel ? Array.from(selected).indexOf(i) + 1 : 0
            return (
              <div
                key={id}
                onClick={() => toggle(i)}
                style={{ position: 'relative', aspectRatio: '1', cursor: 'pointer', overflow: 'hidden' }}
              >
                <img
                  src={`https://images.unsplash.com/${id}?w=300&h=300&fit=crop&auto=format`}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: isSel ? 0.7 : 1, transition: 'opacity 0.15s' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: isSel ? '#0A84FF' : 'rgba(0,0,0,0.25)',
                    border: `2px solid ${isSel ? '#0A84FF' : 'rgba(255,255,255,0.7)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {isSel && <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{order}</span>}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function GalleryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}
