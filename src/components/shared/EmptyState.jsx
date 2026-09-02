import { useState } from 'react'
import { CurrencyToggle } from './CurrencyToggle'
import { DEFAULT_CURRENCY } from '../../lib/currency'
import styles from './EmptyState.module.css'

export function EmptyState({ onSetStartingBalance, onSetChildName }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY)

  function handleSubmit(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value < 0) return
    if (name.trim()) onSetChildName?.(name.trim())
    onSetStartingBalance(currency, value)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.plant} aria-hidden="true">🌱</div>
      <p className={styles.headline}>עוד אין לך כסף רשום</p>
      <p className={styles.body}>בואו נתחיל! איך קוראים לך, וכמה כסף יש לך עכשיו בארנק או בקופה?</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="איך קוראים לך?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          aria-label="השם שלך"
          maxLength={20}
        />
        <CurrencyToggle value={currency} onChange={setCurrency} />
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.input}
          aria-label="סכום היתרה ההתחלתית"
        />
        <button type="submit" className={styles.submit}>
          הזנת יתרה התחלתית
        </button>
      </form>
    </div>
  )
}
