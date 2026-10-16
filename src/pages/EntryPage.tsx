import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, ChevronDown, Gift, LockKeyhole, UserRound } from 'lucide-react'
import AppShell from '../components/AppShell'
import { banks } from '../config'
import { createPendingSpin } from '../lib/supabase'
import { setActiveSpin } from '../lib/storage'

type FormState = { name: string; bank: string; account: string }
const initial: FormState = { name: '', bank: '', account: '' }

export default function EntryPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const update = (key: keyof FormState, value: string | boolean) => setForm((old) => ({ ...old, [key]: value }))

  async function submit(event: FormEvent) {
    event.preventDefault(); setError('')
    const name = form.name.trim()
    if (!name || !form.bank || !form.account) return setError('Vui lòng điền đủ thông tin.')
    if (!/^\d{6,19}$/.test(form.account)) return setError('Số tài khoản cần gồm 6–19 chữ số.')
    setSaving(true)
    try {
      const details = { participant_name: name, bank_name: form.bank, account_number: form.account }
      const id = await createPendingSpin(details)
      setActiveSpin(id, details)
      navigate('/game/wheel')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể lưu lượt chơi. Vui lòng thử lại.') }
    finally { setSaving(false) }
  }

  return <AppShell><div className="entry-page">
    <section className="campaign-banner"><div className="banner-icon"><Gift size={20} /></div><div><b>Một món quà nhỏ dành cho bạn</b><span>Điền thông tin để bắt đầu vòng quay may mắn.</span></div></section>
    <section className="entry-card">
      <p className="section-kicker">Thông tin nhận quà</p><p className="section-copy">Vui lòng điền thông tin chính xác để chúng tôi ghi nhận phần quà của bạn.</p>
      <form onSubmit={submit} noValidate>
        <label>Họ và Tên của Chị <em>*</em><span className="field"><UserRound size={15} /><input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Nguyễn Thị Mai Lan" autoComplete="name" /></span></label>
        <label>Ngân hàng nhận thưởng (24/7) <em>*</em><BankSelect value={form.bank} onChange={(bank) => update('bank', bank)} /></label>
        <label>Số tài khoản ngân hàng <em>*</em><span className="field"><LockKeyhole size={15} /><input inputMode="numeric" value={form.account} onChange={(e) => update('account', e.target.value.replace(/\D/g, ''))} placeholder="098765432101" /></span></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button" disabled={saving}>{saving ? 'Đang tạo lượt chơi...' : <>Bắt đầu bốc thăm / Quay quà <ArrowRight size={18} /></>}</button>
      </form>
    </section>
    <p className="page-note">Thông tin của bạn chỉ được dùng để ghi nhận phần quà.</p>
  </div></AppShell>
}

function BankSelect({ value, onChange }: { value: string; onChange: (bank: string) => void }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  function choose(bank: string) { onChange(bank); setOpen(false) }
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape') setOpen(false)
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setOpen((current) => !current) }
  }

  return <div className="bank-select" ref={rootRef}>
    <button type="button" className="bank-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} onKeyDown={onKeyDown}>
      <Building2 size={16} /><span className={value ? '' : 'placeholder'}>{value || 'Chọn ngân hàng'}</span><ChevronDown className={open ? 'chevron-open' : ''} size={18} />
    </button>
    {open && <ul className="bank-options" role="listbox" aria-label="Danh sách ngân hàng">
      {banks.map((bank) => <li key={bank} role="option" aria-selected={bank === value}><button type="button" className={bank === value ? 'selected' : ''} onClick={() => choose(bank)}>{bank}</button></li>)}
    </ul>}
  </div>
}
