import { type ClothingItem, type Outfit, getOutfitItems } from '../mockData'

interface Props {
  outfit: Outfit
  catalog?: ClothingItem[]
  className?: string
  style?: React.CSSProperties
}

export default function OutfitComposition({ outfit, catalog, className, style }: Props) {
  const pieces = getOutfitItems(outfit, catalog)
  return (
    <div className={className} style={{ position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden', background: '#EEEAE3', ...style }}>
      {pieces.map((item, index) => {
        const layouts = [
          { width: '70%', height: '56%', left: '4%', top: '3%', rotate: '-3deg', zIndex: 2 },
          { width: '62%', height: '67%', right: '3%', bottom: '1%', rotate: '3deg', zIndex: 1 },
          { width: '42%', height: '38%', left: '4%', bottom: '5%', rotate: '-5deg', zIndex: 3 },
          { width: '36%', height: '32%', right: '5%', top: '8%', rotate: '5deg', zIndex: 4 },
        ]
        const layout = layouts[index % layouts.length]
        return <img key={item.id} src={item.image} alt={item.name} style={{ position: 'absolute', objectFit: 'contain', transform: `rotate(${layout.rotate})`, filter: 'drop-shadow(0 8px 12px rgba(40,40,40,.08))', ...layout }} />
      })}
    </div>
  )
}
