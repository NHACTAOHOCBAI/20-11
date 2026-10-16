import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Flower2 } from 'lucide-react'
import AppShell from '../components/AppShell'
import { GameChrome, GameResultCard } from '../components/GameChrome'
import { cardPrizes, gameNames } from '../config'
import { saveGameProgress } from '../lib/supabase'
import { getEntryId, getPlayer, getProgress, setProgress } from '../lib/storage'
import type { GameResult, Prize } from '../types'

function pickPrize(items: Prize[]) { const total = items.reduce((sum, item) => sum + item.weight, 0); let point = Math.random() * total; return items.find((item) => (point -= item.weight) <= 0) ?? items[0] }

export default function CardGamePage() {
  const navigate = useNavigate(); const entryId = getEntryId(); const player = getPlayer(); const [initial] = useState(() => getProgress())
  const [picked, setPicked] = useState<number | null>(null); const [result, setResult] = useState<GameResult | null>(null); const [pendingResult, setPendingResult] = useState<GameResult | null>(null); const [error, setError] = useState('')
  useEffect(() => { if (!entryId || !player) navigate('/', { replace: true }); else if (initial.currentGame !== 'cards') navigate(`/game/${initial.currentGame}`, { replace: true }) }, [entryId, player, initial.currentGame, navigate])
  if (!entryId || !player) return <Navigate to="/" replace />
  const activeEntryId = entryId
  async function commit(nextResult: GameResult) {
    const progress = { currentGame: 'piggy' as const, results: [...getProgress().results, nextResult] }
    try { await saveGameProgress(activeEntryId, progress); setProgress(progress); setResult(nextResult); setPendingResult(null); setError('') }
    catch (cause) { setPendingResult(nextResult); setError(cause instanceof Error ? cause.message : 'Chưa thể lưu kết quả. Vui lòng thử lại.') }
  }
  function choose(index: number) {
    if (picked !== null) return
    setPicked(index); void commit({ gameId: 'cards', gameName: gameNames.cards, prize: pickPrize(cardPrizes) })
  }
  return <AppShell><main className="mini-game-page"><GameChrome gameId="cards" results={initial.results}>
    {result ? <GameResultCard result={result} nextLabel="Chơi đập heo" onNext={() => navigate('/game/piggy')} /> : <><header className="mini-game-heading"><p>Trò 2 · Lật thẻ</p><h1>Chọn một tấm thẻ may mắn</h1><span>Chị chỉ có một lựa chọn.</span></header><div className="card-grid">{Array.from({ length: 6 }, (_, index) => <button key={index} className={`lucky-card ${picked === index ? 'is-picked' : ''}`} disabled={picked !== null} onClick={() => choose(index)} aria-label={`Lật thẻ ${index + 1}`}><Flower2 size={30} /><span>20/10</span></button>)}</div>{error && <div className="game-error">{error}<button onClick={() => pendingResult && commit(pendingResult)}>Thử lưu lại</button></div>}</>}
  </GameChrome></main></AppShell>
}
