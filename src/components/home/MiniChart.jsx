import styles from './MiniChart.module.css'

// Small sparkline-like bar chart. Values are 0..1 ratios; the caller is
// responsible for normalizing. Highlights the last bar by default since
// that's usually "now".
export function MiniChart({ values, highlightLast = true }) {
  const max = Math.max(...values, 1)
  return (
    <div className={styles.chart}>
      {values.map((v, i) => (
        <div
          key={i}
          className={`${styles.bar} ${highlightLast && i === values.length - 1 ? styles.hi : ''}`}
          style={{ height: `${Math.max(6, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}
