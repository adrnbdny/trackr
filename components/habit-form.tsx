"use client"

import { useState } from "react"
import type { Habit, Category, DayOfWeek } from "@/types/habit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getFrequencyText } from "@/utils/date-utils"

interface HabitFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialHabit?: Habit
  onSave: (habit: Omit<Habit, "id" | "completionHistory"> & { id?: string }) => void
}

export function HabitForm({ open, onOpenChange, initialHabit, onSave }: HabitFormProps) {
  const [title, setTitle] = useState(initialHabit?.title || "")
  const [description, setDescription] = useState(initialHabit?.description || "")
  const [category, setCategory] = useState<Category>(initialHabit?.category || "fitness")
  const [schedule, setSchedule] = useState<DayOfWeek[]>(initialHabit?.schedule || ["mon", "tue", "wed", "thu", "fri"])

  const daysOfWeek: { value: DayOfWeek; label: string }[] = [
    { value: "mon", label: "Monday" },
    { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" },
    { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" },
    { value: "sat", label: "Saturday" },
    { value: "sun", label: "Sunday" },
  ]

  const categories: { value: Category; label: string }[] = [
    { value: "fitness", label: "Fitness" },
    { value: "nutrition", label: "Nutrition" },
    { value: "education", label: "Education" },
    { value: "career", label: "Career" },
    { value: "finance", label: "Finance" },
    { value: "other", label: "Other" },
  ]

  const toggleDay = (day: DayOfWeek) => {
    if (schedule.includes(day)) {
      setSchedule(schedule.filter((d) => d !== day))
    } else {
      setSchedule([...schedule, day])
    }
  }

  const handleSubmit = () => {
    if (!title || !category || schedule.length === 0) return

    onSave({
      id: initialHabit?.id,
      title,
      description,
      category,
      schedule,
      frequency: getFrequencyText(schedule),
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>{initialHabit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="category">Category</label>
            <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description">Description (Optional)</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="grid gap-2">
            <label>Schedule (Select at least one day)</label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={schedule.includes(day.value) ? "default" : "outline"}
                  onClick={() => toggleDay(day.value)}
                  className="flex-1"
                >
                  {day.label.substring(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-gray-800 hover:bg-gray-700">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !category || schedule.length === 0}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
