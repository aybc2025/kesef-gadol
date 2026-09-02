import { useState } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import { GoalCard } from '../components/goals/GoalCard'
import { GoalForm } from '../components/goals/GoalForm'
import { useTransactions } from '../hooks/useTransactions'
import { useGoals } from '../hooks/useGoals'

export function GoalsPage() {
  const { profile, balances } = useTransactions()
  const { goals, addGoal, deleteGoal, markAchieved } = useGoals()
  const [formOpen, setFormOpen] = useState(false)

  const active = goals.filter((g) => !g.achieved)
  const achieved = goals.filter((g) => g.achieved)

  return (
    <>
      <AppHeader childName={profile.childName} />

      <div style={{ margin: '0 20px 16px' }}>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          style={{
            width: '100%',
            background: 'var(--green-500)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '14px',
            fontWeight: 700,
            fontSize: 'var(--scale-base)',
          }}
        >
          + יעד חיסכון חדש
        </button>
      </div>

      {active.length === 0 && achieved.length === 0 && (
        <p style={{ textAlign: 'center', padding: 24, color: 'var(--ink-soft)', fontSize: 'var(--scale-sm)' }}>
          אין עדיין יעדים. רוצים לחסוך למשהו מיוחד?
        </p>
      )}

      {active.length > 0 && (
        <>
          <p className="section-label">היעדים שלי</p>
          {active.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currentBalance={balances[goal.currency] || 0}
              onDelete={deleteGoal}
              onMarkAchieved={markAchieved}
            />
          ))}
        </>
      )}

      {achieved.length > 0 && (
        <>
          <p className="section-label">יעדים שהושגו 🏆</p>
          {achieved.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currentBalance={balances[goal.currency] || 0}
              onDelete={deleteGoal}
              onMarkAchieved={markAchieved}
            />
          ))}
        </>
      )}

      <GoalForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onAdd={addGoal}
        defaultCurrency={profile.defaultCurrency}
      />
    </>
  )
}
