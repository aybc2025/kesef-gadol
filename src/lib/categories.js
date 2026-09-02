// Expense categories — chosen with the user: food instead of candy-only,
// plus games, books, clothes, other.
export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'אוכל', icon: '🍎' },
  { id: 'games', label: 'משחקים', icon: '🎮' },
  { id: 'books', label: 'ספרים וכלים', icon: '📚' },
  { id: 'clothes', label: 'בגדים', icon: '👕' },
  { id: 'other', label: 'אחר', icon: '✨' },
]

// Income sources — quick-pick chips in the "add income" modal.
export const INCOME_SOURCES = [
  { id: 'allowance', label: 'דמי כיס', icon: '🎁' },
  { id: 'gift', label: 'מתנה', icon: '💝' },
  { id: 'chores', label: 'עבודה בבית', icon: '🧹' },
  { id: 'other', label: 'אחר', icon: '✨' },
]

export function findCategory(list, id) {
  return list.find((c) => c.id === id) || list[list.length - 1]
}
