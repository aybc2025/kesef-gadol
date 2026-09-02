import { HashRouter, Routes, Route } from 'react-router-dom'
import { TabBar } from './components/layout/TabBar'
import { HomePage } from './pages/HomePage'
import { ChartsPage } from './pages/ChartsPage'
import { GoalsPage } from './pages/GoalsPage'
import { HistoryPage } from './pages/HistoryPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      <TabBar />
    </HashRouter>
  )
}
