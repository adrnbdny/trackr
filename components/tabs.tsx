"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2, MessageSquare, BookOpen, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function Tabs() {
  const pathname = usePathname()

  const tabs = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      name: "Insights",
      href: "/insights",
      icon: BarChart2,
      active: pathname === "/insights",
    },
    {
      name: "AI Specialists",
      href: "/specialists",
      icon: MessageSquare,
      active: pathname === "/specialists",
    },
    {
      name: "Reflections",
      href: "/reflections",
      icon: BookOpen,
      active: pathname === "/reflections",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
      <nav className="flex justify-around">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn("flex flex-col items-center py-3 px-2", tab.active ? "text-white" : "text-gray-500")}
          >
            <tab.icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{tab.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
