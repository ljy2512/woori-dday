import { useDDayStore, daysFromTodayOf, formattedDDayOf, formatDate, COLOR_CONFIG } from '../store/DDayContext'

interface Props {
  onClose: () => void
  onEdit: () => void
  inline?: boolean
}

export default function CoupleProfileView({ onClose, onEdit, inline }: Props) {
  const { profile, combined, totalDaysTogether } = useDDayStore()

  const upcomingTop = combined
    .filter(({ item }) => daysFromTodayOf(item) >= 0)
    .slice(0, 4)

  const card = (
    <div className={`w-full bg-[#FCEAE7] shadow-2xl ${inline ? 'rounded-3xl' : 'rounded-t-3xl'}`}>
      {/* 헤더 */}
      <div className={`flex items-center justify-between bg-white px-5 py-4 ${inline ? 'rounded-t-3xl' : ''}`}>
        <button onClick={onClose} className="text-sm text-[#A89FB6]">닫기</button>
        <span className="text-sm font-black text-[#48425E]">커플 정보</span>
        <button onClick={onEdit} className="text-sm font-black text-[#EE898C]">편집</button>
      </div>

      <div className="overflow-y-auto max-h-[75vh] pb-10">

        {/* 커플 배지 */}
        <div className="flex flex-col items-center pt-8 pb-6">
          {/* 아바타 */}
          <div className="flex items-center mb-4">
            <div
              className="z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-2xl font-black text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #F4A09A, #EE898C)' }}
            >
              {profile.nameA?.[0] ?? '나'}
            </div>
            <div
              className="-ml-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-2xl font-black text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #B9A8E2, #9D8BD0)' }}
            >
              {profile.nameB?.[0] ?? '♥'}
            </div>
          </div>

          {/* 이름 */}
          <div className="text-[18px] font-black text-[#48425E]">
            {profile.nameA || '이름'}{profile.nameB ? ` ♥ ${profile.nameB}` : ''}
          </div>
          {profile.startDate && (
            <div className="mt-1 text-xs text-[#A89FB6]">{formatDate(profile.startDate)}부터</div>
          )}

          {/* D+ 카운터 */}
          <div
            className="mt-5 w-40 rounded-3xl py-5 text-center text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #F4A09A, #EE898C)', boxShadow: '0 10px 24px rgba(238,137,140,0.4)' }}
          >
            <div className="text-[11px] font-bold tracking-widest text-white/80">TOGETHER</div>
            <div className="text-[2.8rem] font-black leading-none">D+{totalDaysTogether}</div>
            <div className="mt-1 text-[11px] text-white/80">{totalDaysTogether}일 함께했어요 💕</div>
          </div>
        </div>

        {/* 다가오는 날 */}
        {upcomingTop.length > 0 && (
          <div className="mx-5 mb-4">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="text-sm">📌</span>
              <span className="text-xs font-black text-[#48425E]">다가오는 날</span>
            </div>
            <div className="rounded-2xl bg-white overflow-hidden">
              {upcomingTop.map(({ item }, idx) => {
                const cfg = COLOR_CONFIG[item.color] ?? COLOR_CONFIG.coral
                const days = daysFromTodayOf(item)
                return (
                  <div
                    key={item.id}
                    className={`flex items-center px-4 py-3 ${idx < upcomingTop.length - 1 ? 'border-b border-[#F0EAF8]' : ''}`}
                  >
                    <div
                      className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
                      style={{ backgroundColor: cfg.lightBg }}
                    >
                      <span>{item.emoji}</span>
                    </div>
                    <span className="flex-1 text-[13px] font-bold text-[#48425E]">{item.title}</span>
                    <span className="text-[13px] font-black" style={{ color: cfg.color }}>
                      {formattedDDayOf(item)}
                    </span>
                    <span className="ml-2 text-[11px] text-[#A89FB6]">{days}일 후</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 생일 */}
        {(profile.birthdayA || profile.birthdayB) && (
          <div className="mx-5 mb-4">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="text-sm">🎂</span>
              <span className="text-xs font-black text-[#48425E]">생일</span>
            </div>
            <div className="rounded-2xl bg-white overflow-hidden">
              {profile.birthdayA && (
                <div className={`flex items-center px-4 py-3 ${profile.birthdayB ? 'border-b border-[#F0EAF8]' : ''}`}>
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white" style={{ background: 'linear-gradient(135deg, #F4A09A, #EE898C)' }}>
                    {profile.nameA?.[0]}
                  </div>
                  <span className="flex-1 text-[13px] font-bold text-[#48425E]">{profile.nameA}</span>
                  <span className="text-[13px] text-[#A89FB6]">{formatDate(profile.birthdayA)}</span>
                </div>
              )}
              {profile.birthdayB && (
                <div className="flex items-center px-4 py-3">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white" style={{ background: 'linear-gradient(135deg, #B9A8E2, #9D8BD0)' }}>
                    {profile.nameB?.[0]}
                  </div>
                  <span className="flex-1 text-[13px] font-bold text-[#48425E]">{profile.nameB}</span>
                  <span className="text-[13px] text-[#A89FB6]">{formatDate(profile.birthdayB)}</span>
                </div>
              )}
            </div>
          </div>
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
