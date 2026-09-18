import { useState, useMemo } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import { CurrencyTabs } from '../components/shared/CurrencyTabs'
import { TransactionList } from '../components/history/TransactionList'
import { ExportBar } from '../components/history/ExportBar'
import { ResetDataSection } from '../components/history/ResetDataSection'
import { MonthlyReport } from '../components/history/MonthlyReport'
import { useTransactions } from '../hooks/useTransactions'
import { exportDataAsJson } from '../lib/exportJson'
import { useGoals } from '../hooks/useGoals'
import {
  monthKey,
  monthlyTotals,
  spendingByCategory,
  calculateBalances,
} from '../lib/calculations'

const MONTH_NAMES_HE = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
]

function monthOptions(transactions) {
  const keys = new Set([monthKey(new Date())])
  transactions.forEach((tx) => keys.add(monthKey(tx.date)))
  return Array.from(keys).sort().reverse()
}

function labelFor(key) {
  const [year, month] = key.split('-').map(Number)
  return `${MONTH_NAMES_HE[month - 1]} ${year}`
}

// Opening balance for a given month = starting balance + net of all
// transactions strictly before that month, for one currency.
function openingBalanceForMonth(startingBalances, transactions, currency, monthKeyStr) {
  const before = transactions.filter(
    (tx) => (tx.currency || currency) === currency && monthKey(tx.date) < monthKeyStr
  )
  const balances = calculateBalances(startingBalances, before)
  return balances[currency] || startingBalances[currency] || 0
}

export function HistoryPage() {
  const { profile, transactions, balanceList, deleteTransaction, resetAll: resetTransactions } =
    useTransactions()
  const { goals, resetAll: resetGoals } = useGoals()
  const availableCurrencies = balanceList.map((b) => b.currency)
  const [currency, setCurrency] = useState(availableCurrencies[0] || profile.defaultCurrency)
  const activeCurrency = availableCurrencies.includes(currency) ? currency : availableCurrencies[0]

  const months = useMemo(() => monthOptions(transactions), [transactions])
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const effectiveMonth = months.includes(selectedMonth) ? selectedMonth : months[0]

  const filtered = transactions
    .filter((tx) => (tx.currency || activeCurrency) === activeCurrency)
    .filter((tx) => monthKey(tx.date) === effectiveMonth)

  function handleExportJson() {
    exportDataAsJson({ profile, transactions, goals })
  }

  function handleExportPdf() {
    window.print()
  }

  function handleResetEverything() {
    resetTransactions()
    resetGoals()
  }

  const reportTotals = useMemo(
    () => monthlyTotals(transactions, activeCurrency, effectiveMonth),
    [transactions, activeCurrency, effectiveMonth]
  )
  const reportCategories = useMemo(
    () => spendingByCategory(transactions, activeCurrency, effectiveMonth),
    [transactions, activeCurrency, effectiveMonth]
  )
  const openingBalance = useMemo(
    () =>
      openingBalanceForMonth(
        profile.startingBalances || {},
        transactions,
        activeCurrency,
        effectiveMonth
      ),
    [profile.startingBalances, transactions, activeCurrency, effectiveMonth]
  )

  if (availableCurrencies.length === 0) {
    return (
      <>
        <AppHeader childName={profile.childName} />
        <p style={{ textAlign: 'center', padding: 32, color: 'var(--ink-soft)' }}>
          עוד אין תנועות להצגה.
        </p>
        <ResetDataSection onConfirmReset={handleResetEverything} />
      </>
    )
  }

  return (
    <>
      <AppHeader childName={profile.childName} />

      <CurrencyTabs available={availableCurrencies} value={activeCurrency} onChange={setCurrency} />

      <div className="no-print" style={{ margin: '0 20px 16px' }}>
        <label
          htmlFor="month-select"
          style={{
            display: 'block',
            fontSize: 'var(--scale-xs)',
            fontWeight: 700,
            color: 'var(--green-700)',
            marginBottom: 6,
          }}
        >
          בחירת חודש לדוח ולהצגה
        </label>
        <select
          id="month-select"
          value={effectiveMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--line)',
            background: 'var(--paper)',
            fontSize: 'var(--scale-base)',
          }}
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {labelFor(m)}
            </option>
          ))}
        </select>
      </div>

      <ExportBar onExportJson={handleExportJson} onExportPdf={handleExportPdf} />

      <p className="section-label no-print">תנועות — {labelFor(effectiveMonth)}</p>
      <div className="no-print">
        <TransactionList transactions={filtered} onDelete={deleteTransaction} />
      </div>

      {/* Hidden on screen, shown only by print.css when exporting to PDF. */}
      <MonthlyReport
        monthKeyStr={effectiveMonth}
        currency={activeCurrency}
        childName={profile.childName}
        openingBalance={openingBalance}
        totals={reportTotals}
        categoryBreakdown={reportCategories}
        transactions={filtered}
      />

      <ResetDataSection onConfirmReset={handleResetEverything} />
    </>
  )
}
