import type { MemoryReward, Prize } from './types'

export const prizes: Prize[] = [
  { id: 'gift-50', label: '50.000đ', value: 50000, color: '#6B2034', weight: 1 },
  { id: 'gift-100', label: '100.000đ', value: 100000, color: '#F1E3D1', weight: 1 },
  { id: 'gift-200', label: '200.000đ', value: 200000, color: '#8B4658', weight: 1 },
  { id: 'gift-300', label: '300.000đ', value: 300000, color: '#E5CFA2', weight: 1 },
  { id: 'gift-500', label: '500.000đ', value: 500000, color: '#54202E', weight: 1 },
  { id: 'gift-1000', label: '1.000.000đ', value: 1000000, color: '#D9B66F', weight: 1 },
]

export const memoryConsolationValue = 20000

export const memoryPairRewards: MemoryReward[] = [
  { pairNumber: 1, cardsRemaining: 14, value: 5000 },
  { pairNumber: 2, cardsRemaining: 12, value: 10000 },
  { pairNumber: 3, cardsRemaining: 10, value: 15000 },
  { pairNumber: 4, cardsRemaining: 8, value: 20000 },
  { pairNumber: 5, cardsRemaining: 6, value: 30000 },
  { pairNumber: 6, cardsRemaining: 4, value: 40000 },
  { pairNumber: 7, cardsRemaining: 2, value: 60000 },
  { pairNumber: 8, cardsRemaining: 0, value: 100000 },
]

export const piggyPrizes: Prize[] = [
  { id: 'piggy-10', label: '10.000đ', value: 10000, color: '#6B2034', weight: 4 },
  { id: 'piggy-20', label: '20.000đ', value: 20000, color: '#F1E3D1', weight: 3 },
  { id: 'piggy-50', label: '50.000đ', value: 50000, color: '#8B4658', weight: 2 },
  { id: 'piggy-100', label: '100.000đ', value: 100000, color: '#E5CFA2', weight: 1 },
  { id: 'piggy-200', label: '200.000đ', value: 200000, color: '#54202E', weight: 1 },
  { id: 'piggy-300', label: '300.000đ', value: 300000, color: '#D9B66F', weight: 1 },
]

export const gameNames = { wheel: 'Vòng quay', cards: 'Lật thẻ', piggy: 'Đập heo' } as const

export const banks = [
  'ABBANK', 'ACB', 'Agribank', 'BIDV', 'BVBank', 'Eximbank', 'HDBank', 'KienlongBank',
  'LPBank', 'MB Bank', 'MSB', 'Nam A Bank', 'NCB', 'OCB', 'OceanBank', 'PGBank',
  'Sacombank', 'Saigonbank', 'SeABank', 'SHB', 'Techcombank', 'TPBank', 'VIB',
  'VietABank', 'VietBank', 'Vietcombank', 'VietinBank', 'VPBank', 'Woori Bank',
]

export const formatMoney = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`
