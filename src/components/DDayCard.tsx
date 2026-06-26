import type { DDay } from '../types/dday'
import { calcDDay, formatDDay } from '../store/useDDayStore'

const COLOR_MAP: Record<string, string> = {
  coral: 'linear-gradient(135deg, #F4A09A, #EE898C)',
  mauve: 'linear-gradient(135deg, #9890B4, #847BA0)',
  mint: 'linear-gradient(135deg, #85C1AE, #6BAE9A)',
  sky: 'linear-gradient(135deg, #89B8D4, #6DA5C2)',
  peach: 'linear-gradient(135deg, #F4C09A, #EEA87C)',
}

interface Props {
  item: DDay
  onTap: () => void
}

export default function DDayCard({ item, onTap }: Props) {
  const diff = calcDDay(item.date)
  const label = formatDDay(diff)
  const bg = COLOR_MAP[item.color] ?? COLOR_MAP.coral

  return (
    <button
      onClick={onTap}
      className="w-full rounded-2xl p-4 text-left text-white shadow-md active:scale-95 transition-transform"
      style={{ background: bg }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl mb-1">{item.emoji}</div>
          <div className="text-base font-bold opacity-95">{item.title}</div>
          <div className="text-xs opacity-75 mt-0.5">
            {new Date(item.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black tracking-tight">{label}</div>
        </div>
      </div>
    </button>
  )
}
