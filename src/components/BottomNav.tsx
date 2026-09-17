import { Tab } from '../App'

interface Props {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  onCreate: () => void
}

export default function BottomNav({ activeTab, onTabChange, onCreate }: Props) {
  return (
    <div
      className="absolute bottom-0 inset-x-0 z-10 flex items-end justify-center"
      style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))', pointerEvents: 'none' }}
    >
      {/* Floating pill */}
      <div
        className="flex items-center"
        style={{
          pointerEvents: 'auto',
          background: '#1C1C1E',
          borderRadius: 999,
          padding: 6,
          gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18)',
        }}
      >
        {/* Home */}
        <NavBtn active={activeTab === 'home'} onClick={() => onTabChange('home')}>
          <HomeIcon active={activeTab === 'home'} />
        </NavBtn>

        {/* Wardrobe */}
        <NavBtn active={activeTab === 'wardrobe'} onClick={() => onTabChange('wardrobe')}>
          <WardrobeIcon active={activeTab === 'wardrobe'} />
        </NavBtn>

        {/* Center + (olive green circle) */}
        <button
          onClick={onCreate}
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: '#CBD77E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <PlusIcon />
        </button>

        {/* Lookbook */}
        <NavBtn active={activeTab === 'lookbook'} onClick={() => onTabChange('lookbook')}>
          <LookbookIcon active={activeTab === 'lookbook'} />
        </NavBtn>

        {/* Profile */}
        <NavBtn active={activeTab === 'profile'} onClick={() => onTabChange('profile')}>
          <ProfileIcon active={activeTab === 'profile'} />
        </NavBtn>
      </div>
    </div>
  )
}

function NavBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 48,
        height: 48,
        borderRadius: 999,
        background: active ? '#FFFFFF' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.2s ease',
      }}
    >
      {children}
    </button>
  )
}

function iconColor(active: boolean) {
  return active ? '#1C1C1E' : 'rgba(255,255,255,0.65)'
}

function HomeIcon({ active }: { active: boolean }) {
  const c = iconColor(active)
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V16H9V21H4C3.45 21 3 20.55 3 20V10.5Z" />
    </svg>
  )
}

function WardrobeIcon({ active }: { active: boolean }) {
  const c = iconColor(active)
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  )
}

function LookbookIcon({ active }: { active: boolean }) {
  const c = iconColor(active)
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5C12 5 14.5 5 14.5 7C14.5 8.38 13 9 12 9" />
      <path d="M12 5C12 5 9.5 5 9.5 7C9.5 8.38 11 9 12 9" />
      <path d="M2 18L12 9L22 18" />
      <rect x="2" y="18" width="20" height="3" rx="1.5" fill={active ? c : 'none'} stroke={c} />
    </svg>
  )
}

function ProfileIcon({ active }: { active: boolean }) {
  const c = iconColor(active)
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 20" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#282828" strokeWidth="2.2" strokeLinecap="round">
      <line x1="10" y1="3" x2="10" y2="17" />
      <line x1="3" y1="10" x2="17" y2="10" />
    </svg>
  )
}
