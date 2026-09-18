import { useMemo, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../lib/storage'
import { DEFAULT_CURRENCY } from '../lib/currency'
import { calculateBalances, activeCurrencyBalances } from '../lib/calculations'

const DEFAULT_PROFILE = {
  childName: '',
  startingBalances: { [DEFAULT_CURRENCY]: 0 },
  defaultCurrency: DEFAULT_CURRENCY,
}

function makeId() {
  return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function useTransactions() {
  const [profile, setProfile] = useLocalStorage(STORAGE_KEYS.profile, DEFAULT_PROFILE)
  const [transactions, setTransactions] = useLocalStorage(STORAGE_KEYS.transactions, [])

  const startingBalances = profile.startingBalances || { [DEFAULT_CURRENCY]: 0 }

  const addTransaction = useCallback(
    ({ type, amount, label, category, date, currency }) => {
      const tx = {
        id: makeId(),
        type,
        amount: Math.abs(Number(amount)) || 0,
        label: label?.trim() || '',
        category: category || 'other',
        currency: currency || profile.defaultCurrency || DEFAULT_CURRENCY,
        date: date || new Date().toISOString(),
      }
      setTransactions((prev) => [tx, ...prev])
      return tx
    },
    [setTransactions, profile.defaultCurrency]
  )

  const deleteTransaction = useCallback(
    (id) => {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id))
    },
    [setTransactions]
  )

  const setStartingBalance = useCallback(
    (currency, amount) => {
      setProfile((prev) => ({
        ...prev,
        startingBalances: {
          ...prev.startingBalances,
          [currency]: Math.max(0, Number(amount) || 0),
        },
      }))
    },
    [setProfile]
  )

  const setChildName = useCallback(
    (name) => {
      setProfile((prev) => ({ ...prev, childName: name }))
    },
    [setProfile]
  )

  const setDefaultCurrency = useCallback(
    (currency) => {
      setProfile((prev) => ({ ...prev, defaultCurrency: currency }))
    },
    [setProfile]
  )

  // Resets both profile (name, starting balances, currency) and transactions
  // back to a clean slate. Goals live in a separate hook (useGoals) and are
  // reset independently — see HistoryPage's handleResetEverything.
  const resetAll = useCallback(() => {
    setProfile(DEFAULT_PROFILE)
    setTransactions([])
  }, [setProfile, setTransactions])

  const balances = useMemo(
    () => calculateBalances(startingBalances, transactions),
    [startingBalances, transactions]
  )

  const balanceList = useMemo(
    () => activeCurrencyBalances(startingBalances, transactions),
    [startingBalances, transactions]
  )

  const isNewUser = transactions.length === 0 && Object.values(startingBalances).every((v) => !v)

  return {
    profile,
    transactions,
    balances,
    balanceList,
    isNewUser,
    addTransaction,
    deleteTransaction,
    setStartingBalance,
    setChildName,
    setDefaultCurrency,
    resetAll,
  }
}
