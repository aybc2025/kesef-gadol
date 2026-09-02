import { useState } from 'react'
import { Modal } from '../shared/Modal'
import { Chip } from '../shared/Chip'
import { CurrencyToggle } from '../shared/CurrencyToggle'
import { EXPENSE_CATEGORIES } from '../../lib/categories'
import { DEFAULT_CURRENCY } from '../../lib/currency'
import styles from './TransactionModal.module.css'

export function AddExpenseModal({ open, onClose, onAdd, defaultCurrency }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id)
  const [label, setLabel] = useState('')
  const [currency, setCurrency] = useState(defaultCurrency || DEFAULT_CURRENCY)

  function reset() {
    setAmount('')
    setCategory(EXPENSE_CATEGORIES[0].id)
    setLabel('')
    setCurrency(defaultCurrency || DEFAULT_CURRENCY)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleSubmit(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) return
    onAdd({
      type: 'expense',
      amount: value,
      category,
      label,
      currency,
    })
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="🛍️ הוצאתי כסף">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="expense-amount">כמה הוצאת?</label>
          <input
            id="expense-amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            autoFocus
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.amountInput}
            placeholder="0"
          />
        </div>

        <div className={styles.field}>
          <label>מטבע</label>
          <CurrencyToggle value={currency} onChange={setCurrency} />
        </div>

        <div className={styles.field}>
          <label>על מה?</label>
          <div className={styles.chipRow}>
            {EXPENSE_CATEGORIES.map((c) => (
              <Chip
                key={c.id}
                icon={c.icon}
                label={c.label}
                selected={category === c.id}
                onClick={() => setCategory(c.id)}
              />
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="expense-label">מה קנית? (רשות)</label>
          <input
            id="expense-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={styles.textInput}
            placeholder="למשל: פיצה עם חברים"
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={handleClose}>
            ביטול
          </button>
          <button type="submit" className={`${styles.confirm} ${styles.confirmExpense}`}>
            הוספה
          </button>
        </div>
      </form>
    </Modal>
  )
}
