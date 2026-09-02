import styles from './QuickActions.module.css'

export function QuickActions({ onAddIncome, onAddExpense }) {
  return (
    <div className={styles.row}>
      <button type="button" className={`${styles.btn} ${styles.in}`} onClick={onAddIncome}>
        + קיבלתי כסף
      </button>
      <button type="button" className={`${styles.btn} ${styles.out}`} onClick={onAddExpense}>
        − הוצאתי כסף
      </button>
    </div>
  )
}
