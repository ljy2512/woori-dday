export type DDayType = 'countdown' | 'anniversary'

export type DDayColor = 'coral' | 'mauve' | 'mint' | 'butter' | 'sky' | 'rose'

export interface DDay {
  id: string
  title: string
  date: string // "YYYY-MM-DD"
  type: DDayType
  color: DDayColor
  emoji: string
  memo: string
  isAnnual: boolean
  createdAt: string
  isAuto?: boolean
}

export interface Profile {
  nameA: string
  nameB: string
  startDate: string // "YYYY-MM-DD" - 사귄 날짜
  birthdayA: string | null
  birthdayB: string | null
  isFirstLaunch: boolean
}
