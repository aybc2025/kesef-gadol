import styles from './AppHeader.module.css'

export function AppHeader({ childName }) {
  const greeting = childName ? `שלום, ${childName} 👋` : 'שלום! 👋'
  const initial = childName ? childName.trim()[0] : '🙂'

  return (
    <header className={styles.header}>
      <div className={styles.name}>{greeting}</div>
      <div className={styles.avatar} aria-hidden="true">
        {initial}
      </div>
    </header>
  )
}
