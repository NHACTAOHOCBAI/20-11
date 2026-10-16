import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { GameChrome, GameResultCard } from '../components/GameChrome'
import ResultModal from '../components/ResultModal'
import { gameNames, piggyPrizes } from '../config'
import { saveGameProgress } from '../lib/supabase'
import { clearActiveSpin, getEntryId, getPlayer, getProgress, setProgress } from '../lib/storage'
import type { GameResult, Prize } from '../types'

function pickPrize(items: Prize[]) { const total = items.reduce((sum, item) => sum + item.weight, 0); let point = Math.random() * total; return items.find((item) => (point -= item.weight) <= 0) ?? items[0] }

export default function PiggyGamePage() {
  const navigate = useNavigate(); const entryId = getEntryId(); const player = getPlayer(); const [initial] = useState(() => getProgress())
  const [hits, setHits] = useState(0); const [results, setResults] = useState(initial.results); const [pendingResult, setPendingResult] = useState<GameResult | null>(null); const [showTotal, setShowTotal] = useState(false); const [error, setError] = useState('')
  useEffect(() => { if (!entryId || !player) navigate('/', { replace: true }); else if (initial.currentGame !== 'piggy') navigate(`/game/${initial.currentGame}`, { replace: true }) }, [entryId, player, initial.currentGame, navigate])
  if (!entryId || !player) return <Navigate to="/" replace />
  const activeEntryId = entryId
  async function commit(nextResult: GameResult) {
    const progress = { currentGame: 'piggy' as const, results: [...getProgress().results, nextResult] }
    try { await saveGameProgress(activeEntryId, progress, true); setProgress(progress); setResults(progress.results); setPendingResult(null); setError('') }
    catch (cause) { setPendingResult(nextResult); setError(cause instanceof Error ? cause.message : 'Chưa thể lưu kết quả. Vui lòng thử lại.') }
  }
  function hitPiggy() {
    if (hits >= 3) return
    const nextHits = hits + 1; setHits(nextHits)
    if (nextHits === 3) void commit({ gameId: 'piggy', gameName: gameNames.piggy, prize: pickPrize(piggyPrizes) })
  }
  const piggyResult = results.find((result) => result.gameId === 'piggy')
  return <AppShell><main className="mini-game-page"><GameChrome gameId="piggy" results={results}>
    <header className="mini-game-heading"><p>Trò 3 · Đập heo</p><h1>Đập heo nhận quà</h1><span>Chạm 3 lần để mở phần quà cuối cùng.</span></header>
    <button className={`piggy-bank hit-${hits}`} disabled={hits >= 3} onClick={hitPiggy} aria-label="Đập heo"><span className="piggy-ear ear-left" /><span className="piggy-ear ear-right" /><span className="piggy-face"><i /><i /></span><span className="piggy-coin">₫</span><span className="crack crack-one" /><span className="crack crack-two" /></button>
    <p className="hit-count">{hits}/3 lần đập</p>{error && <div className="game-error">{error}<button onClick={() => pendingResult && commit(pendingResult)}>Thử lưu lại</button></div>}
    {piggyResult && !showTotal && <GameResultCard result={piggyResult} nextLabel="Xem tổng tiền thưởng" onNext={() => setShowTotal(true)} />}
    {showTotal && <ResultModal player={player} results={results} onClose={() => { clearActiveSpin(); navigate('/', { replace: true }) }} />}
  </GameChrome></main></AppShell>
}
