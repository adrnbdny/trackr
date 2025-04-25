"use client"

import type { Category } from "@/types/habit"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  selectedCategory: Category | "all"
  onSelectCategory: (category: Category | "all") => void
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const categories: { id: Category | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "fitness", label: "Fitness" },
    { id: "nutrition", label: "Diet" },
    { id: "finance", label: "Finances" },
    { id: "other", label: "Other" },
  ]

  return (
    <div className="flex overflow-x-auto pb-2 px-4 scrollbar-hide">
      <div className="flex space-x-2 w-full">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              selectedCategory === category.id
                ? category.id === "all"
                  ? "bg-blue-500 text-white"
                  : `bg-category-${category.id} text-white`
                : "bg-gray-800 text-gray-300",
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}
