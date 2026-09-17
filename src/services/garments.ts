export interface GarmentSuggestions {
  name?: string
  category?: string
  subcategory?: string
  colors?: string[]
  colorHexes?: string[]
  styles?: string[]
  material?: string
  seasons?: string[]
  confidence?: number
}

export interface ProcessedGarment {
  originalUrl: string
  processedImageUrl: string
  suggestions: GarmentSuggestions
  processingMode?: 'ai' | 'manual-review'
}

const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')

export async function processGarment(photoUrl: string): Promise<ProcessedGarment> {
  if (!apiBase) {
    return {
      originalUrl: photoUrl,
      processedImageUrl: photoUrl,
      processingMode: 'manual-review',
      suggestions: {
        name: '待确认单品',
        category: '上衣',
        subcategory: '待确认',
        colors: ['灰色'],
        colorHexes: ['#8E8E93'],
        styles: ['日常'],
        material: '待确认',
        seasons: ['四季'],
        confidence: 0,
      },
    }
  }
  const blob = await fetch(photoUrl).then(response => response.blob())
  const form = new FormData()
  form.append('image', blob, `garment-${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`)
  const response = await fetch(`${apiBase}/garments/process`, { method: 'POST', body: form })
  if (!response.ok) throw new Error((await response.text()) || '衣物处理失败')
  return { ...(await response.json()), processingMode: 'ai' }
}

export async function processGarments(photoUrls: string[]) {
  return Promise.all(photoUrls.map(processGarment))
}
