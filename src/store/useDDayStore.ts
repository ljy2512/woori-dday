import { useState, useEffect } from 'react'
import type { DDay } from '../types/dday'

const STORAGE_KEY = 'dday-items'

function load(): DDay[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(items: DDay[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useDDayStore() {
  const [items, setItems] = useState<DDay[]>(load)

  useEffect(() => {
    save(items)
  }, [items])

  function add(item: DDay) {
    setItems(prev => [item, ...prev])
  }

  function update(updated: DDay) {
    setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)))
  }

  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const sorted = [...items].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return { items: sorted, add, update, remove }
}

export function calcDDay(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDDay(diff: number): string {
  if (diff === 0) return 'D-Day'
  if (diff > 0) return `D-${diff}`
  return `D+${Math.abs(diff)}`
}
