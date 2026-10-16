import { CheckCircle2, Gift, X } from 'lucide-react'
import type { PlayerDetails, Prize } from '../types'
import { formatMoney } from '../config'

export default function ResultModal({ player, prize, onClose }: { player: PlayerDetails; prize: Prize; onClose: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="result-title">
    <section className="result-modal">
      <button className="icon-close" onClick={onClose} aria-label="Đóng kết quả"><X size={20} /></button>
      <div className="modal-gift"><Gift size={32} /></div>
      <p className="eyebrow">✿ Phần quà may mắn 20/10</p>
      <h1 id="result-title">Chúc mừng {player.participant_name}!</h1>
      <p className="modal-subtitle">Vòng quay đã dừng lại ở phần quà siêu đặc biệt</p>
      <div className="prize-card"><span>GIẢI THƯỞNG TIỀN MẶT</span><strong>{formatMoney(prize.value)}</strong><small>({prize.label})</small></div>
      <div className="wish-card"><b>✉ Lời chúc 20/10 gửi chị:</b><p>“Chúc chị ngày 20/10 luôn rực rỡ, tự tin, hạnh phúc đong đầy và tiền thưởng luôn chất ví!” 💕</p></div>
      <div className="saved-note"><CheckCircle2 size={17} /><span><b>Đã kích hoạt chuyển khoản tức thì 24/7</b><br />Hệ thống đang ghi nhận thông tin nhận thưởng.</span></div>
      <button className="return-button" onClick={onClose}>Về trang đầu</button>
    </section>
  </div>
}
