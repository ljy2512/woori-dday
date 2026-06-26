import { daysFromTodayOf, formattedDDayOf, effectiveDateOf, COLOR_CONFIG } from '../store/DDayContext'
import type { DDay } from '../types/dday'

interface Props {
  item: DDay
  isAuto: boolean
  onTap: () => void
  isSelected?: boolean
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function DDayRow({ item, isAuto, onTap, isSelected }: Props) {
  const cfg = COLOR_CONFIG[item.color] ?? COLOR_CONFIG.coral
  const d = effectiveDateOf(item)
  const days = daysFromTodayOf(item)
  const isUrgent = days >= 0 && days <= 14
  const label = formattedDDayOf(item)

  const dateDisplay = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  const dayLabel = item.isAnnual ? '매년' : `${DAYS[d.getDay()]}요일`

  return (
    <button
      onClick={onTap}
      className="flex w-full items-center gap-3 py-[13px] text-left rounded-xl transition-colors"
      style={isSelected ? { backgroundColor: cfg.lightBg } : undefined}
    >
      {/* 이모지 아이콘 */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-xl"
        style={{ backgroundColor: cfg.lightBg }}
      >
        {item.emoji}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[14.5px] font-bold text-[#48425E] truncate">{item.title}</span>
          {isAuto && (
            <span className="shrink-0 rounded-full bg-[#E7E2F7] px-1.5 py-0.5 text-[10px] font-bold text-[#9D8BD0]">
              자동
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[11.5px] text-[#A89FB6]">
          {dateDisplay} · {dayLabel}
        </div>
      </div>

      {/* D-Day 뱃지 */}
      <div
        className={`shrink-0 text-[13px] font-black ${isUrgent ? 'rounded-full px-3 py-1' : ''}`}
        style={isUrgent
          ? { backgroundColor: '#EE898C', color: 'white' }
          : { color: cfg.color }
        }
      >
        {label}
      </div>
    </button>
  )
}
