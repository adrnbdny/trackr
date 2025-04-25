"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import type { Habit, Category } from "@/types/habit"
import { CategoryFilter } from "@/components/category-filter"
import { HabitCard } from "@/components/habit-card"
import { HabitForm } from "@/components/habit-form"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getCurrentWeekDates } from "@/utils/date-utils"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Home() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all")
  const [weekData, setWeekData] = useState(getCurrentWeekDates())
  const [formOpen, setFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  // Load habits from Supabase on initial render
  useEffect(() => {
    async function fetchHabits() {
      if (!user) return

      setIsLoading(true)

      try {
        // For development, use mock data if no habits exist
        const { data, error } = await supabase.from("habits").select("*").eq("user_id", user.id)

        if (error) {
          console.error("Error fetching habits:", error)
          setIsLoading(false)
          return
        }

        if (data.length === 0) {
          // Use mock data for development
          const mockHabits = [
            {
              id: "1",
              title: "Cardio",
              category: "fitness",
              schedule: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
              frequency: "Everyday",
              completionHistory: {
                "2023-04-18": true,
                "2023-04-19": true,
                "2023-04-20": false,
                "2023-04-21": true,
                "2023-04-22": true,
                "2023-04-23": true,
              },
            },
            {
              id: "2",
              title: "Yoga",
              category: "fitness",
              schedule: ["mon", "thu"],
              frequency: "2 times a week",
              completionHistory: {
                "2023-04-20": true,
                "2023-04-23": true,
              },
            },
            {
              id: "3",
              title: "Read 10 Pages",
              category: "education",
              schedule: ["mon", "tue", "wed", "thu"],
              frequency: "4 times a week",
              completionHistory: {
                "2023-04-18": true,
                "2023-04-19": true,
                "2023-04-20": true,
                "2023-04-21": false,
              },
            },
          ]
          setHabits(mockHabits)
          setIsLoading(false)
          return
        }

        // Fetch completions for each habit
        const habitsWithCompletions = await Promise.all(
          data.map(async (habit) => {
            const { data: completions, error: completionsError } = await supabase
              .from("completions")
              .select("date, completed")
              .eq("habit_id", habit.id)

            if (completionsError) {
              console.error("Error fetching completions:", completionsError)
              return {
                ...habit,
                completionHistory: {},
              }
            }

            const completionHistory: Record<string, boolean> = {}
            completions.forEach((completion) => {
              completionHistory[completion.date] = completion.completed
            })

            return {
              ...habit,
              completionHistory,
            }
          }),
        )

        setHabits(habitsWithCompletions)
      } catch (error) {
        console.error("Error in fetchHabits:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHabits()
  }, [user])

  const filteredHabits =
    selectedCategory === "all" ? habits : habits.filter((habit) => habit.category === selectedCategory)

  const handleToggleCompletion = async (habitId: string, date: string, completed: boolean) => {
    if (!user) return

    // Optimistically update UI
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          return {
            ...habit,
            completionHistory: {
              ...habit.completionHistory,
              [date]: completed,
            },
          }
        }
        return habit
      }),
    )

    // Update in database
    if (completed) {
      // Insert or update completion
      const { error } = await supabase.from("completions").upsert({
        habit_id: habitId,
        user_id: user.id,
        date,
        completed,
      })

      if (error) {
        console.error("Error updating completion:", error)
      }
    } else {
      // Delete completion
      const { error } = await supabase.from("completions").delete().eq("habit_id", habitId).eq("date", date)

      if (error) {
        console.error("Error deleting completion:", error)
      }
    }
  }

  const handleSaveHabit = async (habitData: Omit<Habit, "id" | "completionHistory"> & { id?: string }) => {
    if (!user) return

    if (habitData.id) {
      // Edit existing habit
      const { error } = await supabase
        .from("habits")
        .update({
          title: habitData.title,
          description: habitData.description,
          category: habitData.category,
          schedule: habitData.schedule,
          frequency: habitData.frequency,
          updated_at: new Date().toISOString(),
        })
        .eq("id", habitData.id)

      if (error) {
        console.error("Error updating habit:", error)
        return
      }

      // Update local state
      setHabits(habits.map((habit) => (habit.id === habitData.id ? { ...habit, ...habitData } : habit)))
    } else {
      // Create new habit
      const { data, error } = await supabase
        .from("habits")
        .insert({
          user_id: user.id,
          title: habitData.title,
          description: habitData.description,
          category: habitData.category,
          schedule: habitData.schedule,
          frequency: habitData.frequency,
        })
        .select()

      if (error) {
        console.error("Error creating habit:", error)
        return
      }

      // Add to local state
      const newHabit: Habit = {
        ...data[0],
        completionHistory: {},
      }

      setHabits([...habits, newHabit])
    }

    setEditingHabit(undefined)
    setFormOpen(false)
  }

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setFormOpen(true)
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (!user) return

    if (confirm("Are you sure you want to delete this habit? This action cannot be undone.")) {
      // Delete from database
      const { error } = await supabase.from("habits").delete().eq("id", habitId)

      if (error) {
        console.error("Error deleting habit:", error)
        return
      }

      // Update local state
      setHabits(habits.filter((habit) => habit.id !== habitId))
    }
  }

  const handleCreateHabit = () => {
    setEditingHabit(undefined)
    setFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm pt-4 pb-2 px-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-2xl font-bold">trackr</h1>
          </div>
          <span className="text-gray-400">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <p className="text-gray-400 text-sm">Your habits at a glance</p>
      </header>

      <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <main className="p-4 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : habits.length === 0 ? (
          <EmptyState onCreateHabit={handleCreateHabit} />
        ) : (
          filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              weekData={weekData}
              onToggleCompletion={handleToggleCompletion}
              onEditHabit={handleEditHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          ))
        )}
      </main>

      <div className="fixed bottom-6 right-6">
        <Button
          onClick={handleCreateHabit}
          size="icon"
          className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Habit</span>
        </Button>
      </div>

      <HabitForm open={formOpen} onOpenChange={setFormOpen} initialHabit={editingHabit} onSave={handleSaveHabit} />
    </div>
  )
}
