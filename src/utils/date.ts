export function getProjectMonths(start: string, end: string) {
  const months: string[] = []

  let current = new Date(start)
  const last = new Date(end)

  // normalize both to first of month
  current = new Date(current.getFullYear(), current.getMonth(), 1)
  const endMonth = new Date(last.getFullYear(), last.getMonth(), 1)

  while (current <= endMonth) {
    //months.push(current.toISOString().slice(0, 7))
    //current = new Date(current.getFullYear(), current.getMonth() + 1, 1)
    const y = current.getFullYear()
    const m = String(current.getMonth() + 1).padStart(2, '0')
    months.push(`${y}-${m}`)
    current = new Date(y, current.getMonth() + 1, 1)
  }

  return months
}