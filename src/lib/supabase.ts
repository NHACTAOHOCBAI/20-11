import { createClient } from '@supabase/supabase-js'
import type { GameProgress, PlayerDetails } from '../types'
import { getClientSessionId } from './storage'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = url && anonKey ? createClient(url, anonKey) : null

const missingConfig = 'Chưa cấu hình Supabase. Hãy tạo file .env từ .env.example.'

export async function createPendingSpin(details: PlayerDetails) {
  if (!supabase) throw new Error(missingConfig)
  const id = crypto.randomUUID()
  const { error } = await supabase
    .from('spin_entries')
    .insert({ id, ...details, status: 'in_progress', current_game: 'wheel', game_results: [], total_value: 0, client_session_id: getClientSessionId() })
  if (error) throw error
  return id
}

export async function saveGameProgress(entryId: string, progress: GameProgress, isComplete = false) {
  if (!supabase) throw new Error(missingConfig)
  const total = progress.results.reduce((sum, result) => sum + result.prize.value, 0)
  const update = {
    current_game: progress.currentGame,
    game_results: progress.results,
    total_value: total,
    status: isComplete ? 'completed' : 'in_progress',
    ...(isComplete ? { prize_id: 'total-3-games', prize_label: 'Tổng tiền 3 trò', prize_value: total, completed_at: new Date().toISOString() } : {}),
  }
  const { error } = await supabase.from('spin_entries').update(update).eq('id', entryId)
  if (error) throw error
}
