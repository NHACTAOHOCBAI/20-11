import { createClient } from '@supabase/supabase-js'
import type { PlayerDetails, Prize } from '../types'
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
    .insert({ id, ...details, status: 'pending', client_session_id: getClientSessionId() })
  if (error) throw error
  return id
}

export async function completeSpin(entryId: string, prize: Prize) {
  if (!supabase) throw new Error(missingConfig)
  const { error } = await supabase
    .from('spin_entries')
    .update({ status: 'completed', prize_id: prize.id, prize_label: prize.label, prize_value: prize.value, completed_at: new Date().toISOString() })
    .eq('id', entryId)
  if (error) throw error
}
