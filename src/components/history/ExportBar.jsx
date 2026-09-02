import styles from './ExportBar.module.css'

export function ExportBar({ onExportJson, onExportPdf }) {
  return (
    <div className={`${styles.bar} no-print`}>
      <button type="button" className={styles.btn} onClick={onExportPdf}>
        📄 ייצוא PDF
      </button>
      <button type="button" className={styles.btn} onClick={onExportJson}>
        💾 ייצוא JSON
      </button>
    </div>
  )
}
