import { useState, useRef, useEffect } from 'react'
import type { DDay } from '../types/dday'
import {
  daysFromTodayOf,
  formattedDDayOf,
  effectiveDateOf,
  COLOR_CONFIG,
} from '../store/DDayContext'
import { loadPhotos, savePhotos, resizeImage } from '../store/photoStorage'

interface Props {
  item: DDay
  isAuto: boolean
  onEdit: () => void
  onClose: () => void
}

function fmtEffectiveDate(item: DDay) {
  const d = effectiveDateOf(item)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${days[d.getDay()]})`
}

export default function DetailPage({ item, isAuto, onEdit, onClose }: Props) {
  const cfg = COLOR_CONFIG[item.color] ?? COLOR_CONFIG.coral
  const d = daysFromTodayOf(item)
  const label = formattedDDayOf(item)
  const fileRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<string[]>(() => loadPhotos(item.id))
  const [activePhoto, setActivePhoto] = useState<number | null>(null)

  useEffect(() => {
    savePhotos(item.id, photos)
  }, [photos, item.id])

  // 사진 추가
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    const resized = await Promise.all(files.map(f => resizeImage(f)))
    setPhotos(prev => [...prev, ...resized])
    e.target.value = ''
  }

  // 부제목 계산
  const subtitle = (() => {
    if (item.type === 'anniversary') {
      return `${Math.abs(d)}일 함께했어요 💕`
    }
    if (d > 0) {
      // 함께한 날수도 함께 표시 (과거 시작일이 있는 경우)
      const past = daysFromTodayOf({ date: item.date, isAnnual: false })
      if (past < 0) return `${Math.abs(past)}일 함께했어요 · ${d}일 남음`
      return `${d}일 남았어요`
    }
    if (d === 0) return '오늘이에요! 🎉'
    return `${Math.abs(d)}일 지났어요`
  })()

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#FCEAE7]">

      {/* 상단 네비게이션 */}
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-xl font-bold"
          style={{ backgroundColor: cfg.lightBg, color: cfg.color }}
        >
          ‹
        </button>
        <span className="text-[14px] font-black text-[#48425E]">
          {item.emoji} {item.title}
        </span>
        {!isAuto ? (
          <button
            onClick={onEdit}
            className="rounded-full px-3 py-1.5 text-xs font-bold"
            style={{ backgroundColor: cfg.lightBg, color: cfg.color }}
          >
            편집
          </button>
        ) : <div className="w-9" />}
      </div>

      {/* D-Day 원형 배지 */}
      <div className="flex flex-col items-center pb-8 pt-4">
        {/* 링 */}
        <div
          className="relative flex h-44 w-44 items-center justify-center rounded-full bg-white"
          style={{
            border: `5px solid ${cfg.color}`,
            boxShadow: `0 0 0 12px ${cfg.lightBg}, 0 12px 40px ${cfg.color}28`,
          }}
        >
          <div className="text-center">
            <div className="text-[10px] font-bold tracking-[0.2em]" style={{ color: cfg.color + '99' }}>
              D-DAY
            </div>
            <div className="text-[2.2rem] font-black leading-none" style={{ color: cfg.color }}>
              {label}
            </div>
            <div className="mt-1.5 text-[11px] text-[#A89FB6]">{fmtEffectiveDate(item)}</div>
          </div>
        </div>

        {/* 제목 · 부제목 */}
        <div className="mt-6 text-center px-6">
          <div className="text-2xl font-black text-[#48425E]">
            {item.emoji} {item.title}
          </div>
          <div className="mt-2 text-sm text-[#A89FB6]">{subtitle}</div>
        </div>
      </div>

      {/* 흰색 컨텐츠 카드 */}
      <div className="flex-1 rounded-t-3xl bg-white px-5 pt-6 pb-10">

        {/* 메모 */}
        {item.memo ? (
          <div className="mb-6 rounded-2xl p-4" style={{ backgroundColor: cfg.lightBg }}>
            <div className="mb-2 flex items-center gap-2">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-white"
                style={{ backgroundColor: cfg.color }}
              >
                ✉
              </div>
              <span className="text-xs font-bold text-[#A89FB6]">메모</span>
            </div>
            <p className="text-sm leading-relaxed text-[#48425E]">{item.memo}</p>
          </div>
        ) : null}

        {/* 함께한 순간 */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-black text-[#48425E]">함께한 순간</span>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: cfg.color }}
            >
              +
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {photos.length === 0 ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-10 text-sm font-semibold transition"
              style={{ borderColor: cfg.color + '60', color: cfg.color }}
            >
              <span className="text-xl">📷</span>
              사진 추가하기
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square"
                  onClick={() => setActivePhoto(activePhoto === idx ? null : idx)}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full rounded-2xl object-cover"
                  />
                  {activePhoto === idx && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setPhotos(p => p.filter((_, i) => i !== idx))
                          setActivePhoto(null)
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => fileRef.current?.click()}
                className="flex aspect-square items-center justify-center rounded-2xl text-2xl font-bold transition"
                style={{ backgroundColor: cfg.lightBg, color: cfg.color }}
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* 디데이 편집 버튼 */}
        {!isAuto && (
          <button
            onClick={onEdit}
            className="w-full rounded-2xl py-4 text-base font-bold text-white transition active:scale-[0.98]"
            style={{ backgroundColor: cfg.color }}
          >
            디데이 편집
          </button>
        )}
      </div>
    </div>
  )
}
