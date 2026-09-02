// Downloads the full app state as a single JSON file — used both for the
// "export JSON" feature and as an informal backup before switching devices.
export function exportDataAsJson({ profile, transactions, goals }) {
  const payload = {
    exportedAt: new Date().toISOString(),
    appVersion: 1,
    profile,
    transactions,
    goals,
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const dateStr = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `כסף-גדול-גיבוי-${dateStr}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
