import { useState, useEffect } from 'react'
import type { DDay } from '../types/dday'
import { COLOR_CONFIG, formatDate } from '../store/DDayContext'
import { loadPhotos } from '../store/photoStorage'

interface Props {
  items: DDay[]
  onSelect: (item: DDay) => void
}

function PhotoSlot({ item, onSelect }: { item: DDay; onSelect: () => void }) {
  const cfg = COLOR_CONFIG[item.color] ?? COLOR_CONFIG.coral
  const [firstPhoto, setFirstPhoto] = useState<string | null>(null)

  useEffect(() => {
    const photos = loadPhotos(item.id)
    setFirstPhoto(photos[0] ?? null)
  }, [item.id])

  return (
    <button onClick={onSelect} className="text-left group">
      {/* 사진 영역 */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{ aspectRatio: '4/3' }}
      >
        {firstPhoto ? (
          <img src={firstPhoto} alt="" className="w-full h-full object-cover" />
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full gap-2 p-3"
            style={{ backgroundColor: cfg.lightBg }}
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-[11px] text-center font-semibold" style={{ color: cfg.color }}>
              {item.title}
            </span>
            <span className="text-[10px] text-[#B0A8C2]">사진 추가하기</span>
          </div>
        )}
      </div>

      {/* 라벨 */}
      <div className="mt-2 px-0.5">
        <div className="text-[13px] font-bold text-[#48425E] truncate">{item.title}</div>
        <div className="text-[11px] text-[#A89FB6]">{formatDate(item.date)}</div>
      </div>
    </button>
  )
}

export default function MomentsGallery({ items, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="text-center text-[#C4BACC]">
          <div className="mb-4 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C4BACC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h3.5L8 4h8l1.5 2H21a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <p className="text-sm">디데이를 추가하면 사진을 기록할 수 있어요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5">
      <p className="mb-4 text-xs text-[#A89FB6]">사진을 눌러 함께한 순간을 채워보세요</p>
      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <PhotoSlot key={item.id} item={item} onSelect={() => onSelect(item)} />
        ))}
      </div>
    </div>
  )
}
