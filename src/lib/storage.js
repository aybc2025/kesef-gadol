const PREFIX = 'kesefGadol:'

/**
 * Thin, safe wrapper around localStorage. Every read is guarded against
 * missing keys, corrupted JSON, or a browser that blocks storage entirely
 * (private browsing in some browsers throws on write).
 */
export function readItem(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.warn(`kesefGadol: failed to read "${key}" from storage`, err)
    return fallback
  }
}

export function writeItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn(`kesefGadol: failed to write "${key}" to storage`, err)
    return false
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch (err) {
    console.warn(`kesefGadol: failed to remove "${key}" from storage`, err)
  }
}

export const STORAGE_KEYS = {
  transactions: 'transactions',
  goals: 'goals',
  profile: 'profile',
}
