import { useState } from 'react'
import { ClothingItem, Outfit, CalendarRecord, mockCalendarRecords, items as demoItems, outfits } from './mockData'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import WardrobePage from './pages/WardrobePage'
import LookbookPage from './pages/LookbookPage'
import ProfilePage from './pages/ProfilePage'
import OutfitDetailSheet from './components/OutfitDetailSheet'
import CreateSheet from './components/CreateSheet'
import ItemDetailPage from './components/ItemDetailPage'
import AISetupPage from './components/AISetupPage'
import AIResultPage from './components/AIResultPage'
import ManualBuilderPage from './components/ManualBuilderPage'
import LookbookDetailPage from './components/LookbookDetailPage'
import ProfileSubSheet from './components/ProfileSubSheet'
import PhotoPickerSheet from './components/PhotoPickerSheet'
import AIProcessingPage from './components/AIProcessingPage'
import ItemReviewPage from './components/ItemReviewPage'
import type { ReviewedGarment } from './components/ItemReviewPage'
import ImportCompletePage from './components/ImportCompletePage'
import type { ProcessedGarment } from './services/garments'

export type Tab = 'home' | 'wardrobe' | 'lookbook' | 'profile'

export type Page =
  | { type: 'item-detail'; item: ClothingItem }
  | { type: 'ai-setup'; seedItem?: ClothingItem }
  | { type: 'ai-result'; scene: string; styles: string[] }
  | { type: 'manual-builder' }
  | { type: 'lookbook-detail'; outfit: Outfit }
  | { type: 'ai-processing'; photos: string[] }
  | { type: 'item-review'; garments: ProcessedGarment[] }
  | { type: 'import-complete'; count: number }

export default function App() {
  const [hasWardrobe, setHasWardrobe] = useState(() => localStorage.getItem('styleos.hasWardrobe') === 'true')
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [pageStack, setPageStack] = useState<Page[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)
  const [outfitDetail, setOutfitDetail] = useState<Outfit | null>(null)
  const [wearPrompt, setWearPrompt] = useState<{ outfit: Outfit; same: boolean } | null>(null)
  const [profileSheet, setProfileSheet] = useState<string | null>(null)
  const [calendarRecords, setCalendarRecords] = useState<CalendarRecord[]>(() => {
    const saved = localStorage.getItem('styleos.calendarRecords')
    return saved ? JSON.parse(saved) : mockCalendarRecords
  })
  const [catalogItems, setCatalogItems] = useState<ClothingItem[]>(() => {
    const saved = localStorage.getItem('styleos.catalogItems')
    return saved ? JSON.parse(saved) : demoItems
  })
  const [catalogOutfits, setCatalogOutfits] = useState<Outfit[]>(() => {
    const saved = localStorage.getItem('styleos.catalogOutfits')
    return saved ? JSON.parse(saved) : outfits
  })

  const saveOutfit = (updated: Outfit, mode: 'replace' | 'copy') => {
    setCatalogOutfits(current => {
      const savedOutfit = mode === 'copy' ? { ...updated, id: `outfit-${Date.now()}`, wornCount: 0, favorite: false } : updated
      const next = mode === 'copy' ? [savedOutfit, ...current] : current.map(outfit => outfit.id === updated.id ? updated : outfit)
      localStorage.setItem('styleos.catalogOutfits', JSON.stringify(next))
      return next
    })
    pop()
  }

  const saveItem = (updated: ClothingItem) => {
    setCatalogItems(current => {
      const next = current.map(item => item.id === updated.id ? updated : item)
      localStorage.setItem('styleos.catalogItems', JSON.stringify(next))
      return next
    })
    setPageStack(current => current.map(page => page.type === 'item-detail' && page.item.id === updated.id ? { ...page, item: updated } : page))
  }

  const addReviewedItems = (reviewed: ReviewedGarment[]) => {
    const added: ClothingItem[] = reviewed.map((item, index) => ({
      id: `user-${Date.now()}-${index}`,
      name: item.name,
      type: item.category,
      subtype: item.subcategory,
      styles: item.styles,
      colors: item.colors.slice(0, 2),
      material: item.material,
      seasons: [item.season],
      image: item.photoUrl,
      favorite: false,
      lastWornDays: 0,
      wornCount: 0,
    }))
    setCatalogItems(current => {
      const next = [...added, ...current]
      localStorage.setItem('styleos.catalogItems', JSON.stringify(next))
      return next
    })
  }

  const addCalendarRecord = (outfit: Outfit) => {
    const d = new Date()
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const existing = calendarRecords.find(record => record.date === date)
    if (existing?.outfitId === outfit.id) {
      setWearPrompt({ outfit, same: true })
      return false
    }
    if (existing) {
      setWearPrompt({ outfit, same: false })
      return false
    }
    persistCalendarRecord(outfit, date)
    return true
  }

  const persistCalendarRecord = (outfit: Outfit, date?: string) => {
    const d = new Date()
    const targetDate = date ?? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const next = [
      ...calendarRecords.filter(record => record.date !== targetDate),
      { date: targetDate, outfitId: outfit.id, coverImage: outfit.coverImage, tags: outfit.tags },
    ]
    setCalendarRecords(next)
    localStorage.setItem('styleos.calendarRecords', JSON.stringify(next))
    setCatalogItems(current => {
      const now = new Date()
      const updated = current.map(item => {
        const dates = next
          .filter(record => outfits.find(candidate => candidate.id === record.outfitId)?.itemIds.includes(item.id))
          .map(record => record.date)
          .sort()
        if (dates.length === 0) return { ...item, wornCount: 0, lastWornDays: 0 }
        const lastDate = new Date(`${dates[dates.length - 1]}T00:00:00`)
        return {
          ...item,
          wornCount: dates.length,
          lastWornDays: Math.max(0, Math.floor((now.getTime() - lastDate.getTime()) / 86400000)),
        }
      })
      localStorage.setItem('styleos.catalogItems', JSON.stringify(updated))
      return updated
    })
  }

  const push = (page: Page) => setPageStack(prev => [...prev, page])
  const pop = () => setPageStack(prev => prev.slice(0, -1))

  const switchTab = (tab: Tab) => {
    setActiveTab(tab)
    setPageStack([])
    setOutfitDetail(null)
  }

  return (
    <div
      className="relative overflow-hidden bg-[#F7F7F7]"
      style={{ width: '100%', height: '100dvh' }}
    >
      {/* Tab pages — safe area top + bottom nav height */}
      <div
        className="absolute inset-0 overflow-y-auto scrollbar-hide"
        style={{
          paddingTop: 'max(44px, env(safe-area-inset-top))',
          paddingBottom: 'calc(96px + env(safe-area-inset-bottom))',
        }}
      >
        {activeTab === 'home' && (
          <HomePage
            onOutfitTap={setOutfitDetail}
            onAISetup={seedItem => push({ type: 'ai-setup', seedItem })}
            onManual={() => push({ type: 'manual-builder' })}
            calendarRecords={calendarRecords}
            isFirstUse={!hasWardrobe}
            onAddFirstItem={() => setShowPhotoPicker(true)}
            onTryDemo={() => {
              localStorage.setItem('styleos.hasWardrobe', 'true')
              setHasWardrobe(true)
            }}
          />
        )}
        {activeTab === 'wardrobe' && (
          <WardrobePage items={catalogItems} isEmpty={!hasWardrobe} onAddItem={() => setShowPhotoPicker(true)} onItemTap={item => push({ type: 'item-detail', item })} />
        )}
        {activeTab === 'lookbook' && (
          <LookbookPage
            outfits={catalogOutfits}
            onOutfitTap={outfit => push({ type: 'lookbook-detail', outfit })}
            calendarRecords={calendarRecords}
            isEmpty={!hasWardrobe}
            onCreate={() => hasWardrobe ? push({ type: 'ai-setup' }) : setShowPhotoPicker(true)}
          />
        )}
        {activeTab === 'profile' && <ProfilePage onOpenSheet={setProfileSheet} hasWardrobe={hasWardrobe} itemCount={catalogItems.length} outfitCount={catalogOutfits.length} wearCount={calendarRecords.length} />}
      </div>

      {/* Bottom nav */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={switchTab}
        onCreate={() => setShowCreate(true)}
      />

      {/* Page stack (slide from right) */}
      {pageStack.map((page, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-[#F7F7F7] animate-slide-right overflow-y-auto scrollbar-hide"
          style={{ zIndex: 20 + i }}
        >
          {page.type === 'item-detail' && (
            <ItemDetailPage
              item={page.item}
              onBack={pop}
              onSave={saveItem}
            />
          )}
          {page.type === 'ai-setup' && (
            <AISetupPage
              seedItem={page.seedItem}
              onBack={pop}
              onGenerate={(scene, styles) => push({ type: 'ai-result', scene, styles })}
            />
          )}
          {page.type === 'ai-result' && (
            <AIResultPage
              scene={page.scene}
              styles={page.styles}
              onBack={pop}
              onSaved={() => setPageStack(current => current.slice(0, -2))}
            />
          )}
          {page.type === 'manual-builder' && (
            <ManualBuilderPage onBack={pop} />
          )}
          {page.type === 'lookbook-detail' && (
            <LookbookDetailPage
              outfit={{ ...page.outfit, wornCount: calendarRecords.filter(record => record.outfitId === page.outfit.id).length }}
              onBack={pop}
              onWear={addCalendarRecord}
              catalog={catalogItems}
              onSave={saveOutfit}
            />
          )}
          {page.type === 'ai-processing' && (
            <AIProcessingPage
              photos={page.photos}
              onComplete={garments => { pop(); push({ type: 'item-review', garments }) }}
            />
          )}
          {page.type === 'item-review' && (
            <ItemReviewPage
              garments={page.garments}
              onBack={pop}
              onComplete={reviewed => {
                addReviewedItems(reviewed)
                localStorage.setItem('styleos.hasWardrobe', 'true')
                setHasWardrobe(true)
                pop()
                push({ type: 'import-complete', count: reviewed.length })
              }}
            />
          )}
          {page.type === 'import-complete' && (
            <ImportCompletePage
              count={page.count}
              onGoWardrobe={() => { setPageStack([]); switchTab('wardrobe') }}
              onGoHome={() => { setPageStack([]); switchTab('home') }}
            />
          )}
        </div>
      ))}

      {/* Outfit detail overlay (from home) */}
      {outfitDetail && (
        <OutfitDetailSheet
          outfit={outfitDetail}
          onClose={() => setOutfitDetail(null)}
          onItemTap={item => { setOutfitDetail(null); push({ type: 'item-detail', item }) }}
          onWear={outfit => {
            const added = addCalendarRecord(outfit)
            if (added) setOutfitDetail(null)
            return added
          }}
        />
      )}

      {/* Profile sub-sheet */}
      {profileSheet && (
        <ProfileSubSheet sheet={profileSheet} items={catalogItems} onClose={() => setProfileSheet(null)} />
      )}

      {/* Create sheet */}
      {showCreate && (
        <CreateSheet
          onClose={() => setShowCreate(false)}
          onAddItem={() => { setShowCreate(false); setShowPhotoPicker(true) }}
          onAIOutfit={() => { setShowCreate(false); push({ type: 'ai-setup' }) }}
          onManualOutfit={() => { setShowCreate(false); push({ type: 'manual-builder' }) }}
        />
      )}

      {/* Photo picker */}
      {showPhotoPicker && (
        <PhotoPickerSheet
          onClose={() => setShowPhotoPicker(false)}
          onConfirm={photos => {
            setShowPhotoPicker(false)
            push({ type: 'ai-processing', photos })
          }}
        />
      )}

      {wearPrompt && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 80, background: 'rgba(0,0,0,.42)', padding: 24, backdropFilter: 'blur(6px)' }}>
          <div style={{ width: '100%', maxWidth: 340, borderRadius: 24, background: 'rgba(255,255,255,.96)', padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
            <h3 style={{ margin: 0, fontSize: 18, color: '#282828' }}>{wearPrompt.same ? '今天已经记录过了' : '替换今天的穿搭？'}</h3>
            <p style={{ margin: '10px 0 20px', fontSize: 14, lineHeight: '21px', color: '#6E6E73' }}>
              {wearPrompt.same ? '这套穿搭已经在今天的穿搭日历中，无需重复添加。' : '今天只能记录一套穿搭。是否用当前这套替换今天已有的记录？'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setWearPrompt(null)} style={{ flex: 1, height: 44, borderRadius: 999, border: '1px solid #DDD', background: '#FFF', color: '#282828' }}>{wearPrompt.same ? '知道了' : '取消'}</button>
              {!wearPrompt.same && <button onClick={() => { persistCalendarRecord(wearPrompt.outfit); setWearPrompt(null); setOutfitDetail(null) }} style={{ flex: 1, height: 44, borderRadius: 999, border: 0, background: '#282828', color: '#FFF', fontWeight: 600 }}>替换记录</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
