import { formatMoney, CURRENCIES } from '../../lib/currency'
import { EXPENSE_CATEGORIES, INCOME_SOURCES, findCategory } from '../../lib/categories'
import styles from './MonthlyReport.module.css'

const MONTH_NAMES_HE = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
]

function monthLabel(monthKeyStr) {
  const [year, month] = monthKeyStr.split('-').map(Number)
  return `${MONTH_NAMES_HE[month - 1]} ${year}`
}

// The printable body for a monthly report. Rendered off-screen (or inline,
// hidden by print.css) and only made visible by @media print — so it is
// styled purely for paper: no interactive chrome, generous whitespace,
// clean type hierarchy.
export function MonthlyReport({
  monthKeyStr,
  currency,
  childName,
  openingBalance,
  totals,
  categoryBreakdown,
  transactions,
}) {
  const sortedTx = transactions
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className={`report-print-root ${styles.report}`}>
      <div className={styles.reportHeader}>
        <div className={styles.reportEyebrow}>כסף גדול</div>
        <div className={styles.reportTitle}>דוח חודשי — {monthLabel(monthKeyStr)}</div>
        <div className={styles.reportSubtitle}>
          {childName ? `${childName} · ` : ''}
          מטבע: {CURRENCIES[currency]?.label} ({CURRENCIES[currency]?.symbol})
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>יתרת פתיחה</div>
          <div className={styles.summaryValue}>{formatMoney(openingBalance, currency)}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>סה״כ נכנס</div>
          <div className={`${styles.summaryValue} ${styles.income}`}>
            +{formatMoney(totals.totalIn, currency)}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>סה״כ יצא</div>
          <div className={`${styles.summaryValue} ${styles.expense}`}>
            −{formatMoney(totals.totalOut, currency)}
          </div>
        </div>
      </div>

      <div className={styles.summaryGrid} style={{ gridTemplateColumns: '1fr' }}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>יתרת סגירה (שינוי נטו: {totals.net >= 0 ? '+' : ''}{formatMoney(totals.net, currency)})</div>
          <div className={`${styles.summaryValue} ${styles.net}`}>
            {formatMoney(openingBalance + totals.net, currency)}
          </div>
        </div>
      </div>

      <div className={styles.sectionTitle}>הוצאות לפי קטגוריה</div>
      {categoryBreakdown.length === 0 ? (
        <p className={styles.emptyNote}>אין הוצאות בחודש זה.</p>
      ) : (
        categoryBreakdown
          .slice()
          .sort((a, b) => b.amount - a.amount)
          .map((c) => (
            <div className={styles.categoryRow} key={c.category}>
              <span>
                {findCategory(EXPENSE_CATEGORIES, c.category).icon}{' '}
                {findCategory(EXPENSE_CATEGORIES, c.category).label}
              </span>
              <span>{formatMoney(c.amount, currency)}</span>
            </div>
          ))
      )}

      <div className={styles.sectionTitle}>כל התנועות בחודש</div>
      {sortedTx.length === 0 ? (
        <p className={styles.emptyNote}>אין תנועות בחודש זה.</p>
      ) : (
        <table className={styles.txTable}>
          <thead>
            <tr>
              <th>תאריך</th>
              <th>תיאור</th>
              <th>קטגוריה</th>
              <th>סכום</th>
            </tr>
          </thead>
          <tbody>
            {sortedTx.map((tx) => {
              const isIncome = tx.type === 'income'
              const cat = findCategory(isIncome ? INCOME_SOURCES : EXPENSE_CATEGORIES, tx.category)
              return (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString('he-IL')}</td>
                  <td>{tx.label || cat.label}</td>
                  <td>{cat.icon} {cat.label}</td>
                  <td className={`${styles.txAmount} ${isIncome ? styles.income : styles.expense}`}>
                    {isIncome ? '+' : '−'}{formatMoney(tx.amount, tx.currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <div className={styles.footer}>
        הופק על ידי אפליקציית כסף גדול · {new Date().toLocaleDateString('he-IL')}
      </div>
    </div>
  )
}
