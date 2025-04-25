export type Category = "fitness" | "nutrition" | "education" | "career" | "finance" | "other"

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"

export interface Habit {
  id: string
  title: string
  description?: string
  category: Category
  schedule: DayOfWeek[]
  frequency?: string // e.g., "Everyday", "2 times a week"
  completionHistory: Record<string, boolean> // date string -> completed
}

export interface CompletionData {
  date: string
  completed: boolean
  isToday: boolean
  isFuture: boolean
  dayOfWeek: string
  dayNumber: number
}
