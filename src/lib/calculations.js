import { DEFAULT_CURRENCY } from './currency'

/**
 * Every calculation here is per-currency: balances, monthly sums, and
 * category breakdowns never mix CAD and ILS into one number. A transaction
 * without a currency field (shouldn't happen, but defensive) falls back to
 * the default currency rather than being silently dropped.
 */

function currencyOf(tx) {
  return tx.currency || DEFAULT_CURRENCY
}

// Starting balances is now a map: { CAD: 50, ILS: 0 }
export function calculateBalances(startingBalances, transactions) {
  const balances = { ...startingBalances }
  for (const tx of transactions) {
    const cur = currencyOf(tx)
    if (balances[cur] === undefined) balances[cur] = 0
    balances[cur] += tx.type === 'income' ? tx.amount : -tx.amount
  }
  return balances
}

// Returns [{ currency, balance }] only for currencies that actually have
// a nonzero starting balance or at least one transaction — so a kid who
// never touched ILS doesn't see a stray "₪0" line.
export function activeCurrencyBalances(startingBalances, transactions) {
  const seen = new Set(
    Object.keys(startingBalances).filter((c) => startingBalances[c] !== 0)
  )
  transactions.forEach((tx) => seen.add(currencyOf(tx)))
  const balances = calculateBalances(startingBalances, transactions)
  return Array.from(seen)
    .sort((a) => (a === DEFAULT_CURRENCY ? -1 : 1))
    .map((currency) => ({ currency, balance: balances[currency] || 0 }))
}

export function monthKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// Balance-over-time series for a single currency, month by month, starting
// from that currency's starting balance.
export function balanceSeriesByCurrency(startingBalances, transactions, currency) {
  const relevant = transactions
    .filter((tx) => currencyOf(tx) === currency)
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  if (relevant.length === 0) {
    return [{ label: 'עכשיו', balance: startingBalances[currency] || 0 }]
  }

  const byMonth = new Map()
  let running = startingBalances[currency] || 0
  for (const tx of relevant) {
    running += tx.type === 'income' ? tx.amount : -tx.amount
    byMonth.set(monthKey(tx.date), running)
  }

  return Array.from(byMonth.entries()).map(([key, balance]) => ({
    label: key,
    balance,
  }))
}

export function monthlyTotals(transactions, currency, monthKeyStr) {
  const inMonth = transactions.filter(
    (tx) => currencyOf(tx) === currency && monthKey(tx.date) === monthKeyStr
  )
  const totalIn = inMonth
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
  const totalOut = inMonth
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
  return { totalIn, totalOut, net: totalIn - totalOut, transactions: inMonth }
}

export function spendingByCategory(transactions, currency, monthKeyStr) {
  const expenses = transactions.filter(
    (tx) =>
      currencyOf(tx) === currency &&
      tx.type === 'expense' &&
      (!monthKeyStr || monthKey(tx.date) === monthKeyStr)
  )
  const byCategory = new Map()
  for (const tx of expenses) {
    const key = tx.category || 'other'
    byCategory.set(key, (byCategory.get(key) || 0) + tx.amount)
  }
  return Array.from(byCategory.entries()).map(([category, amount]) => ({
    category,
    amount,
  }))
}

// Plant growth stage from a 0..1 progress-like ratio of balance to a
// reasonable milestone scale. Purely cosmetic, per-currency balance in.
export function plantStage(balance) {
  if (balance <= 0) return 'seed'
  if (balance < 50) return 'sprout'
  if (balance < 150) return 'sapling'
  if (balance < 400) return 'tree'
  return 'blooming'
}
