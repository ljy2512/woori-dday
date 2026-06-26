import { useState } from 'react'
import { useDDayStore } from '../store/DDayContext'

interface Props {
  isOnboarding: boolean
  onClose: () => void
  inline?: boolean
}

export default function ProfileSetupSheet({ isOnboarding, onClose, inline }: Props) {
  const { profile, saveProfile } = useDDayStore()
  const [nameA, setNameA] = useState(profile.nameA)
  const [nameB, setNameB] = useState(profile.nameB)
  const [startDate, setStartDate] = useState(profile.startDate)
  const [birthdayA, setBirthdayA] = useState(profile.birthdayA ?? '')
  const [birthdayB, setBirthdayB] = useState(profile.birthdayB ?? '')

  function handleSave() {
    if (!nameA.trim() || !nameB.trim()) return
    saveProfile({
      nameA: nameA.trim(),
      nameB: nameB.trim(),
      startDate,
      birthdayA: birthdayA || null,
      birthdayB: birthdayB || null,
    })
    onClose()
  }

  const inputCls = 'w-full rounded-[14px] border border-[#EFE8E2] bg-white px-4 py-3 text-sm text-[#48425E] placeholder-[#A89FB6] outline-none focus:ring-2 focus:ring-[#F4A09A]'
  const labelCls = 'mb-1.5 block text-xs font-bold text-[#9D8BD0]'

  const content = (
    <div className={`w-full bg-[#FCEAE7] shadow-2xl ${inline ? 'rounded-3xl' : 'rounded-t-3xl'} overflow-hidden`}>
      {/* 핸들 (모바일 바텀시트 전용) */}
      {!inline && (
        <div className="flex justify-center pt-3 pb-0">
          <div className="h-1 w-10 rounded-full bg-[#E5E0F0]" />
        </div>
      )}

      {/* 헤더 */}
      <div className={`flex items-center justify-between px-5 py-4 bg-white ${inline ? 'rounded-t-3xl' : ''}`}>
        {(!isOnboarding || inline)
          ? <button onClick={onClose} className="text-sm text-[#A89FB6]">취소</button>
          : <div />
        }
        <span className="text-sm font-black text-[#48425E]">
          {isOnboarding ? '우리 정보 입력' : '프로필 설정'}
        </span>
        <button
          onClick={handleSave}
          disabled={!nameA.trim() || !nameB.trim()}
          className="text-sm font-black text-[#EE898C] disabled:opacity-40"
        >
          저장
        </button>
      </div>

      <div className="overflow-y-auto max-h-[75vh] px-5 pt-5 pb-10 space-y-4">
        {/* 이름 */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelCls}>내 이름</label>
            <input className={inputCls} placeholder="이름" value={nameA} onChange={e => setNameA(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className={labelCls}>상대방 이름</label>
            <input className={inputCls} placeholder="이름" value={nameB} onChange={e => setNameB(e.target.value)} />
          </div>
        </div>

        {/* 사귄 날짜 */}
        <div>
          <label className={labelCls}>사귄 날짜</label>
          <input
            type="date"
            className={inputCls}
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        {/* 생일 */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelCls}>내 생일 (선택)</label>
            <input
              type="date"
              className={inputCls}
              value={birthdayA}
              onChange={e => setBirthdayA(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className={labelCls}>상대방 생일 (선택)</label>
            <input
              type="date"
              className={inputCls}
              value={birthdayB}
              onChange={e => setBirthdayB(e.target.value)}
            />
          </div>
        </div>

        {isOnboarding && (
          <button
            onClick={handleSave}
            disabled={!nameA.trim() || !nameB.trim()}
            className="w-full rounded-2xl py-4 text-base font-bold text-white transition disabled:opacity-40 mt-2"
            style={{ background: 'linear-gradient(135deg, #F4A09A, #EE898C)' }}
          >
            시작하기 💕
          </button>
        )}
      </div>
    </div>
  )

  if (inline) return content

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {!isOnboarding && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      )}
      <div className="relative w-full max-w-md">
        {content}
      </div>
    </div>
  )
}
