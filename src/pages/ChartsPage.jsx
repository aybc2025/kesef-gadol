import { useState, useMemo } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import { CurrencyTabs } from '../components/shared/CurrencyTabs'
import { BalanceOverTimeChart } from '../components/charts/BalanceOverTimeChart'
import { SpendingByCategoryChart } from '../components/charts/SpendingByCategoryChart'
import { useTransactions } from '../hooks/useTransactions'
import { balanceSeriesByCurrency, spendingByCategory, monthKey, monthlyTotals } from '../lib/calculations'
import { formatMoney } from '../lib/currency'

export function ChartsPage() {
  const { profile, transactions, balanceList } = useTransactions()
  const availableCurrencies = balanceList.map((b) => b.currency)
  const [currency, setCurrency] = useState(availableCurrencies[0] || profile.defaultCurrency)

  const activeCurrency = availableCurrencies.includes(currency) ? currency : availableCurrencies[0]

  const series = useMemo(
    () => balanceSeriesByCurrency(profile.startingBalances || {}, transactions, activeCurrency),
    [profile.startingBalances, transactions, activeCurrency]
  )

  const thisMonth = monthKey(new Date())
  const monthTotals = useMemo(
    () => monthlyTotals(transactions, activeCurrency, thisMonth),
    [transactions, activeCurrency, thisMonth]
  )

  const categoryData = useMemo(
    () => spendingByCategory(transactions, activeCurrency, thisMonth),
    [transactions, activeCurrency, thisMonth]
  )

  if (availableCurrencies.length === 0) {
    return (
      <>
        <AppHeader childName={profile.childName} />
        <p style={{ textAlign: 'center', padding: 32, color: 'var(--ink-soft)' }}>
          עוד אין נתונים להציג. הוסיפו תנועה ראשונה במסך הבית!
        </p>
      </>
    )
  }

  return (
    <>
      <AppHeader childName={profile.childName} />

      <div style={{ margin: '0 20px 16px', textAlign: 'center' }}>
        <p className="section-label" style={{ margin: '0 0 4px' }}>
          היתרה גדלה החודש ב-
        </p>
        <div
          style={{
            fontSize: 'var(--scale-xl)',
            fontWeight: 800,
            color: monthTotals.net >= 0 ? 'var(--green-700)' : 'var(--coral)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {monthTotals.net >= 0 ? '+' : ''}
          {formatMoney(monthTotals.net, activeCurrency)} {monthTotals.net > 0 ? '🎉' : ''}
        </div>
      </div>

      <CurrencyTabs available={availableCurrencies} value={activeCurrency} onChange={setCurrency} />

      <p className="section-label">היתרה שלי לאורך זמן</p>
      <div style={{ margin: '0 20px 24px' }}>
        <BalanceOverTimeChart data={series} currency={activeCurrency} />
      </div>

      <p className="section-label">לאן הלך הכסף החודש</p>
      <div style={{ margin: '0 20px 24px' }}>
        <SpendingByCategoryChart data={categoryData} currency={activeCurrency} />
      </div>
    </>
  )
}
