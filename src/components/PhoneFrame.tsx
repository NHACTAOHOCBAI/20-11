import type { ReactNode } from 'react'

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return <main className="page-shell"><section className="phone-frame"><div className="phone-top"><span>09:41</span><i /><span className="phone-icons">▮▮⌁ ▰</span></div>{children}</section></main>
}
