"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface EmptyStateProps {
  onCreateHabit: () => void
}

export function EmptyState({ onCreateHabit }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6">
        <PlusCircle className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">No habits yet</h2>
      <p className="text-gray-400 mb-6">Tap the + button below to create your first habit.</p>
      <Button onClick={onCreateHabit} size="lg">
        Create Your First Habit
      </Button>
    </div>
  )
}
