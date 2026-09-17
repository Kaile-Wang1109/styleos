const font = "'Sora', 'PingFang SC', system-ui"

interface Props {
  onClose: () => void
  onAddItem: () => void
  onAIOutfit: () => void
  onManualOutfit: () => void
}

export default function CreateSheet({ onClose, onAddItem, onAIOutfit, onManualOutfit }: Props) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col animate-fade-in" style={{ borderRadius: 50, overflow: 'hidden' }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 inset-x-0 animate-slide-up"
        style={{ borderRadius: '32px 32px 0 0', background: '#FFFFFF', padding: '12px 20px 36px' }}
      >
        {/* Handle */}
        <div className="flex justify-center pb-5">
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(40,40,40,0.15)' }} />
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#282828', letterSpacing: '-0.2px', marginBottom: 20, fontFamily: font }}>创建</h2>

        {/* Add item */}
        <ActionCard
          iconBg="rgba(40,40,40,0.07)"
          icon={<CameraIcon />}
          title="录入单品"
          sub="拍照添加衣服到衣橱"
          onClick={onAddItem}
        />

        {/* Divider row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 4px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(40,40,40,0.06)' }} />
          <span style={{ fontSize: 11, color: '#C0C0C0', fontFamily: font }}>生成穿搭</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(40,40,40,0.06)' }} />
        </div>

        {/* Two outfit options side by side */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button
            onClick={onAIOutfit}
            style={{
              flex: 1, borderRadius: 22, background: '#F7F7F7', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '20px 12px 20px', fontFamily: font,
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(203,215,126,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SparkleIcon />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#282828', lineHeight: '20px', margin: 0 }}>AI 智能搭配</p>
              <p style={{ fontSize: 11, color: '#8E8E93', margin: 0, marginTop: 1 }}>一键生成造型</p>
            </div>
          </button>

          <button
            onClick={onManualOutfit}
            style={{
              flex: 1, borderRadius: 22, background: '#F7F7F7', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '20px 12px 20px', fontFamily: font,
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(40,40,40,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HandIcon />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#282828', lineHeight: '20px', margin: 0 }}>自由搭配</p>
              <p style={{ fontSize: 11, color: '#8E8E93', margin: 0, marginTop: 1 }}>自主选择单品</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ iconBg, icon, title, sub, onClick }: {
  iconBg: string; icon: React.ReactNode; title: string; sub: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', height: 76, borderRadius: 20, background: '#F7F7F7', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', textAlign: 'left', fontFamily: font,
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 14, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#282828', lineHeight: '22px', margin: 0 }}>{title}</p>
        <p style={{ fontSize: 12, color: '#8E8E93', margin: 0, marginTop: 1 }}>{sub}</p>
      </div>
      <svg style={{ marginLeft: 'auto' }} width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M1 1L6 6L1 11" stroke="rgba(40,40,40,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
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

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8A2B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L13.5 9L20 10.5L13.5 12L12 19L10.5 12L4 10.5L10.5 9L12 2Z" />
      <path d="M19 2L19.75 5.25L23 6L19.75 6.75L19 10L18.25 6.75L15 6L18.25 5.25L19 2Z" />
    </svg>
  )
}

function HandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v2" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M6 14a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-2.5" />
      <path d="M18 11.5a2 2 0 0 1 4 0V14" />
    </svg>
  )
}
