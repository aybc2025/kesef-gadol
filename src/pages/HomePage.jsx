import { useState, useMemo } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import { BalanceHero } from '../components/home/BalanceHero'
import { QuickActions } from '../components/home/QuickActions'
import { MiniChart } from '../components/home/MiniChart'
import { RecentTxList } from '../components/home/RecentTxList'
import { EmptyState } from '../components/shared/EmptyState'
import { AddIncomeModal } from '../components/modals/AddIncomeModal'
import { AddExpenseModal } from '../components/modals/AddExpenseModal'
import { useTransactions } from '../hooks/useTransactions'
import { useGoals } from '../hooks/useGoals'
import { balanceSeriesByCurrency } from '../lib/calculations'

export function HomePage() {
  const {
    profile,
    transactions,
    balanceList,
    isNewUser,
    addTransaction,
    setStartingBalance,
  } = useTransactions()
  const { goals } = useGoals()

  const [incomeOpen, setIncomeOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)

  const activeGoal = goals.find((g) => !g.achieved)

  const primaryCurrency = balanceList[0]?.currency || profile.defaultCurrency

  const series = useMemo(
    () =>
      balanceSeriesByCurrency(
        profile.startingBalances || {},
        transactions,
        primaryCurrency
      ),
    [profile.startingBalances, transactions, primaryCurrency]
  )
  const chartValues = series.map((p) => Math.max(0, p.balance))

  if (isNewUser) {
    return (
      <>
        <AppHeader childName={profile.childName} />
        <EmptyState onSetStartingBalance={setStartingBalance} />
      </>
    )
  }

  return (
    <>
      <AppHeader childName={profile.childName} />
      <BalanceHero balanceList={balanceList} activeGoal={activeGoal} />
      <QuickActions onAddIncome={() => setIncomeOpen(true)} onAddExpense={() => setExpenseOpen(true)} />

      {chartValues.length > 1 && (
        <>
          <p className="section-label">הצבירה שלך</p>
          <MiniChart values={chartValues} />
        </>
      )}

      <p className="section-label">תנועות אחרונות</p>
      <RecentTxList transactions={transactions} limit={5} />

      <AddIncomeModal
        open={incomeOpen}
        onClose={() => setIncomeOpen(false)}
        onAdd={addTransaction}
        defaultCurrency={profile.defaultCurrency}
      />
      <AddExpenseModal
        open={expenseOpen}
        onClose={() => setExpenseOpen(false)}
        onAdd={addTransaction}
        defaultCurrency={profile.defaultCurrency}
      />
    </>
  )
}
