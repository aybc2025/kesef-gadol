import { formatMoney } from '../../lib/currency'
import { plantStage } from '../../lib/calculations'
import styles from './BalanceHero.module.css'

const PLANT_EMOJI = {
  seed: '🌰',
  sprout: '🌱',
  sapling: '🌿',
  tree: '🌳',
  blooming: '🌸',
}

const PLANT_CAPTION = {
  seed: 'עוד מעט מתחילים לצמוח',
  sprout: 'הנביטה הראשונה!',
  sapling: 'השתיל גדל יפה',
  tree: 'עץ אמיתי!',
  blooming: 'פורח! איזה כיף',
}

export function BalanceHero({ balanceList, activeGoal }) {
  const primary = balanceList[0] || { currency: 'CAD', balance: 0 }
  const secondary = balanceList.slice(1)
  const stage = plantStage(primary.balance)

  let goalProgress = null
  if (activeGoal && activeGoal.targetAmount > 0) {
    const matchingBalance = balanceList.find((b) => b.currency === activeGoal.currency)
    const current = matchingBalance ? matchingBalance.balance : 0
    goalProgress = Math.min(100, Math.round((current / activeGoal.targetAmount) * 100))
  }

  return (
    <div className={styles.hero}>
      <div className={styles.plant} aria-hidden="true">
        {PLANT_EMOJI[stage]}
      </div>
      <div className={styles.amount}>{formatMoney(primary.balance, primary.currency)}</div>
      <div className={styles.sub}>{PLANT_CAPTION[stage]}</div>

      {secondary.length > 0 && (
        <div className={styles.secondary}>
          {secondary.map((b) => (
            <span key={b.currency}>+ {formatMoney(b.balance, b.currency)} מביקורים בישראל</span>
          ))}
        </div>
      )}

      {goalProgress !== null && (
        <>
          <div className={styles.goalBar}>
            <div className={styles.goalFill} style={{ width: `${goalProgress}%` }} />
          </div>
          <div className={styles.goalLabel}>
            {goalProgress}% מהיעד: {activeGoal.title} ב-
            {formatMoney(activeGoal.targetAmount, activeGoal.currency)}
          </div>
        </>
      )}
    </div>
  )
}
