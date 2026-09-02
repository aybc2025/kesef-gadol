import { formatMoney } from '../../lib/currency'
import styles from './GoalCard.module.css'

export function GoalCard({ goal, currentBalance, onDelete, onMarkAchieved }) {
  const progress = goal.targetAmount > 0
    ? Math.min(100, Math.round((currentBalance / goal.targetAmount) * 100))
    : 0
  const reached = progress >= 100

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div>
          <div className={styles.title}>{goal.title}</div>
          <div className={styles.target}>
            יעד: {formatMoney(goal.targetAmount, goal.currency)}
          </div>
        </div>
        <button
          type="button"
          className={styles.remove}
          onClick={() => onDelete(goal.id)}
          aria-label={`מחיקת יעד ${goal.title}`}
        >
          ✕
        </button>
      </div>

      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${reached ? styles.done : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className={styles.bottom}>
        <span>{progress}%</span>
        {reached && !goal.achieved && (
          <button type="button" className={styles.celebrate} onClick={() => onMarkAchieved(goal.id)}>
            הגעת ליעד! 🎉 סמן כהושג
          </button>
        )}
        {goal.achieved && <span className={styles.achievedTag}>הושג! 🏆</span>}
      </div>
    </div>
  )
}
