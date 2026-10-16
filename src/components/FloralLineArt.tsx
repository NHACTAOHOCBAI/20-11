export default function FloralLineArt({ position }: { position: 'left' | 'right' }) {
  return <svg className={`floral-art floral-art--${position}`} viewBox="0 0 250 420" fill="none" aria-hidden="true">
    <path d="M-18 403C77 341 86 231 132 132C155 83 193 52 255 19" />
    <path d="M63 303c-37-13-55-46-51-79 36 12 56 44 51 79ZM106 214c-37-8-58-35-59-67 36 8 59 34 59 67ZM144 138c-18-30-11-64 11-86 18 31 13 63-11 86Z" />
    <path d="M83 279c28-25 60-22 82 0-28 24-59 23-82 0ZM119 191c25-22 54-18 74 3-24 21-52 19-74-3ZM154 116c21-20 48-17 66 1-20 20-45 19-66-1Z" />
    <circle cx="47" cy="224" r="4" /><circle cx="111" cy="148" r="4" /><circle cx="194" cy="67" r="4" />
  </svg>
}
