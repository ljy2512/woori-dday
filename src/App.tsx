import { useState } from 'react'
import {
  useDDayStore,
  daysFromTodayOf,
  formattedDDayOf,
  formatDate,
  effectiveDateOf,
  COLOR_CONFIG,
} from './store/DDayContext'
import { deletePhotos } from './store/photoStorage'
import type { DDay } from './types/dday'
import DDayRow from './components/DDayRow'
import AddDDayModal from './components/AddDDayModal'
import DetailPage from './components/DetailPage'
import ProfileSetupSheet from './components/ProfileSetupSheet'
import CoupleProfileView from './components/CoupleProfileView'
import SplashScreen from './components/SplashScreen'
import PastRecord from './components/PastRecord'
import MomentsGallery from './components/MomentsGallery'
import './index.css'

type Section = 'upcoming' | 'past' | 'moments'

const NAV: { id: Section; label: string }[] = [
  { id: 'upcoming', label: '다가오는 날' },
  { id: 'past',     label: '지난 기록'   },
  { id: 'moments',  label: '함께한 순간' },
]

function NavIcon({ section, active, size = 22 }: { section: Section; active: boolean; size?: number }) {
  const c = active ? '#EE898C' : '#B0A8C0'
  const sw = 2
  if (section === 'upcoming') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2.5" fill={active ? 'rgba(238,137,140,0.12)' : 'none'} />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <path d="M12 18s-4-2.6-4-5.5a2.8 2.8 0 015.6 0 2.8 2.8 0 015.6 0C19.2 15.4 15.5 18 12 18z"
        fill={active ? '#EE898C' : 'none'} stroke={c} strokeWidth={1.6} />
    </svg>
  )
  if (section === 'past') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" fill={active ? 'rgba(238,137,140,0.12)' : 'none'} />
      <polyline points="12 7 12 12.5 15.5 15" />
      <path d="M3.5 7.5A9 9 0 013 12" strokeWidth={1.8} />
      <polyline points="1.5 5.5 3.5 7.5 5.5 5.5" />
    </svg>
  )
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h3.5L8 4h8l1.5 2H21a2 2 0 012 2z"
        fill={active ? 'rgba(238,137,140,0.12)' : 'none'} />
      <circle cx="12" cy="13" r="4" fill={active ? '#EE898C' : 'none'} stroke={c} />
    </svg>
  )
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function App() {
  const {
    items, autoItems, pastAutoItems, combined, profile,
    add, update, remove, setAutoOverride,
    totalDaysTogether, nextCountdownItem,
  } = useDDayStore()

  const [selectedId,  setSelectedId]  = useState<string | null>(null)
  const [editing,     setEditing]     = useState<DDay | null>(null)
  const [showAdd,     setShowAdd]     = useState(false)
  const [showSplash,  setShowSplash]  = useState(true)
  const [showMenu,    setShowMenu]    = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>('upcoming')

  const selectedEntry = selectedId
    ? combined.find(({ item }) => item.id === selectedId) ?? null
    : null

  const displayNameA = profile.nameA ? profile.nameA[0] : '나'
  const displayNameB = profile.nameB ? profile.nameB[0] : ''

  const progress = (() => {
    if (!nextCountdownItem || !profile.nameA) return 0
    const nextDays = daysFromTodayOf(nextCountdownItem)
    const total = totalDaysTogether + nextDays
    return total > 0 ? Math.min(totalDaysTogether / total, 1) : 1
  })()

  function handleSelectItem(item: DDay) {
    setEditing(item)
  }

  function handleRowTap(item: DDay) { handleSelectItem(item) }

  function handleSave(d: DDay & { _delete?: boolean }) {
    const isAutoItem = autoItems.some(a => a.id === d.id) || pastAutoItems.some(a => a.id === d.id)
    if (d._delete) {
      deletePhotos(d.id)
      remove(d.id)
      setEditing(null)
      setSelectedId(null)
    } else if (isAutoItem) {
      setAutoOverride(d.id.replace('auto-past-', 'auto-'), d.emoji, d.color)
      setEditing(null)
    } else {
      update(d)
      setEditing(null)
    }
  }

  function selectSection(s: Section) {
    setActiveSection(s)
    setSelectedId(null)
  }

  // ── 히어로 카드 ────────────────────────────────────────────────────────
  const HeroCard = (
    <>
      {profile.isFirstLaunch || !profile.nameA ? (
        <button
          onClick={() => setShowProfile(true)}
          className="w-full rounded-3xl p-5 text-left text-white"
          style={{ background: 'linear-gradient(135deg, #F4A09A, #EE898C)', boxShadow: '0 14px 30px rgba(238,137,140,0.45)' }}
        >
          <div className="flex items-center gap-3.5">
            <span className="text-[22px]">💑</span>
            <div className="flex-1">
              <div className="text-[15px] font-black">우리 정보를 입력해주세요</div>
              <div className="mt-0.5 text-[11.5px] text-white/80">이름과 사귄 날짜를 설정하면 D+일수가 표시돼요</div>
            </div>
            <span className="text-lg text-white/70">›</span>
          </div>
        </button>
      ) : (
        <div
          className="w-full rounded-3xl px-5 py-[17px] text-white"
          style={{ background: 'linear-gradient(135deg, #F4A09A, #EE898C)', boxShadow: '0 14px 30px rgba(238,137,140,0.45)' }}
        >
          <div className="text-[12.5px] font-bold text-white/85">우리 함께한 지</div>
          <div className="mt-0.5 flex items-baseline gap-2.5">
            <span className="text-[43px] font-bold leading-none">D+{totalDaysTogether}</span>
            <span className="text-[11.5px] text-white/80">{formatDate(profile.startDate)}부터</span>
          </div>
          {nextCountdownItem && (
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/30">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress * 100}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between">
                <span className="text-[11px] text-white/80">{nextCountdownItem.title}까지</span>
                <span className="text-[11px] font-black">{formattedDDayOf(nextCountdownItem)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )

  // ── 다가오는 날 카드 그리드 (데스크탑 우측 패널) ─────────────────────
  const UpcomingGrid = (
    <div className="p-5">
      {combined.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center text-[#C4BACC]">
            <div className="mb-4 flex items-center justify-center">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#C4BACC" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-8-5.3-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.7-8 11-8 11z" />
                <path d="M9 21s-5-3.5-5-7.5a3 3 0 016 0" strokeDasharray="2 2" />
                <path d="M15 21s5-3.5 5-7.5a3 3 0 00-6 0" strokeDasharray="2 2" />
              </svg>
            </div>
            <p className="text-sm">+ 버튼을 눌러 첫 번째 디데이를 추가해봐요</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {combined.map(({ item, isAuto }) => {
            const cfg = COLOR_CONFIG[item.color] ?? COLOR_CONFIG.coral
            const d = effectiveDateOf(item)
            const dateStr = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`
            const days = daysFromTodayOf(item)
            const isUrgent = days >= 0 && days <= 14
            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="rounded-2xl p-4 text-left transition active:scale-[0.97]"
                style={{ backgroundColor: cfg.lightBg }}
              >
                {/* 아이콘 */}
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-base mb-3"
                  style={{ backgroundColor: cfg.color }}
                >
                  <span className="text-white">{item.emoji}</span>
                </div>
                {isAuto && (
                  <span className="mb-1 inline-block rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] font-bold text-[#9D8BD0]">자동</span>
                )}
                {/* D-Day 수치 */}
                <div className="text-[1.7rem] font-black leading-none" style={{ color: cfg.color }}>
                  {formattedDDayOf(item)}
                </div>
                {/* 제목 */}
                <div className="mt-2 text-[13px] font-bold text-[#48425E] truncate">{item.title}</div>
                {/* 날짜 */}
                <div className="mt-0.5 text-[11px]" style={{ color: isUrgent ? '#EE898C' : '#A89FB6' }}>
                  {dateStr} · {DAYS[d.getDay()]}요일
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )

  // ── 모바일 리스트 ─────────────────────────────────────────────────────
  const MobileList = (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-base font-black text-[#48425E]">다가오는 날</span>
      </div>
      {combined.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#A89FB6]">
          + 버튼을 눌러 첫 번째 디데이를 추가해봐요
        </p>
      ) : (
        <div>
          {combined.map(({ item, isAuto }, idx) => (
            <div key={item.id}>
              <DDayRow
                item={item}
                isAuto={isAuto}
                onTap={() => handleRowTap(item)}
                isSelected={selectedId === item.id}
              />
              {idx < combined.length - 1 && (
                <div className="border-t border-[#E8E0F0]" style={{ marginLeft: '56px' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-[#FCEAE7]">

      <div className="md:flex md:h-screen md:overflow-hidden">

        {/* ════ LEFT SIDEBAR ════ */}
        <div className="flex flex-col md:w-[320px] md:shrink-0 md:h-screen md:overflow-hidden md:border-r md:border-[#E5DEFA] bg-[#FCEAE7]">

          {/* 헤더 */}
          <header style={{ background: 'linear-gradient(160deg, #9890B4, #847BA0)' }}>
            <div className="px-5 pt-14 pb-10 md:pt-8 md:pb-6">
              {/* 네비게이션 바 */}
              <div className="flex items-center justify-between mb-5">
                <button onClick={() => setShowMenu(true)} className="p-1 text-white/70">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <svg width="22" height="22" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(143.36 317.44) rotate(-11 250.88 250.88) scale(20.906)">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F4A09A"/>
                    </g>
                    <g transform="translate(327.68 245.76) rotate(11 281.6 281.6) scale(23.466)">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white" stroke="#9890B450" strokeWidth="1"/>
                    </g>
                  </svg>
                  <span className="text-[22px] font-black text-white">우리</span>
                </div>
                <button onClick={() => setShowProfile(true)} className="p-1 text-white/70">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                  </svg>
                </button>
              </div>

              {/* 커플 정보 */}
              {!profile.isFirstLaunch && profile.nameA && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex shrink-0 items-center">
                    <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-black text-white" style={{ background: 'linear-gradient(135deg, #F4A09A, #EE898C)' }}>
                      {displayNameA}
                    </div>
                    {profile.nameB && (
                      <div className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-black text-white" style={{ background: 'linear-gradient(135deg, #9890B4, #847BA0)' }}>
                        {displayNameB}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-white">
                      {profile.nameA}{profile.nameB ? ` ♥ ${profile.nameB}` : ''}
                    </div>
                    <div className="text-[11px] text-white/70">{formatDate(profile.startDate)}부터</div>
                  </div>
                </div>
              )}

              {/* 히어로 카드 */}
              <div className="md:block" style={{ marginBottom: profile.isFirstLaunch ? '0' : '0' }}>
                {HeroCard}
              </div>
            </div>
          </header>

          {/* ── 데스크탑 전용: 네비게이션 ── */}
          <nav className="hidden md:block px-3 py-4 border-b border-[#E5DEFA]">
            {NAV.map(nav => (
              <button
                key={nav.id}
                onClick={() => selectSection(nav.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-bold transition mb-0.5"
                style={{
                  backgroundColor: activeSection === nav.id ? '#EE898C18' : 'transparent',
                  color: activeSection === nav.id ? '#EE898C' : '#A89FB6',
                }}
              >
                <NavIcon section={nav.id} active={activeSection === nav.id} size={20} />
                <span>{nav.label}</span>
                {nav.id === 'upcoming' && combined.length > 0 && (
                  <span className="ml-auto rounded-full text-[11px] font-black px-2 py-0.5 text-white" style={{ backgroundColor: '#EE898C' }}>
                    {combined.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* ── 모바일 콘텐츠 영역 ── */}
          <div className="md:hidden flex-1 overflow-y-auto pb-28">
            {activeSection === 'upcoming' && (
              <div className="px-[18px] pt-[42px]">{MobileList}</div>
            )}
            {activeSection === 'past' && (
              <div>
                <div className="px-[18px] pt-[42px] pb-3">
                  <span className="text-base font-black text-[#48425E]">지난 기록</span>
                </div>
                <PastRecord
                  items={items}
                  pastAutoItems={pastAutoItems}
                  onSelect={item => setSelectedId(item.id)}
                />
              </div>
            )}
            {activeSection === 'moments' && (
              <div>
                <div className="px-[18px] pt-[42px] pb-3">
                  <span className="text-base font-black text-[#48425E]">함께한 순간</span>
                </div>
                <MomentsGallery
                  items={[...pastAutoItems, ...autoItems, ...items]}
                  onSelect={item => handleSelectItem(item)}
                />
              </div>
            )}
          </div>

          {/* ── 데스크탑 추가 버튼 ── */}
          <div className="hidden md:block px-4 py-4 border-t border-[#E5DEFA] bg-[#FCEAE7]">
            <button
              onClick={() => setShowAdd(true)}
              className="w-full rounded-2xl py-3 text-sm font-bold text-white transition active:scale-95"
              style={{ background: 'linear-gradient(135deg, #F4A09A, #EE898C)' }}
            >
              + 새 디데이 추가
            </button>
          </div>
        </div>

        {/* ════ RIGHT PANEL (데스크탑 전용) ════ */}
        <div className="hidden md:flex md:flex-1 md:flex-col md:h-screen md:overflow-hidden bg-white">
          {showMenu ? (
            <div className="flex items-center justify-center h-full bg-[#FAF8FF] p-8 overflow-y-auto">
              <div className="w-full max-w-md">
                <CoupleProfileView
                  onClose={() => setShowMenu(false)}
                  onEdit={() => { setShowMenu(false); setShowProfile(true) }}
                  inline
                />
              </div>
            </div>
          ) : showProfile ? (
            <div className="flex items-center justify-center h-full bg-[#FAF8FF] p-8 overflow-y-auto">
              <div className="w-full max-w-md">
                <ProfileSetupSheet
                  isOnboarding={profile.isFirstLaunch}
                  onClose={() => setShowProfile(false)}
                  inline
                />
              </div>
            </div>
          ) : showAdd ? (
            <div className="flex items-center justify-center h-full bg-[#FAF8FF] p-8 overflow-y-auto">
              <div className="w-full max-w-md">
                <AddDDayModal
                  onSave={d => { add(d as DDay); setShowAdd(false); setSelectedId(d.id) }}
                  onClose={() => setShowAdd(false)}
                  inline
                />
              </div>
            </div>
          ) : editing ? (
            <div className="flex items-center justify-center h-full bg-[#FAF8FF] p-8 overflow-y-auto">
              <div className="w-full max-w-md">
                <AddDDayModal
                  initial={editing}
                  onSave={handleSave as (d: DDay) => void}
                  onClose={() => setEditing(null)}
                  isAutoItem={autoItems.some(a => a.id === editing.id) || pastAutoItems.some(a => a.id === editing.id)}
                  inline
                />
              </div>
            </div>
          ) : selectedEntry ? (
            <DetailPage
              item={selectedEntry.item}
              isAuto={selectedEntry.isAuto}
              onEdit={() => !selectedEntry.isAuto && setEditing(selectedEntry.item)}
              onClose={() => setSelectedId(null)}
            />
          ) : activeSection === 'upcoming' ? (
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-[22px] font-black text-[#48425E]">다가오는 날</h2>
                <p className="text-[12px] text-[#A89FB6] mt-0.5">소중한 날들이 기다리고 있어요</p>
              </div>
              {UpcomingGrid}
            </div>
          ) : activeSection === 'past' ? (
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-[22px] font-black text-[#48425E]">지난 기록</h2>
                <p className="text-[12px] text-[#A89FB6] mt-0.5">함께 지나온 소중한 날들</p>
              </div>
              <PastRecord
                items={items}
                pastAutoItems={pastAutoItems}
                onSelect={item => setSelectedId(item.id)}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-[22px] font-black text-[#48425E]">함께한 순간</h2>
                <p className="text-[12px] text-[#A89FB6] mt-0.5">사진을 눌러 칸을 채워보세요</p>
              </div>
              <MomentsGallery
                items={[...pastAutoItems, ...autoItems, ...items]}
                onSelect={item => handleSelectItem(item)}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── 모바일 상세 페이지 오버레이 ── */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto bg-[#FCEAE7] md:hidden"
          style={{ animation: 'slideUp 0.25s ease-out' }}
        >
          <DetailPage
            item={selectedEntry.item}
            isAuto={selectedEntry.isAuto}
            onEdit={() => !selectedEntry.isAuto && setEditing(selectedEntry.item)}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}

      {/* ── 모바일 하단 탭 바 ── */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden z-30 flex items-center bg-white/90 backdrop-blur border-t border-[#EDE5F5]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV.map(nav => (
          <button
            key={nav.id}
            onClick={() => selectSection(nav.id)}
            className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-3 transition-colors"
          >
            <NavIcon section={nav.id} active={activeSection === nav.id} size={24} />
            <span
              className="text-[10px] font-bold"
              style={{ color: activeSection === nav.id ? '#EE898C' : '#B0A8C0' }}
            >
              {nav.label}
            </span>
            {activeSection === nav.id && (
              <div className="absolute bottom-0 h-[2.5px] w-8 rounded-full" style={{ backgroundColor: '#EE898C' }} />
            )}
          </button>
        ))}
        {/* 가운데 FAB */}
        <button
          onClick={() => setShowAdd(true)}
          className="mx-3 h-12 w-12 shrink-0 rounded-full text-2xl font-semibold text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #F4A09A, #EE898C)', boxShadow: '0 8px 18px rgba(238,137,140,0.5)' }}
        >
          +
        </button>
      </nav>

      {/* ── 추가 모달 (모바일 전용) ── */}
      {showAdd && window.innerWidth < 768 && (
        <AddDDayModal
          onSave={d => { add(d as DDay); setShowAdd(false) }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* ── 편집 모달 (모바일 전용) ── */}
      {editing && window.innerWidth < 768 && (
        <AddDDayModal
          initial={editing}
          onSave={handleSave as (d: DDay) => void}
          onClose={() => setEditing(null)}
        />
      )}

      {/* ── 모바일 메뉴 오버레이 ── */}
      {showMenu && window.innerWidth < 768 && (
        <CoupleProfileView
          onClose={() => setShowMenu(false)}
          onEdit={() => { setShowMenu(false); setShowProfile(true) }}
        />
      )}

      {/* ── 온보딩 오버레이 (첫 실행 - 모바일 전용) ── */}
      {showProfile && profile.isFirstLaunch && window.innerWidth < 768 && (
        <ProfileSetupSheet
          isOnboarding={true}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* ── 모바일 프로필 오버레이 (재편집) ── */}
      {showProfile && !profile.isFirstLaunch && window.innerWidth < 768 && (
        <ProfileSetupSheet
          isOnboarding={false}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* ── 스플래시 (첫 실행) ── */}
      {showSplash && (
        <SplashScreen onStart={() => {
          setShowSplash(false)
          if (profile.isFirstLaunch) setShowProfile(true)
        }} />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}
