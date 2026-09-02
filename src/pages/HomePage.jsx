import { useState, useMemo } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import { BalanceHero } from '../components/home/BalanceHero'
import { QuickActions } from '../components/home/QuickActions'
import { MiniChart } from '../components/home/MiniChart'
import { NameModal } from '../components/home/NameModal'
import { RecentTxList } from '../components/home/RecentTxList'
import { EmptyState } from '../components/shared/EmptyState'
import { AddIncomeModal } from '../components/modals/AddIncomeModal'
import { AddExpenseModal } from '../components/modals/AddExpenseModal'
import { useTransactions } from '../hooks/useTransactions'
import { useGoals } from '../hooks/useGoals'
import { balanceSeriesByCurrency } from '../lib/calculations'
import { formatMoney } from '../lib/currency'

export function HomePage() {
  const {
    profile,
    transactions,
    balanceList,
    isNewUser,
    addTransaction,
    setStartingBalance,
    setChildName,
  } = useTransactions()
  const { goals } = useGoals()

  const [incomeOpen, setIncomeOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [nameOpen, setNameOpen] = useState(false)

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
  const firstBalance = series[0]?.balance ?? 0
  const lastBalance = series[series.length - 1]?.balance ?? 0
  const delta = lastBalance - firstBalance

  const nameModal = (
    <NameModal
      open={nameOpen}
      initialName={profile.childName}
      onClose={() => setNameOpen(false)}
      onSave={setChildName}
    />
  )

  if (isNewUser) {
    return (
      <>
        <AppHeader childName={profile.childName} onEditName={() => setNameOpen(true)} />
        <EmptyState onSetStartingBalance={setStartingBalance} onSetChildName={setChildName} />
        {nameModal}
      </>
    )
  }

  return (
    <>
      <AppHeader childName={profile.childName} onEditName={() => setNameOpen(true)} />
      <BalanceHero balanceList={balanceList} activeGoal={activeGoal} />
      <QuickActions onAddIncome={() => setIncomeOpen(true)} onAddExpense={() => setExpenseOpen(true)} />

      {chartValues.length > 2 && (
        <>
          <p className="section-label">הצבירה שלך לאורך זמן</p>
          <MiniChart values={chartValues} />
          <p className="chart-caption">
            מ-{formatMoney(firstBalance, primaryCurrency)} ל-{formatMoney(lastBalance, primaryCurrency)}
            {' · '}
            {delta >= 0 ? 'עלייה של ' : 'ירידה של '}
            {formatMoney(Math.abs(delta), primaryCurrency)}
          </p>
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
      {nameModal}
    </>
  )
}
