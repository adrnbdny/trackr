import type { CompletionData } from "@/types/habit"

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function getCurrentWeekDates(): CompletionData[] {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
  const result: CompletionData[] = []

  // Start from Friday (5 days before the current day of week)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - ((dayOfWeek + 2) % 7))

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    const dateString = formatDate(currentDate)
    const isToday = formatDate(today) === dateString
    const isFuture = currentDate > today

    result.push({
      date: dateString,
      completed: false, // This will be filled in from habit data
      isToday,
      isFuture,
      dayOfWeek: dayNames[currentDate.getDay()],
      dayNumber: currentDate.getDate(),
    })
  }

  return result
}

export function getFrequencyText(schedule: string[]): string {
  if (schedule.length === 7) return "Everyday"
  if (schedule.length === 1) return "Once a week"
  return `${schedule.length} times a week`
}
