import { useState } from 'react'
import { Modal } from '../shared/Modal'
import { CurrencyToggle } from '../shared/CurrencyToggle'
import { DEFAULT_CURRENCY } from '../../lib/currency'
import styles from '../modals/TransactionModal.module.css'

export function GoalForm({ open, onClose, onAdd, defaultCurrency }) {
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currency, setCurrency] = useState(defaultCurrency || DEFAULT_CURRENCY)

  function reset() {
    setTitle('')
    setTargetAmount('')
    setCurrency(defaultCurrency || DEFAULT_CURRENCY)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleSubmit(e) {
    e.preventDefault()
    const value = Number(targetAmount)
    if (!title.trim() || !Number.isFinite(value) || value <= 0) return
    onAdd({ title, targetAmount: value, currency })
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="🎯 יעד חיסכון חדש">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="goal-title">על מה חוסכים?</label>
          <input
            id="goal-title"
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.textInput}
            placeholder="למשל: אוזניות"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="goal-amount">כמה זה עולה?</label>
          <input
            id="goal-amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            required
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className={styles.amountInput}
            placeholder="0"
          />
        </div>

        <div className={styles.field}>
          <label>מטבע</label>
          <CurrencyToggle value={currency} onChange={setCurrency} />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={handleClose}>
            ביטול
          </button>
          <button type="submit" className={styles.confirm}>
            יצירת יעד
          </button>
        </div>
      </form>
    </Modal>
  )
}
