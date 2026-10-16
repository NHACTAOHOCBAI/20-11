import type { GameProgress, MemoryGameState, PlayerDetails } from '../types'

const ENTRY_KEY = 'lucky-wheel-entry-id'
const DETAILS_KEY = 'lucky-wheel-player'
const PROGRESS_KEY = 'lucky-wheel-progress'
const MEMORY_GAME_KEY = 'lucky-wheel-memory-game'
export const getEntryId = () => sessionStorage.getItem(ENTRY_KEY)
export const setActiveSpin = (entryId: string, details: PlayerDetails) => {
  sessionStorage.setItem(ENTRY_KEY, entryId)
  sessionStorage.setItem(DETAILS_KEY, JSON.stringify(details))
  setProgress({ currentGame: 'wheel', results: [] })
  sessionStorage.removeItem(MEMORY_GAME_KEY)
}
export const getProgress = (): GameProgress => {
  const raw = sessionStorage.getItem(PROGRESS_KEY)
  if (!raw) return { currentGame: 'wheel', results: [] }
  try { return JSON.parse(raw) as GameProgress } catch { return { currentGame: 'wheel', results: [] } }
}
export const setProgress = (progress: GameProgress) => sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
export const getMemoryGameState = (): MemoryGameState | null => {
  const raw = sessionStorage.getItem(MEMORY_GAME_KEY)
  if (!raw) return null
  try {
    const state = JSON.parse(raw) as MemoryGameState
    return { ...state, flippedCardIds: [] }
  } catch {
    return null
  }
}
export const setMemoryGameState = (state: MemoryGameState) => sessionStorage.setItem(MEMORY_GAME_KEY, JSON.stringify(state))
export const clearMemoryGameState = () => sessionStorage.removeItem(MEMORY_GAME_KEY)
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
export const clearActiveSpin = () => {
  sessionStorage.removeItem(ENTRY_KEY)
  sessionStorage.removeItem(DETAILS_KEY)
  sessionStorage.removeItem(PROGRESS_KEY)
  sessionStorage.removeItem(MEMORY_GAME_KEY)
}
