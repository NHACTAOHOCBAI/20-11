import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, Gift, LockKeyhole, UserRound } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame'
import { banks } from '../config'
import { createPendingSpin } from '../lib/supabase'
import { hasCompletedSpin, setActiveSpin } from '../lib/storage'

type FormState = { name: string; bank: string; account: string; consent: boolean }
const initial: FormState = { name: '', bank: '', account: '', consent: false }

export default function EntryPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const completed = hasCompletedSpin()
  const update = (key: keyof FormState, value: string | boolean) => setForm((old) => ({ ...old, [key]: value }))

  async function submit(event: FormEvent) {
    event.preventDefault(); setError('')
    const name = form.name.trim()
    if (!name || !form.bank || !form.account || !form.consent) return setError('Vui lòng điền đủ thông tin và xác nhận cam kết.')
    if (!/^\d{6,19}$/.test(form.account)) return setError('Số tài khoản cần gồm 6–19 chữ số.')
    setSaving(true)
    try {
      const details = { participant_name: name, bank_name: form.bank, account_number: form.account }
      const id = await createPendingSpin(details)
      setActiveSpin(id, details)
      navigate('/wheel')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể lưu lượt chơi. Vui lòng thử lại.') }
    finally { setSaving(false) }
  }

  return <PhoneFrame><div className="entry-page">
    <header className="campaign-banner"><div className="banner-icon"><Gift size={18} /></div><div><b>Món Quà Special 20/10 🌸</b><span>Chúc ngày Phụ Nữ Việt Nam</span></div></header>
    <div className="sparkle one">✦</div><div className="sparkle two">✧</div>
    <section className="entry-card">
      <p className="section-kicker">▧ Nhập thông tin nhận quà</p><p className="section-copy">Điền thông tin chính xác, quà sẽ được tự động chuyển ngay sau khi quay!</p>
      {completed ? <div className="completed-message"><CheckMark />Bạn đã hoàn tất lượt quay trên thiết bị này. Cảm ơn chị đã tham gia!</div> : <form onSubmit={submit} noValidate>
        <label>Họ và Tên của Chị <em>*</em><span className="field"><UserRound size={15} /><input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Nguyễn Thị Mai Lan" autoComplete="name" /></span></label>
        <label>Ngân hàng nhận thưởng (24/7) <em>*</em><span className="field"><Building2 size={15} /><select value={form.bank} onChange={(e) => update('bank', e.target.value)}><option value="">Chọn ngân hàng</option>{banks.map((bank) => <option key={bank}>{bank}</option>)}</select></span></label>
        <label>Số tài khoản ngân hàng <em>*</em><span className="field"><LockKeyhole size={15} /><input inputMode="numeric" value={form.account} onChange={(e) => update('account', e.target.value.replace(/\D/g, ''))} placeholder="098765432101" /></span></label>
        <label className="consent"><input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} /><span>Tôi cam kết thông tin đúng và đồng ý nhận thưởng sự kiện 20/10.</span></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button" disabled={saving}>{saving ? 'Đang tạo lượt chơi...' : <>Bắt đầu bốc thăm / Quay quà <ArrowRight size={18} /></>}</button>
      </form>}
    </section>
    <p className="footer-status">• Đã có 142/150 chị em nhận thưởng hôm nay ✨</p>
  </div></PhoneFrame>
}

function CheckMark() { return <span className="checkmark">✓</span> }
