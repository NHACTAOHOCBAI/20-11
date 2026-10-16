import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import AppShell from '../components/AppShell'
import ResultModal from '../components/ResultModal'
import { prizes } from '../config'
import { completeSpin } from '../lib/supabase'
import { clearActiveSpin, getEntryId, getPlayer } from '../lib/storage'
import type { Prize } from '../types'

function weightedPrize(): Prize { const total = prizes.reduce((sum, prize) => sum + prize.weight, 0); let cursor = Math.random() * total; return prizes.find((p) => (cursor -= p.weight) <= 0) ?? prizes[0] }

export default function WheelPage() {
  const navigate = useNavigate(); const entryId = getEntryId(); const player = getPlayer()
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'saving' | 'error' | 'done'>('idle')
  const [prize, setPrize] = useState<Prize | null>(null); const [rotation, setRotation] = useState(0); const [error, setError] = useState('')
  const wheelStyle = useMemo(() => ({
    transform: `rotate(${rotation}deg)`,
    background: `conic-gradient(${prizes.map((item, index) => `${item.color} ${index * 60}deg ${(index + 1) * 60}deg`).join(', ')})`,
  }), [rotation])
  useEffect(() => { if (!entryId || !player) navigate('/', { replace: true }) }, [entryId, player, navigate])
  if (!entryId || !player) return <Navigate to="/" replace />
  const activeEntryId = entryId

  async function persistResult(selected: Prize) {
    setPhase('saving'); setError('')
    try { await completeSpin(activeEntryId, selected); setPhase('done') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa thể lưu kết quả. Vui lòng thử lại.'); setPhase('error') }
  }
  function spin() { const selected = weightedPrize(); setPrize(selected); setPhase('spinning'); const index = prizes.findIndex((p) => p.id === selected.id); setRotation((old) => old + 2160 + (360 - index * 60 - 30)); window.setTimeout(() => persistResult(selected), 4700) }
  function closeResult() { clearActiveSpin(); navigate('/', { replace: true }) }
  return <AppShell><div className="wheel-page">
    <div className="wheel-heading"><p>Vòng quay may mắn 20/10</p><h1>Chúc {player.participant_name} gặp nhiều may mắn</h1><span>Chạm vào tâm vòng quay để bắt đầu.</span></div>
    <div className="wheel-wrap"><div className="wheel-pointer" /><div className={`wheel ${phase === 'spinning' ? 'is-spinning' : ''}`} style={wheelStyle}>{prizes.map((item, index) => <div className="wheel-slice" key={item.id} style={{ '--i': index, '--color': item.color } as CSSProperties}><b>{item.label}</b></div>)}</div><button className="spin-center" disabled={phase !== 'idle'} onClick={spin}><span>{phase === 'idle' ? 'QUAY' : '...'}</span></button></div>
    <div className="wheel-bottom">{phase === 'idle' && <button className="spin-cta" onClick={spin}><Sparkles size={17} /> Quay thưởng ngay</button>}{phase === 'spinning' && <p className="status-text">Vận may đang xoay...</p>}{phase === 'saving' && <p className="status-text">Đang ghi nhận phần quà của bạn...</p>}{phase === 'error' && <div className="retry-box"><p>{error}</p><button onClick={() => prize && persistResult(prize)}>Thử lưu lại</button></div>}</div>
    {phase === 'done' && prize && <ResultModal player={player} prize={prize} onClose={closeResult} />}
  </div></AppShell>
}
