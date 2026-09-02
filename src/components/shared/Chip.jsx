import styles from './Chip.module.css'

export function Chip({ icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span aria-hidden="true">{icon}</span> {label}
    </button>
  )
}
