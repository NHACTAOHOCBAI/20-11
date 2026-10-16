import type { ReactNode } from 'react'
import { Gift } from 'lucide-react'

export default function AppShell({ children }: { children: ReactNode }) {
  return <main className="site-shell">
    <header className="site-header">
      <a className="brand" href="/" aria-label="Về trang vòng quay may mắn 20/10">
        <span className="brand-mark"><Gift size={19} /></span>
        <span><b>Món quà Special 20/10</b><small>Chúc mừng Ngày Phụ nữ Việt Nam</small></span>
      </a>
    </header>
    {children}
  </main>
}
