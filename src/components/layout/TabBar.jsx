import { NavLink } from 'react-router-dom'
import styles from './TabBar.module.css'

const TABS = [
  { to: '/', icon: '🏠', label: 'בית', end: true },
  { to: '/charts', icon: '📊', label: 'גרפים' },
  { to: '/goals', icon: '🎯', label: 'יעדים' },
  { to: '/history', icon: '📜', label: 'היסטוריה' },
]

export function TabBar() {
  return (
    <nav className={`${styles.tabbar} no-print`} aria-label="ניווט ראשי">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
        >
          <span aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
