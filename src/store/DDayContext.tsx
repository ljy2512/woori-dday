import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { DDay, Profile } from '../types/dday'

const ITEMS_KEY = 'dday-items-v2'
const PROFILE_KEY = 'dday-profile-v2'
const AUTO_CUSTOM_KEY = 'dday-auto-custom-v1'

type AutoOverrides = Record<string, { emoji: string; color: string }>

function normalizeAutoId(id: string): string {
  return id.replace('auto-past-', 'auto-')
}

export const COLOR_CONFIG: Record<string, { color: string; lightBg: string }> = {
  coral:  { color: '#EE898C', lightBg: '#FCDDD8' },
  mauve:  { color: '#9D8BD0', lightBg: '#E7E2F7' },
  mint:   { color: '#7FC9AE', lightBg: '#D8EFE4' },
  butter: { color: '#F2C879', lightBg: '#FBF0D0' },
  sky:    { color: '#7FB4D9', lightBg: '#CFE5F3' },
  rose:   { color: '#E59CC0', lightBg: '#F7D7EB' },
}

const defaultProfile: Profile = {
  nameA: '',
  nameB: '',
  startDate: new Date().toISOString().slice(0, 10),
  birthdayA: null,
  birthdayB: null,
  isFirstLaunch: true,
}

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function effectiveDateOf(item: { date: string; isAnnual: boolean }): Date {
  const base = new Date(item.date + 'T00:00:00')
  if (!item.isAnnual) return base
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const next = new Date(today.getFullYear(), base.getMonth(), base.getDate())
  if (next < today) next.setFullYear(next.getFullYear() + 1)
  return next
}

export function daysFromTodayOf(item: { date: string; isAnnual: boolean }): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = effectiveDateOf(item)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function formattedDDayOf(item: { date: string; isAnnual: boolean; type: string }): string {
  if (item.type === 'anniversary') return `D+${Math.abs(daysFromTodayOf(item))}`
  const d = daysFromTodayOf(item)
  if (d === 0) return 'D-Day'
  if (d > 0) return `D-${d}`
  return `D+${Math.abs(d)}`
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function shortDayOfWeekOf(item: { date: string; isAnnual: boolean }): string {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return days[effectiveDateOf(item).getDay()]
}

function nextBirthdayStr(dateStr: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const base = new Date(dateStr + 'T00:00:00')
  let next = new Date(today.getFullYear(), base.getMonth(), base.getDate())
  if (next < today) next = new Date(today.getFullYear() + 1, base.getMonth(), base.getDate())
  return next.toISOString().slice(0, 10)
}

function computeAutoItems(profile: Profile, userItems: DDay[]): DDay[] {
  if (profile.isFirstLaunch || !profile.nameA) return []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(profile.startDate + 'T00:00:00')
  start.setHours(0, 0, 0, 0)
  if (start > today) return []

  const userTitles = new Set(userItems.map(i => i.title))
  const result: DDay[] = []

  const daysTogether = Math.round((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  // 100일 단위 마일스톤
  let milestone = (Math.floor(daysTogether / 100) + 1) * 100
  for (let i = 0; i < 3; i++, milestone += 100) {
    const title = `${milestone}일`
    if (!userTitles.has(title)) {
      const d = new Date(start)
      d.setDate(d.getDate() + milestone)
      result.push({
        id: `auto-days-${milestone}`,
        title,
        date: d.toISOString().slice(0, 10),
        emoji: '🎉',
        color: 'coral',
        isAnnual: false,
        type: 'countdown',
        memo: '',
        createdAt: '',
        isAuto: true,
      })
    }
  }

  // 주년
  const yearsTogether = Math.floor(daysTogether / 365)
  for (let yr = yearsTogether + 1; yr <= yearsTogether + 3; yr++) {
    const title = `${yr}주년`
    if (!userTitles.has(title)) {
      const d = new Date(start.getFullYear() + yr, start.getMonth(), start.getDate())
      result.push({
        id: `auto-year-${yr}`,
        title,
        date: d.toISOString().slice(0, 10),
        emoji: '💍',
        color: 'mauve',
        isAnnual: false,
        type: 'countdown',
        memo: '',
        createdAt: '',
        isAuto: true,
      })
    }
  }

  // 생일
  if (profile.birthdayA) {
    const title = `${profile.nameA} 생일`
    if (!userTitles.has(title)) {
      result.push({
        id: 'auto-birthday-a',
        title,
        date: nextBirthdayStr(profile.birthdayA),
        emoji: '🎂',
        color: 'rose',
        isAnnual: true,
        type: 'countdown',
        memo: '',
        createdAt: '',
        isAuto: true,
      })
    }
  }

  if (profile.birthdayB) {
    const title = `${profile.nameB} 생일`
    if (!userTitles.has(title)) {
      result.push({
        id: 'auto-birthday-b',
        title,
        date: nextBirthdayStr(profile.birthdayB),
        emoji: '🎂',
        color: 'butter',
        isAnnual: true,
        type: 'countdown',
        memo: '',
        createdAt: '',
        isAuto: true,
      })
    }
  }

  return result
    .filter(i => daysFromTodayOf(i) >= 0)
    .sort((a, b) => daysFromTodayOf(a) - daysFromTodayOf(b))
}

function computePastAutoItems(profile: Profile): DDay[] {
  if (profile.isFirstLaunch || !profile.nameA) return []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(profile.startDate + 'T00:00:00')
  start.setHours(0, 0, 0, 0)
  if (start >= today) return []

  const daysTogether = Math.round((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const result: DDay[] = []

  // 지난 100일 마일스톤
  for (let m = 100; m <= Math.floor(daysTogether / 100) * 100; m += 100) {
    const d = new Date(start)
    d.setDate(d.getDate() + m)
    result.push({ id: `auto-past-days-${m}`, title: `${m}일`, date: d.toISOString().slice(0, 10), emoji: '🎉', color: 'coral', isAnnual: false, type: 'anniversary', memo: '', createdAt: '', isAuto: true })
  }

  // 지난 주년
  for (let yr = 1; yr <= Math.floor(daysTogether / 365); yr++) {
    const d = new Date(start.getFullYear() + yr, start.getMonth(), start.getDate())
    if (d < today) {
      result.push({ id: `auto-past-year-${yr}`, title: `${yr}주년`, date: d.toISOString().slice(0, 10), emoji: '💍', color: 'mauve', isAnnual: false, type: 'anniversary', memo: '', createdAt: '', isAuto: true })
    }
  }

  return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

interface DDayContextValue {
  items: DDay[]
  autoItems: DDay[]
  pastAutoItems: DDay[]
  combined: Array<{ item: DDay; isAuto: boolean }>
  profile: Profile
  add: (item: DDay) => void
  update: (item: DDay) => void
  remove: (id: string) => void
  saveProfile: (p: Omit<Profile, 'isFirstLaunch'>) => void
  setAutoOverride: (id: string, emoji: string, color: string) => void
  totalDaysTogether: number
  nextCountdownItem: DDay | null
}

const DDayContext = createContext<DDayContextValue | null>(null)

export function DDayProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<DDay[]>(() => loadStorage(ITEMS_KEY, []))
  const [profile, setProfile] = useState<Profile>(() => loadStorage(PROFILE_KEY, defaultProfile))
  const [autoOverrides, setAutoOverridesState] = useState<AutoOverrides>(() => loadStorage(AUTO_CUSTOM_KEY, {}))

  useEffect(() => { localStorage.setItem(ITEMS_KEY, JSON.stringify(items)) }, [items])
  useEffect(() => { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)) }, [profile])
  useEffect(() => { localStorage.setItem(AUTO_CUSTOM_KEY, JSON.stringify(autoOverrides)) }, [autoOverrides])

  function setAutoOverride(id: string, emoji: string, color: string) {
    setAutoOverridesState(prev => ({ ...prev, [id]: { emoji, color } }))
  }

  function add(item: DDay) {
    setItems(prev => [...prev, item].sort((a, b) => daysFromTodayOf(a) - daysFromTodayOf(b)))
  }

  function update(updated: DDay) {
    setItems(prev =>
      prev.map(i => i.id === updated.id ? updated : i)
          .sort((a, b) => daysFromTodayOf(a) - daysFromTodayOf(b))
    )
  }

  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function saveProfile(p: Omit<Profile, 'isFirstLaunch'>) {
    setProfile({ ...p, isFirstLaunch: false })
  }

  const autoItems = useMemo(() => computeAutoItems(profile, items).map(item => {
    const ov = autoOverrides[item.id]
    return ov ? { ...item, emoji: ov.emoji, color: ov.color as DDay['color'] } : item
  }), [profile, items, autoOverrides])

  const pastAutoItems = useMemo(() => computePastAutoItems(profile).map(item => {
    const ov = autoOverrides[normalizeAutoId(item.id)]
    return ov ? { ...item, emoji: ov.emoji, color: ov.color as DDay['color'] } : item
  }), [profile, autoOverrides])

  const combined = useMemo(() => [
    ...items.map(item => ({ item, isAuto: false })),
    ...autoItems.map(item => ({ item, isAuto: true })),
  ].sort((a, b) => daysFromTodayOf(a.item) - daysFromTodayOf(b.item)), [items, autoItems])

  const totalDaysTogether = profile.isFirstLaunch || !profile.nameA
    ? 0
    : Math.abs(daysFromTodayOf({ date: profile.startDate, isAnnual: false }))

  const nextCountdownItem = useMemo(() =>
    combined.find(({ item }) => item.type === 'countdown' && daysFromTodayOf(item) >= 0)?.item ?? null,
    [combined]
  )

  return (
    <DDayContext.Provider value={{
      items, autoItems, pastAutoItems, combined, profile,
      add, update, remove, saveProfile, setAutoOverride,
      totalDaysTogether, nextCountdownItem,
    }}>
      {children}
    </DDayContext.Provider>
  )
}

export function useDDayStore() {
  const ctx = useContext(DDayContext)
  if (!ctx) throw new Error('useDDayStore must be used within DDayProvider')
  return ctx
}
