import { useState } from 'react'
import type { DDay, DDayType, DDayColor } from '../types/dday'
import { COLOR_CONFIG } from '../store/DDayContext'

const TYPE_OPTIONS: { value: DDayType; label: string }[] = [
  { value: 'countdown', label: '디데이 · 남은 날' },
  { value: 'anniversary', label: '기념일 · 함께한 날' },
]

const COLOR_ORDER: DDayColor[] = ['coral', 'mauve', 'mint', 'butter', 'sky', 'rose']

const EMOJI_OPTIONS = ['🎉', '🎂', '✈️', '💍', '🌸', '🍰', '💝', '🎁', '🌹', '✨']

interface Props {
  initial?: DDay
  onSave: (d: DDay) => void
  onClose: () => void
  inline?: boolean
  isAutoItem?: boolean
}

const VALID_COLORS = new Set<DDayColor>(COLOR_ORDER)

export default function AddDDayModal({ initial, onSave, onClose, inline, isAutoItem }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10))
  const [type, setType] = useState<DDayType>(initial?.type ?? 'countdown')
  const [color, setColor] = useState<DDayColor>(
    initial?.color && VALID_COLORS.has(initial.color) ? initial.color : 'coral'
  )
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🎉')
  const [memo, setMemo] = useState(initial?.memo ?? '')
  const [isAnnual, setIsAnnual] = useState(initial?.isAnnual ?? false)

  const isEditing = !!initial
  const cfg = COLOR_CONFIG[color] ?? COLOR_CONFIG.coral

  const emojiList = EMOJI_OPTIONS.includes(emoji)
    ? EMOJI_OPTIONS
    : [emoji, ...EMOJI_OPTIONS.slice(0, 9)]

  function handleSave() {
    if (!title.trim()) return
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      date,
      type,
      color,
      emoji,
      memo,
      isAnnual,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    })
  }

  const card = (
    <div className={`w-full bg-[#FCEAE7] shadow-2xl ${inline ? 'rounded-3xl' : 'rounded-t-3xl'}`}>
      {/* 네비게이션 바 */}
      <div className={`flex items-center justify-between bg-white px-5 py-4 ${inline ? 'rounded-t-3xl' : ''}`}>
        <button onClick={onClose} className="text-sm text-[#A89FB6]">취소</button>
        <span className="text-sm font-black text-[#48425E]">
          {isAutoItem ? '아이콘 & 색상 변경' : isEditing ? '디데이 편집' : '새 디데이'}
        </span>
        <button
          onClick={handleSave}
          disabled={!isAutoItem && !title.trim()}
          className="text-sm font-black text-[#EE898C] disabled:opacity-40"
        >
          저장
        </button>
      </div>

      <div className={`${inline ? '' : 'max-h-[80vh]'} overflow-y-auto pb-10`}>

        {/* 자동 아이템: 제목 표시 (읽기 전용) */}
        {isAutoItem && initial && (
          <div className="mx-5 mt-5 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ backgroundColor: cfg.lightBg }}>
            <span className="text-2xl">{emoji}</span>
            <div>
              <div className="text-sm font-black text-[#48425E]">{initial.title}</div>
              <div className="text-xs text-[#A89FB6]">이모지와 색상만 변경할 수 있어요</div>
            </div>
          </div>
        )}

        {/* 아이콘 */}
        <div className="px-5 pt-4">
          <p className="mb-2 text-xs font-bold text-[#9D8BD0]">아이콘</p>
          <div className="grid grid-cols-5 gap-2">
            {emojiList.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className="flex h-12 items-center justify-center rounded-[13px] text-2xl transition-all active:scale-95"
                style={{
                  backgroundColor: emoji === e ? cfg.color : '#F0EDF8',
                  transform: emoji === e ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* 색상 */}
        <div className="px-5 pt-4">
          <p className="mb-2 text-xs font-bold text-[#9D8BD0]">색상</p>
          <div className="flex gap-3">
            {COLOR_ORDER.map(c => {
              const ccfg = COLOR_CONFIG[c]
              const selected = color === c
              return (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-95"
                  style={{
                    backgroundColor: ccfg.color,
                    transform: selected ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  {selected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 아래는 수동 아이템 전용 필드 */}
        {!isAutoItem && (
          <>
            {/* 타입 세그먼트 */}
            <div className="px-5 pt-4">
              <div className="flex rounded-[14px] bg-[#F0EDF8] p-1">
                {TYPE_OPTIONS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className="flex-1 rounded-[11px] py-2.5 text-xs transition"
                    style={{
                      backgroundColor: type === t.value ? 'white' : 'transparent',
                      color: type === t.value ? '#EE898C' : '#A89FB6',
                      fontWeight: type === t.value ? 900 : 600,
                      boxShadow: type === t.value ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div className="px-5 pt-4">
              <p className="mb-2 text-xs font-bold text-[#9D8BD0]">제목</p>
              <div className="flex items-center gap-2.5 rounded-[14px] border border-[#EFE8E2] bg-white px-4 py-3.5">
                <span className="text-lg">{emoji}</span>
                <input
                  className="flex-1 bg-transparent text-sm font-semibold text-[#48425E] placeholder-[#A89FB6] outline-none"
                  placeholder="디데이 이름"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* 날짜 */}
            <div className="px-5 pt-4">
              <p className="mb-2 text-xs font-bold text-[#9D8BD0]">날짜</p>
              <div className="relative flex items-center justify-between rounded-[14px] border border-[#EFE8E2] bg-white px-4 py-3.5">
                <span className="pointer-events-none text-sm font-semibold text-[#48425E]">
                  {new Date(date + 'T00:00:00').toLocaleDateString('ko-KR', {
                    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
                  })}
                </span>
                <span className="pointer-events-none text-lg" style={{ color: cfg.color }}>📅</span>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="absolute inset-0 w-full cursor-pointer opacity-0"
                />
              </div>
            </div>

            {/* 메모 */}
            <div className="px-5 pt-4">
              <p className="mb-2 text-xs font-bold text-[#9D8BD0]">메모</p>
              <textarea
                className="w-full resize-none rounded-[14px] border border-[#EFE8E2] bg-white px-4 py-3.5 text-sm text-[#48425E] placeholder-[#A89FB6] outline-none"
                rows={3}
                placeholder="오늘의 한마디를 적어보세요"
                value={memo}
                onChange={e => setMemo(e.target.value)}
              />
            </div>

            {/* 매년 반복 */}
            <div className="mx-5 mt-4 flex items-center justify-between rounded-[14px] border border-[#EFE8E2] bg-white px-4 py-3.5">
              <span className="text-sm font-semibold text-[#48425E]">매년 반복</span>
              <button
                onClick={() => setIsAnnual(v => !v)}
                className="relative h-7 w-[46px] rounded-full transition-colors duration-200"
                style={{ backgroundColor: isAnnual ? '#EE898C' : '#E5E0F0' }}
              >
                <div
                  className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200"
                  style={{ transform: isAnnual ? 'translateX(20px)' : 'translateX(2px)' }}
                />
              </button>
            </div>

            {/* 삭제 (편집 시) */}
            {isEditing && (
              <button
                onClick={() => onSave({ ...initial!, _delete: true } as DDay & { _delete: boolean })}
                className="mx-5 mt-6 block text-sm font-semibold text-[#CC4C4C]"
              >
                디데이 삭제
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )

  if (inline) return card

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative w-full max-w-md" onClick={e => e.stopPropagation()}>
        {card}
      </div>
    </div>
  )
}
