import { CURRENCIES } from '../../lib/currency'
import styles from './CurrencyToggle.module.css'

const ORDER = ['CAD', 'ILS']

export function CurrencyToggle({ value, onChange }) {
  return (
    <div className={styles.group} role="radiogroup" aria-label="מטבע">
      {ORDER.map((code) => {
        const currency = CURRENCIES[code]
        const active = value === code
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            className={`${styles.option} ${active ? styles.active : ''}`}
            onClick={() => onChange(code)}
          >
            <span className={styles.symbol}>{currency.symbol}</span>
            <span className={styles.label}>{currency.label}</span>
          </button>
        )
      })}
    </div>
  )
}
