import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { GameChrome, GameResultCard } from '../components/GameChrome'
import { gameNames, prizes } from '../config'
import { saveGameProgress } from '../lib/supabase'
import { getEntryId, getPlayer, getProgress, setProgress } from '../lib/storage'
import type { GameResult, Prize } from '../types'

function weightedPrize(items: Prize[]) { const total = items.reduce((sum, prize) => sum + prize.weight, 0); let cursor = Math.random() * total; return items.find((prize) => (cursor -= prize.weight) <= 0) ?? items[0] }

export default function WheelPage() {
  const navigate = useNavigate(); const entryId = getEntryId(); const player = getPlayer(); const [initialProgress] = useState(() => getProgress())
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'saving' | 'result' | 'error'>('idle')
  const [result, setResult] = useState<GameResult | null>(null); const [rotation, setRotation] = useState(0); const [error, setError] = useState('')
  const wheelStyle = useMemo(() => ({ transform: `rotate(${rotation}deg)`, background: `conic-gradient(${prizes.map((item, index) => `${item.color} ${index * 60}deg ${(index + 1) * 60}deg`).join(', ')})` }), [rotation])
  useEffect(() => { if (!entryId || !player) navigate('/', { replace: true }); else if (initialProgress.currentGame !== 'wheel') navigate(`/game/${initialProgress.currentGame}`, { replace: true }) }, [entryId, player, initialProgress.currentGame, navigate])
  if (!entryId || !player) return <Navigate to="/" replace />
  const activeEntryId = entryId

  async function saveResult(selected: Prize) {
    setPhase('saving'); const nextResult = { gameId: 'wheel' as const, gameName: gameNames.wheel, prize: selected }; const progress = { currentGame: 'cards' as const, results: [...getProgress().results, nextResult] }
    try { await saveGameProgress(activeEntryId, progress); setProgress(progress); setResult(nextResult); setPhase('result') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa thể lưu kết quả. Vui lòng thử lại.'); setResult(nextResult); setPhase('error') }
  }
  function spin() { const selected = weightedPrize(prizes); const index = prizes.findIndex((item) => item.id === selected.id); setPhase('spinning'); setRotation((old) => old + 2160 + (360 - index * 60 - 30)); window.setTimeout(() => saveResult(selected), 4700) }
  return <AppShell><div className="wheel-page"><GameChrome gameId="wheel" results={initialProgress.results}>
    {phase === 'result' && result ? <GameResultCard result={result} nextLabel="Lật thẻ tiếp theo" onNext={() => navigate('/game/cards')} /> : <>
      <div className="wheel-heading"><h1>Chúc {player.participant_name} gặp nhiều may mắn</h1><span>Chạm vào tâm vòng quay để bắt đầu.</span></div>
      <div className="wheel-wrap"><div className="wheel-pointer" /><div className="wheel" style={wheelStyle}>{prizes.map((item, index) => <div className="wheel-slice" key={item.id} style={{ '--i': index } as CSSProperties}><b>{item.label}</b></div>)}</div><button className="spin-center" disabled={phase !== 'idle'} onClick={spin}><span>{phase === 'idle' ? 'QUAY' : '...'}</span></button></div>
      {phase !== 'idle' && <div className="wheel-bottom">{phase === 'spinning' && <p className="status-text">Vận may đang xoay...</p>}{phase === 'saving' && <p className="status-text">Đang ghi nhận phần quà của chị...</p>}{phase === 'error' && <div className="retry-box"><p>{error}</p><button onClick={() => result && saveResult(result.prize)}>Thử lưu lại</button></div>}</div>}
    </>}
  </GameChrome></div></AppShell>
}
