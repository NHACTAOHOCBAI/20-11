import { Gift, X } from 'lucide-react'
import type { PlayerDetails, Prize } from '../types'
import { formatMoney } from '../config'

export default function ResultModal({ player, prize, onClose }: { player: PlayerDetails; prize: Prize; onClose: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="result-title">
    <section className="result-modal">
      <button className="icon-close" onClick={onClose} aria-label="Đóng kết quả"><X size={20} /></button>
      <div className="modal-gift"><Gift size={32} /></div>
      <p className="eyebrow">Món quà 20/10</p>
      <h1 id="result-title">Chúc mừng {player.participant_name}!</h1>
      <p className="modal-subtitle">Chị sẽ nhận được một món quà từ vòng quay vào cuối ngày 20/10.</p>
      <div className="prize-card"><span>Phần quà của chị</span><strong>{formatMoney(prize.value)}</strong><small>{prize.label}</small></div>
      <div className="wish-card"><b>Lời chúc gửi chị</b><p>Chúc chị {player.participant_name} ngày 20/10 luôn rạng rỡ, bình an và ngập tràn niềm vui.</p></div>
      <button className="return-button" onClick={onClose}>Về trang đầu</button>
    </section>
  </div>
}
