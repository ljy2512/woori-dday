import type { DDay } from '../types/dday'
import { COLOR_CONFIG, formatDate } from '../store/DDayContext'

interface Props {
  items: DDay[]
  pastAutoItems: DDay[]
  onSelect: (item: DDay) => void
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

function daysSince(item: DDay): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(item.date + 'T00:00:00')
  target.setHours(0, 0, 0, 0)
  return Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))
}

export default function PastRecord({ items, pastAutoItems, onSelect }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 유저 아이템 중 날짜가 지난 것 (기념일 제외)
  const pastUserItems = items.filter(i => {
    const d = new Date(i.date + 'T00:00:00')
    return !i.isAnnual && d < today
  })

  // 전체 지난 기록 (최근 순)
  const allPast = [
    ...pastAutoItems,
    ...pastUserItems,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (allPast.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="text-center text-[#C4BACC]">
          <div className="mb-4 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C4BACC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12.5 15.5 15" />
              <path d="M3.5 7.5A9 9 0 003 12" />
              <polyline points="1.5 5.5 3.5 7.5 5.5 5.5" />
            </svg>
          </div>
          <p className="text-sm">아직 지난 기록이 없어요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-5">
      {allPast.map(item => {
        const cfg = COLOR_CONFIG[item.color] ?? COLOR_CONFIG.coral
        const since = daysSince(item)
        const d = new Date(item.date + 'T00:00:00')
        const dateStr = formatDate(item.date)
        const dayStr = `${DAYS[d.getDay()]}요일`

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="rounded-2xl p-4 text-left transition active:scale-[0.97]"
            style={{ backgroundColor: cfg.lightBg }}
          >
            {/* 아이콘 */}
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg mb-3"
              style={{ backgroundColor: cfg.color }}
            >
              <span className="text-white text-base">{item.emoji}</span>
            </div>

            {/* 제목 */}
            <div className="text-sm font-bold text-[#48425E] truncate">{item.title}</div>
            <div className="mt-0.5 text-[11px] text-[#A89FB6]">{dateStr} · {dayStr}</div>

            {/* D+ 표시 */}
            <div className="mt-3 text-[1.6rem] font-black leading-none" style={{ color: cfg.color }}>
              D+{since}
            </div>
            <div className="mt-1 text-[11px] text-[#A89FB6]">{since}일 전 함께한 날</div>
          </button>
        )
      })}
    </div>
  )
}
