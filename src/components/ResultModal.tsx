import { Gift, X } from 'lucide-react'
import type { GameResult, PlayerDetails } from '../types'
import { formatMoney } from '../config'

export default function ResultModal({ player, results, onClose }: { player: PlayerDetails; results: GameResult[]; onClose: () => void }) {
  const total = results.reduce((sum, result) => sum + result.prize.value, 0)
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="result-title">
    <section className="result-modal">
      <button className="icon-close" onClick={onClose} aria-label="Đóng kết quả"><X size={20} /></button>
      <div className="modal-gift"><Gift size={32} /></div>
      <p className="eyebrow">Món quà 20/10</p>
      <h1 id="result-title">Chúc mừng {player.participant_name}!</h1>
      <p className="modal-subtitle">Chị sẽ nhận được toàn bộ phần quà vào cuối ngày 20/10.</p>
      <div className="prize-card"><span>Tổng phần quà của chị</span><strong>{formatMoney(total)}</strong><small>{results.length} trò chơi đã hoàn thành</small></div>
      <ul className="result-breakdown">{results.map((result) => <li key={result.gameId}><span>{result.gameName}</span><b>{formatMoney(result.prize.value)}</b></li>)}</ul>
      <div className="wish-card"><b>Lời chúc gửi chị</b><p>Chúc chị {player.participant_name} ngày 20/10 luôn rạng rỡ, bình an và ngập tràn niềm vui.</p></div>
      <button className="return-button" onClick={onClose}>Về trang đầu</button>
    </section>
  </div>
}
