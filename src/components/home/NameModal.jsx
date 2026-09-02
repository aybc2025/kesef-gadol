import { useState, useEffect } from 'react'
import { Modal } from '../shared/Modal'
import styles from '../modals/TransactionModal.module.css'

// Lets the kid set or change the name shown in the header greeting.
// Opened from the header on the home screen.
export function NameModal({ open, initialName = '', onClose, onSave }) {
  const [name, setName] = useState(initialName)

  useEffect(() => {
    if (open) setName(initialName)
  }, [open, initialName])

  function handleSubmit(e) {
    e.preventDefault()
    onSave(name.trim())
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="👋 איך קוראים לך?">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="child-name">השם שלך</label>
          <input
            id="child-name"
            type="text"
            autoFocus
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.textInput}
            placeholder="למשל: גלי"
          />
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            ביטול
          </button>
          <button type="submit" className={styles.confirm}>
            שמירה
          </button>
        </div>
      </form>
    </Modal>
  )
}
