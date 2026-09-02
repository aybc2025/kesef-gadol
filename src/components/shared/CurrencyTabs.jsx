import { CURRENCIES } from '../../lib/currency'
import styles from './CurrencyTabs.module.css'

export function CurrencyTabs({ available, value, onChange }) {
  if (available.length <= 1) return null

  return (
    <div className={styles.tabs} role="tablist" aria-label="בחירת מטבע להצגה">
      {available.map((code) => {
        const currency = CURRENCIES[code]
        const active = value === code
        return (
          <button
            key={code}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${styles.tab} ${active ? styles.active : ''}`}
            onClick={() => onChange(code)}
          >
            {currency.symbol} {currency.label}
          </button>
        )
      })}
    </div>
  )
}
