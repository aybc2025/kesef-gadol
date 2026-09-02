import styles from './AppHeader.module.css'

export function AppHeader({ childName, onEditName }) {
  const greeting = childName ? `שלום, ${childName} 👋` : 'שלום! 👋'
  const initial = childName ? childName.trim()[0] : '🙂'

  const inner = (
    <>
      <span className={styles.name}>{greeting}</span>
      <span className={styles.avatar} aria-hidden="true">
        {initial}
      </span>
    </>
  )

  if (onEditName) {
    return (
      <header className={styles.header}>
        <button
          type="button"
          className={styles.identityButton}
          onClick={onEditName}
          aria-label={childName ? `שינוי השם (${childName})` : 'הוספת השם שלך'}
        >
          {inner}
        </button>
      </header>
    )
  }

  return <header className={styles.header}>{inner}</header>
}
