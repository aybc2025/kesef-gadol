import { useState, useCallback } from 'react'
import { readItem, writeItem } from '../lib/storage'

export function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => readItem(key, fallback))

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        writeItem(key, resolved)
        return resolved
      })
    },
    [key]
  )

  return [value, update]
}
