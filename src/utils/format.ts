import dayjs from 'dayjs'

export function formatDate(date: string | Date, fmt = 'DD MMM YYYY') {
  return dayjs(date).format(fmt)
}

export function formatDateTime(date: string | Date) {
  return dayjs(date).format('DD MMM YYYY, hh:mm A')
}

export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount)
}

export function timeAgo(date: string | Date) {
  const d = dayjs(date)
  const now = dayjs()
  const diffMin = now.diff(d, 'minute')
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = now.diff(d, 'hour')
  if (diffHr < 24) return `${diffHr}h ago`
  return d.format('DD MMM')
}
