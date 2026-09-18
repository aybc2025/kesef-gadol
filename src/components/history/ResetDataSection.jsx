import { useState } from 'react'
import { Modal } from '../shared/Modal'
import styles from './ResetDataSection.module.css'

const CONFIRM_WORD = 'איפוס'

export function ResetDataSection({ onConfirmReset }) {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')

  function handleClose() {
    setOpen(false)
    setTyped('')
  }

  function handleConfirm(e) {
    e.preventDefault()
    if (typed.trim() !== CONFIRM_WORD) return
    onConfirmReset()
    handleClose()
  }

  return (
    <div className={`${styles.wrap} no-print`}>
      <p className={styles.label}>אזור מסוכן</p>
      <button type="button" className={styles.resetBtn} onClick={() => setOpen(true)}>
        🗑️ איפוס הכל והתחלה מחדש
      </button>
      <p className={styles.hint}>
        זה ימחק את כל התנועות, היעדים והיתרה — לצמיתות, בלי אפשרות לשחזר.
        אם רוצים לשמור גיבוי קודם, כדאי ללחוץ קודם על "ייצוא JSON" למעלה.
      </p>

      <Modal open={open} onClose={handleClose} title="⚠️ בטוח שרוצים למחוק הכל?">
        <form onSubmit={handleConfirm} className={styles.form}>
          <p className={styles.warning}>
            פעולה זו תמחק את כל הנתונים — כל התנועות, כל היעדים, והיתרה תחזור ל-0.
            אי אפשר לבטל את זה אחרי שמאשרים.
          </p>
          <p className={styles.instruction}>
            כדי לאשר, יש להקליד את המילה <strong>{CONFIRM_WORD}</strong>:
          </p>
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            className={styles.confirmInput}
            placeholder={CONFIRM_WORD}
            autoFocus
            autoComplete="off"
          />
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={handleClose}>
              ביטול
            </button>
            <button
              type="submit"
              className={styles.confirmDelete}
              disabled={typed.trim() !== CONFIRM_WORD}
            >
              כן, למחוק הכל
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
