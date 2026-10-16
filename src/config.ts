import type { Prize } from './types'

export const prizes: Prize[] = [
  { id: 'gift-50', label: '50.000đ', value: 50000, color: '#d91868', weight: 1 },
  { id: 'gift-100', label: '100.000đ', value: 100000, color: '#ffab0a', weight: 1 },
  { id: 'gift-200', label: '200.000đ', value: 200000, color: '#a81250', weight: 1 },
  { id: 'gift-300', label: '300.000đ', value: 300000, color: '#ffab0a', weight: 1 },
  { id: 'gift-500', label: '500.000đ', value: 500000, color: '#c9185c', weight: 1 },
  { id: 'gift-1000', label: '1.000.000đ', value: 1000000, color: '#80112e', weight: 1 },
]

export const banks = [
  'ABBANK', 'ACB', 'Agribank', 'BIDV', 'BVBank', 'Eximbank', 'HDBank', 'KienlongBank',
  'LPBank', 'MB Bank', 'MSB', 'Nam A Bank', 'NCB', 'OCB', 'OceanBank', 'PGBank',
  'Sacombank', 'Saigonbank', 'SeABank', 'SHB', 'Techcombank', 'TPBank', 'VIB',
  'VietABank', 'VietBank', 'Vietcombank', 'VietinBank', 'VPBank', 'Woori Bank',
]

export const formatMoney = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`
