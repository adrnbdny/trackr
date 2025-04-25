"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2, MessageSquare, BookOpen, Settings, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navItems = [
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
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">trackr</h1>
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={item.active}>
                <Link href={item.href} className="flex items-center">
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      {user && (
        <SidebarFooter className="space-y-2">
          <div className="px-3 py-2">
            <p className="text-xs text-gray-400">Signed in as</p>
            <p className="text-sm font-medium truncate">{user.email}</p>
          </div>
          <Button variant="outline" onClick={signOut} className="w-full">
            Sign Out
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
