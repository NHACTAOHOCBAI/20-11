import type { PlayerDetails, Prize } from '../types'

const ENTRY_KEY = 'lucky-wheel-entry-id'
const DETAILS_KEY = 'lucky-wheel-player'
const COMPLETED_KEY = 'lucky-wheel-completed'

export const hasCompletedSpin = () => localStorage.getItem(COMPLETED_KEY) === 'true'
export const getEntryId = () => sessionStorage.getItem(ENTRY_KEY)
export const setActiveSpin = (entryId: string, details: PlayerDetails) => {
  sessionStorage.setItem(ENTRY_KEY, entryId)
  sessionStorage.setItem(DETAILS_KEY, JSON.stringify(details))
}
export const getPlayer = (): PlayerDetails | null => {
  const raw = sessionStorage.getItem(DETAILS_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as PlayerDetails } catch { return null }
}
export const getClientSessionId = () => {
  const key = 'lucky-wheel-client-session'
  let id = sessionStorage.getItem(key)
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(key, id) }
  return id
}
export const markCompleted = (_prize: Prize) => localStorage.setItem(COMPLETED_KEY, 'true')
export const clearActiveSpin = () => {
  sessionStorage.removeItem(ENTRY_KEY)
  sessionStorage.removeItem(DETAILS_KEY)
}
