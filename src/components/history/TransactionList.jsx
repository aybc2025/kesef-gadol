import { formatMoney } from '../../lib/currency'
import { EXPENSE_CATEGORIES, INCOME_SOURCES, findCategory } from '../../lib/categories'
import styles from './TransactionList.module.css'

export function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return <p className={styles.empty}>אין תנועות להצגה.</p>
  }

  return (
    <ul className={styles.list}>
      {transactions.map((tx) => {
        const isIncome = tx.type === 'income'
        const cat = findCategory(isIncome ? INCOME_SOURCES : EXPENSE_CATEGORIES, tx.category)
        return (
          <li key={tx.id} className={styles.item}>
            <div className={styles.left}>
              <div className={`${styles.icon} ${isIncome ? styles.pos : styles.neg}`} aria-hidden="true">
                {cat.icon}
              </div>
              <div>
                <div className={styles.title}>{tx.label || cat.label}</div>
                <div className={styles.date}>
                  {new Date(tx.date).toLocaleDateString('he-IL')}
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <span className={`${styles.amount} ${isIncome ? styles.pos : styles.neg}`}>
                {isIncome ? '+' : '−'}
                {formatMoney(tx.amount, tx.currency)}
              </span>
              {onDelete && (
                <button
                  type="button"
                  className={`${styles.deleteBtn} no-print`}
                  onClick={() => onDelete(tx.id)}
                  aria-label="מחיקת תנועה"
                >
                  ✕
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
