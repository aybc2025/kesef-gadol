import { useState } from 'react'
import { Modal } from '../shared/Modal'
import { Chip } from '../shared/Chip'
import { CurrencyToggle } from '../shared/CurrencyToggle'
import { INCOME_SOURCES } from '../../lib/categories'
import { DEFAULT_CURRENCY } from '../../lib/currency'
import styles from './TransactionModal.module.css'

export function AddIncomeModal({ open, onClose, onAdd, defaultCurrency }) {
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState(INCOME_SOURCES[0].id)
  const [currency, setCurrency] = useState(defaultCurrency || DEFAULT_CURRENCY)

  function reset() {
    setAmount('')
    setSource(INCOME_SOURCES[0].id)
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
    const chosen = INCOME_SOURCES.find((s) => s.id === source)
    onAdd({
      type: 'income',
      amount: value,
      category: source,
      label: chosen?.label,
      currency,
    })
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="💰 קיבלתי כסף">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="income-amount">כמה קיבלת?</label>
          <input
            id="income-amount"
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
          <label>ממי / על מה?</label>
          <div className={styles.chipRow}>
            {INCOME_SOURCES.map((s) => (
              <Chip
                key={s.id}
                icon={s.icon}
                label={s.label}
                selected={source === s.id}
                onClick={() => setSource(s.id)}
              />
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={handleClose}>
            ביטול
          </button>
          <button type="submit" className={styles.confirm}>
            הוספה 🌱
          </button>
        </div>
      </form>
    </Modal>
  )
}
