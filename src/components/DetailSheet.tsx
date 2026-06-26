import type { DDay } from '../types/dday'
import { daysFromTodayOf, formattedDDayOf, formatDate, COLOR_CONFIG } from '../store/DDayContext'

interface Props {
  item: DDay
  isAuto: boolean
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export default function DetailSheet({ item, isAuto, onEdit, onDelete, onClose }: Props) {
  const cfg = COLOR_CONFIG[item.color] ?? COLOR_CONFIG.coral
  const d = daysFromTodayOf(item)
  const label = formattedDDayOf(item)
  const dateStr = formatDate(item.date)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-t-3xl bg-white pb-10 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 컬러 헤더 */}
        <div className="px-5 pt-5 pb-8 text-white" style={{ backgroundColor: cfg.color }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={onClose} className="text-white/80 text-xl">←</button>
            {!isAuto && (
              <button onClick={onEdit} className="text-sm font-black text-white">편집</button>
            )}
          </div>
          <div className="text-center">
            <div className="text-5xl mb-2">{item.emoji}</div>
            <div className="text-xl font-bold">{item.title}</div>
            <div className="text-sm text-white/75 mt-1">{dateStr}</div>
            {item.isAnnual && <div className="text-xs text-white/60 mt-0.5">매년 반복</div>}
          </div>
        </div>

        {/* D-Day 원형 배지 */}
        <div className="flex justify-center -mt-7">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white text-xl font-black text-white shadow-lg"
            style={{ backgroundColor: cfg.color }}
          >
            {label}
          </div>
        </div>

        {/* 메모 */}
        {item.memo ? (
          <div className="mx-5 mt-5 rounded-2xl bg-[#FCEAE7] p-4 text-sm text-[#48425E]">
            <div className="mb-1 text-xs text-[#A89FB6]">메모</div>
            {item.memo}
          </div>
        ) : null}

        {/* 날짜 안내 */}
        <div className="mx-5 mt-3 rounded-2xl bg-[#F0EDF8] p-4 text-sm text-center text-[#9D8BD0]">
          {d === 0 && <span className="font-bold">오늘이 바로 그 날! 🎉</span>}
          {d > 0 && <span>앞으로 <span className="font-black text-[#EE898C]">{d}일</span> 남았어요</span>}
          {d < 0 && item.type === 'anniversary' && <span><span className="font-black">{Math.abs(d)}일</span> 함께했어요 💕</span>}
          {d < 0 && item.type === 'countdown' && <span><span className="font-black">{Math.abs(d)}일</span> 지났어요</span>}
        </div>

        {/* 삭제 */}
        {!isAuto && (
          <button
            onClick={onDelete}
            className="mx-5 mt-4 w-[calc(100%-2.5rem)] rounded-2xl border border-[#EE898C]/40 py-3 text-sm text-[#EE898C] transition hover:bg-[#FFF0EF]"
          >
            삭제하기
          </button>
        )}
      </div>
    </div>
  )
}
