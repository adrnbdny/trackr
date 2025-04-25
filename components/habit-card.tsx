"use client"

import { useState } from "react"
import type { Habit, CompletionData } from "@/types/habit"
import { MoreVertical, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface HabitCardProps {
  habit: Habit
  weekData: CompletionData[]
  onToggleCompletion: (habitId: string, date: string, completed: boolean) => void
  onEditHabit: (habit: Habit) => void
  onDeleteHabit: (habitId: string) => void
}

export function HabitCard({ habit, weekData, onToggleCompletion, onEditHabit, onDeleteHabit }: HabitCardProps) {
  const [showCompletionCard, setShowCompletionCard] = useState(false)

  // Merge habit completion history with week data
  const mergedWeekData = weekData.map((day) => ({
    ...day,
    completed: habit.completionHistory[day.date] || false,
  }))

  const handleToggleToday = (date: string, currentStatus: boolean) => {
    if (new Date(date) > new Date()) return // Can't toggle future dates

    const newStatus = !currentStatus
    onToggleCompletion(habit.id, date, newStatus)

    if (newStatus) {
      setShowCompletionCard(true)
    }
  }

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      fitness: "bg-category-fitness",
      nutrition: "bg-category-nutrition",
      education: "bg-category-education",
      career: "bg-category-career",
      finance: "bg-category-finance",
      other: "bg-category-other",
    }
    return colorMap[category] || "bg-gray-500"
  }

  const getTextColor = (category: string) => {
    const colorMap: Record<string, string> = {
      fitness: "text-category-fitness",
      nutrition: "text-category-nutrition",
      education: "text-category-education",
      career: "text-category-career",
      finance: "text-category-finance",
      other: "text-category-other",
    }
    return colorMap[category] || "text-gray-500"
  }

  return (
    <div
      className={cn(
        "rounded-lg p-4 mb-4",
        habit.category === "fitness"
          ? "bg-blue-950/50"
          : habit.category === "nutrition"
            ? "bg-purple-950/50"
            : habit.category === "education"
              ? "bg-amber-950/50"
              : habit.category === "finance"
                ? "bg-green-950/50"
                : "bg-gray-800/50",
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={cn("w-6 h-6 rounded-full mr-3", getCategoryColor(habit.category))}></div>
          <h3 className="text-xl font-semibold text-white">{habit.title}</h3>
        </div>
        <div className="flex items-center">
          <span className="text-gray-400 mr-2 text-sm">{habit.frequency}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-gray-700">
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditHabit(habit)}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={() => onDeleteHabit(habit.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex justify-between">
        {mergedWeekData.map((day) => (
          <button
            key={day.date}
            onClick={() => day.isToday && handleToggleToday(day.date, day.completed)}
            disabled={!day.isToday && !day.completed}
            className={cn(
              "flex flex-col items-center justify-center w-10 h-10 rounded-full relative",
              day.isFuture ? "opacity-30" : "opacity-100",
              day.completed ? getCategoryColor(habit.category) : "bg-transparent border-2",
              day.completed ? "text-white" : getTextColor(habit.category),
              day.isToday && "ring-2 ring-white",
            )}
          >
            <span className="text-xs font-medium">{day.dayNumber}</span>
            {day.completed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <Sheet open={showCompletionCard} onOpenChange={setShowCompletionCard}>
        <SheetContent side="bottom" className="bg-gray-900 text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Completed: {habit.title}</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <p className="text-gray-400 mb-4">What would you like to do next?</p>
            <div className="flex flex-col space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Add Reflection
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Chat with Specialist
              </Button>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={() => setShowCompletionCard(false)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
