import blueJeans from './assets/garments/blue-jeans.png'
import blackLeatherJacket from './assets/garments/black-leather-jacket.png'
import leatherDenimOutfit from './assets/garments/leather-denim-outfit.png'

export interface ClothingItem {
  id: string; name: string; type: string; subtype: string; styles: string[]; colors: string[]
  material: string; seasons: string[]; image: string; favorite: boolean; lastWornDays: number; wornCount: number
}

export interface Outfit {
  id: string; itemIds: string[]; tags: string[]; scene: string; season: string; coverImage: string
  wornCount: number; aiReason: string; favorite: boolean; weatherTag: string
}

export const items: ClothingItem[] = [
  {
    id: 'jeans-01', name: '浅蓝色高腰直筒牛仔裤', type: '下装', subtype: '牛仔裤',
    styles: ['休闲', '复古', '街头'], colors: ['浅蓝', '靛蓝'], material: '棉质牛仔布',
    seasons: ['春', '夏', '秋'], image: blueJeans, favorite: true, lastWornDays: 0, wornCount: 0,
  },
  {
    id: 'jacket-01', name: '黑色机车皮夹克', type: '外套', subtype: '皮夹克',
    styles: ['街头', '酷感', '复古'], colors: ['黑色', '银色'], material: '皮革',
    seasons: ['春', '秋', '冬'], image: blackLeatherJacket, favorite: true, lastWornDays: 0, wornCount: 0,
  },
]

export const outfits: Outfit[] = [
  {
    id: 'outfit-01', itemIds: ['jacket-01', 'jeans-01'], tags: ['街头', '复古', '休闲'],
    scene: '日常出街', season: '春秋', coverImage: leatherDenimOutfit, wornCount: 0,
    aiReason: '黑色机车皮夹克与浅蓝高腰直筒牛仔裤形成清晰的深浅对比。两件单品都带有复古街头属性，适合日常出街和轻松聚会。',
    favorite: true, weatherTag: '18–24℃',
  },
]

export const getItemById = (id: string): ClothingItem | undefined => items.find(item => item.id === id)
export const getOutfitItems = (outfit: Outfit, catalog: ClothingItem[] = items): ClothingItem[] =>
  outfit.itemIds.map(id => catalog.find(item => item.id === id)).filter(Boolean) as ClothingItem[]

export interface CalendarRecord { date: string; outfitId: string; coverImage: string; tags: string[] }
export const mockCalendarRecords: CalendarRecord[] = []
