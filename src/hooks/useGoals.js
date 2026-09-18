import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../lib/storage'
import { DEFAULT_CURRENCY } from '../lib/currency'

function makeId() {
  return `goal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function useGoals() {
  const [goals, setGoals] = useLocalStorage(STORAGE_KEYS.goals, [])

  const addGoal = useCallback(
    ({ title, targetAmount, currency }) => {
      const goal = {
        id: makeId(),
        title: title?.trim() || 'יעד חדש',
        targetAmount: Math.abs(Number(targetAmount)) || 0,
        currency: currency || DEFAULT_CURRENCY,
        createdAt: new Date().toISOString(),
        achieved: false,
      }
      setGoals((prev) => [goal, ...prev])
      return goal
    },
    [setGoals]
  )

  const deleteGoal = useCallback(
    (id) => {
      setGoals((prev) => prev.filter((g) => g.id !== id))
    },
    [setGoals]
  )

  const markAchieved = useCallback(
    (id, achieved = true) => {
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, achieved } : g)))
    },
    [setGoals]
  )

  const resetAll = useCallback(() => {
    setGoals([])
  }, [setGoals])

  return { goals, addGoal, deleteGoal, markAchieved, resetAll }
}
