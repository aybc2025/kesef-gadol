import { formatMoney } from '../../lib/currency'
import { EXPENSE_CATEGORIES, INCOME_SOURCES, findCategory } from '../../lib/categories'
import styles from './RecentTxList.module.css'

function relativeDate(iso) {
  const date = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'היום'
  if (diffDays === 1) return 'אתמול'
  if (diffDays < 7) return `לפני ${diffDays} ימים`
  return date.toLocaleDateString('he-IL')
}

export function RecentTxList({ transactions, limit = 5 }) {
  const items = transactions.slice(0, limit)

  if (items.length === 0) {
    return <p className={styles.empty}>עדיין אין תנועות. תוסיפו את הראשונה!</p>
  }

  return (
    <ul className={styles.list}>
      {items.map((tx) => {
        const isIncome = tx.type === 'income'
        const cat = findCategory(isIncome ? INCOME_SOURCES : EXPENSE_CATEGORIES, tx.category)
        return (
          <li key={tx.id} className={`${styles.item} ${isIncome ? styles.pos : styles.neg}`}>
            <div className={styles.left}>
              <div className={styles.icon} aria-hidden="true">
                {cat.icon}
              </div>
              <div>
                <div className={styles.title}>{tx.label || cat.label}</div>
                <div className={styles.date}>{relativeDate(tx.date)}</div>
              </div>
            </div>
            <div className={`${styles.amount} ${isIncome ? styles.pos : styles.neg}`}>
              {isIncome ? '+' : '−'}
              {formatMoney(tx.amount, tx.currency)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
