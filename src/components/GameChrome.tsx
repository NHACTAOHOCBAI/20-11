import { formatMoney } from '../config'
import type { GameId, GameResult } from '../types'
import type { ReactNode } from 'react'

const steps: GameId[] = ['wheel', 'cards', 'piggy']

export function GameChrome({ gameId, results, children }: { gameId: GameId; results: GameResult[]; children: ReactNode }) {
  const index = steps.indexOf(gameId)
  const total = results.reduce((sum, item) => sum + item.prize.value, 0)
  return <><div className="game-progress"><span>Trò {index + 1}/3</span><div aria-label={`Tiến trình trò ${index + 1} trên 3`}>{steps.map((step, itemIndex) => <i className={itemIndex <= index ? 'active' : ''} key={step} />)}</div><b>Tạm tính: {formatMoney(total)}</b></div>{children}</>
}

export function GameResultCard({ result, nextLabel, onNext }: { result: GameResult; nextLabel: string; onNext: () => void }) {
  return <div className="round-result-backdrop" role="dialog" aria-modal="true" aria-label={`Kết quả ${result.gameName}`}><section className="round-result" aria-live="polite"><span>{result.gameName}</span><h2>Chị nhận được {formatMoney(result.prize.value)}</h2><p>Phần quà đã được cộng vào tổng tiền thưởng.</p><button onClick={onNext}>{nextLabel}</button></section></div>
}
