import type { ReactNode } from 'react'
import { Gift } from 'lucide-react'
import FloralLineArt from './FloralLineArt'

export default function AppShell({ children }: { children: ReactNode }) {
  return <main className="site-shell">
    <header className="site-header">
      <a className="brand" href="/" aria-label="Về trang vòng quay may mắn 20/10">
        <span className="brand-mark"><Gift size={19} /></span>
        <span><b>Món quà 20/10</b><small>Gửi bạn một lời chúc ấm áp</small></span>
      </a>
    </header>
    <FloralLineArt position="left" />
    <FloralLineArt position="right" />
    {children}
  </main>
}
