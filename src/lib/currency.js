// Two currencies only, by design: CAD is everyday life, ILS is for trips to
// Israel. No live exchange-rate conversion — merging them into one fake
// number would misrepresent the amount, so every total is tracked and
// displayed per-currency instead.

export const CURRENCIES = {
  CAD: { code: 'CAD', symbol: '$', label: 'דולר קנדי', locale: 'en-CA' },
  ILS: { code: 'ILS', symbol: '₪', label: 'שקל', locale: 'he-IL' },
}

// Everyday currency — this is what the main hero balance and the growth
// visual are built around.
export const DEFAULT_CURRENCY = 'CAD'

export function formatMoney(amount, currencyCode = DEFAULT_CURRENCY) {
  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY]
  const rounded = Math.round(amount * 100) / 100
  const abs = Math.abs(rounded).toLocaleString('he-IL', {
    minimumFractionDigits: rounded % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  const sign = rounded < 0 ? '−' : ''
  return `${sign}${currency.symbol}${abs}`
}

export function otherCurrency(code) {
  return code === 'CAD' ? 'ILS' : 'CAD'
}
