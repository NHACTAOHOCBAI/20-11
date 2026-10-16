import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CircleDot, Flower2, Gem, Gift, Heart, Mail, Sparkles, Star, type LucideIcon } from 'lucide-react'
import AppShell from '../components/AppShell'
import { GameChrome, GameResultCard } from '../components/GameChrome'
import { formatMoney, gameNames, memoryConsolationValue, memoryPairRewards } from '../config'
import { saveGameProgress } from '../lib/supabase'
import { clearMemoryGameState, getEntryId, getMemoryGameState, getPlayer, getProgress, setMemoryGameState, setProgress } from '../lib/storage'
import type { GameResult, MemoryCard, MemoryGameState, MemoryReward, Prize } from '../types'

const icons: Record<string, LucideIcon> = {
  flower: Flower2,
  gift: Gift,
  heart: Heart,
  sparkle: Sparkles,
  gem: Gem,
  mail: Mail,
  star: Star,
  seal: CircleDot,
}
const pairIcons = Object.keys(icons)

function shuffle<T>(items: T[]) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

function createGameState(): MemoryGameState {
  const deck = shuffle(pairIcons.flatMap((pairId) => [0, 1].map((copy) => ({ id: `${pairId}-${copy}`, pairId, icon: pairId }))))
  return { deck, flippedCardIds: [], matchedPairIds: [], wrongAttempts: 0, rewards: [], finished: false }
}

function totalFor(rewards: MemoryReward[]) {
  return memoryConsolationValue + rewards.reduce((total, reward) => total + reward.value, 0)
}

export default function CardGamePage() {
  const navigate = useNavigate()
  const entryId = getEntryId()
  const player = getPlayer()
  const [initial] = useState(() => getProgress())
  const [game, setGame] = useState<MemoryGameState>(() => getMemoryGameState() ?? createGameState())
  const [isResolving, setIsResolving] = useState(false)
  const [result, setResult] = useState<GameResult | null>(null)
  const [pendingResult, setPendingResult] = useState<GameResult | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!entryId || !player) navigate('/', { replace: true })
    else if (initial.currentGame !== 'cards') navigate(`/game/${initial.currentGame}`, { replace: true })
  }, [entryId, player, initial.currentGame, navigate])

  const total = totalFor(game.rewards)
  const lastReward = game.rewards[game.rewards.length - 1]

  function buildResult(nextGame: MemoryGameState): GameResult {
    const prize: Prize = { id: 'cards-memory', label: 'Lật thẻ ghi nhớ', value: totalFor(nextGame.rewards), color: '#6B2034', weight: 1 }
    return {
      gameId: 'cards',
      gameName: gameNames.cards,
      prize,
      memory: {
        pairsMatched: nextGame.matchedPairIds.length,
        wrongAttempts: nextGame.wrongAttempts,
        rewards: nextGame.rewards,
        consolationValue: memoryConsolationValue,
      },
    }
  }

  useEffect(() => {
    if (entryId && game.finished && !result && !pendingResult) void commit(buildResult(game))
  }, [entryId, game, pendingResult, result])

  if (!entryId || !player) return <Navigate to="/" replace />
  const activeEntryId = entryId

  async function commit(nextResult: GameResult) {
    const progress = { currentGame: 'piggy' as const, results: [...getProgress().results.filter((item) => item.gameId !== 'cards'), nextResult] }
    try {
      await saveGameProgress(activeEntryId, progress)
      setProgress(progress)
      clearMemoryGameState()
      setResult(nextResult)
      setPendingResult(null)
      setError('')
    } catch (cause) {
      setPendingResult(nextResult)
      setError(cause instanceof Error ? cause.message : 'Chưa thể lưu kết quả. Vui lòng thử lại.')
    }
  }

  function updateGame(nextGame: MemoryGameState) {
    setGame(nextGame)
    setMemoryGameState(nextGame)
  }

  function flipCard(card: MemoryCard) {
    if (isResolving || game.finished || game.flippedCardIds.includes(card.id) || game.matchedPairIds.includes(card.pairId)) return

    const flippedCardIds = [...game.flippedCardIds, card.id]
    updateGame({ ...game, flippedCardIds })
    if (flippedCardIds.length < 2) return

    setIsResolving(true)
    const [firstId, secondId] = flippedCardIds
    const first = game.deck.find((item) => item.id === firstId)
    const second = game.deck.find((item) => item.id === secondId)
    const isMatch = first?.pairId === second?.pairId

    window.setTimeout(() => {
      if (isMatch && first) {
        const reward = memoryPairRewards[game.matchedPairIds.length]
        const nextGame: MemoryGameState = {
          ...game,
          flippedCardIds: [],
          matchedPairIds: [...game.matchedPairIds, first.pairId],
          rewards: [...game.rewards, reward],
          finished: game.matchedPairIds.length + 1 === pairIcons.length,
        }
        updateGame(nextGame)
        setIsResolving(false)
        return
      }

      const wrongAttempts = game.wrongAttempts + 1
      const nextGame: MemoryGameState = { ...game, flippedCardIds: [], wrongAttempts, finished: wrongAttempts === 3 }
      updateGame(nextGame)
      setIsResolving(false)
    }, 780)
  }

  return <AppShell><main className="mini-game-page memory-game-page"><GameChrome gameId="cards" results={initial.results}>
    {result ? <GameResultCard result={result} nextLabel="Chơi đập heo" onNext={() => navigate('/game/piggy')} /> : <>
      <header className="mini-game-heading"><p>Trò 2 · Lật thẻ</p><h1>Ghép cặp để mở quà</h1><span>Ghi nhớ vị trí các biểu tượng — chị có tối đa 3 lượt lật sai.</span></header>
      <div className="memory-status" aria-live="polite"><span>Lỗi: <b>{game.wrongAttempts}/3</b></span><span>Còn lại: <b>{game.deck.length - game.matchedPairIds.length * 2} thẻ</b></span><span>Tạm nhận: <b>{formatMoney(total)}</b></span></div>
      <div className="memory-board" aria-label="Bàn lật thẻ gồm 16 thẻ">{game.deck.map((card, index) => {
        const isFlipped = game.flippedCardIds.includes(card.id)
        const isMatched = game.matchedPairIds.includes(card.pairId)
        const Icon = icons[card.icon]
        return <button key={card.id} className={`memory-card ${isFlipped ? 'is-flipped' : ''} ${isMatched ? 'is-matched' : ''}`} disabled={isResolving || game.finished || isMatched} onClick={() => flipCard(card)} aria-label={isMatched ? `Cặp thẻ ${index + 1} đã ghép` : `Lật thẻ ${index + 1}`}><span className="memory-card-inner"><span className="memory-card-face memory-card-back"><Flower2 size={21} /><i>20/10</i></span><span className="memory-card-face memory-card-front"><Icon size={28} strokeWidth={1.65} /></span></span></button>
      })}</div>
      <div className="memory-reward-note">{lastReward ? <>Cặp gần nhất: <b>+{formatMoney(lastReward.value)}</b></> : <>Mỗi cặp đúng sẽ mở thêm phần quà cho chị.</>}</div>
      {error && <div className="game-error">{error}<button onClick={() => pendingResult && void commit(pendingResult)}>Thử lưu lại</button></div>}
    </>}
  </GameChrome></main></AppShell>
}
