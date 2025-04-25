"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type CompletionData = {
  date: string
  completedCount: number
  totalCount: number
  percentage: number
}

type CategoryData = {
  category: string
  count: number
  color: string
}

export default function InsightsPage() {
  const { user } = useAuth()
  const [completionData, setCompletionData] = useState<CompletionData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<"week" | "month">("month")

  useEffect(() => {
    async function fetchInsightsData() {
      if (!user) return

      setIsLoading(true)

      // Mock data for development
      const mockCompletionData: CompletionData[] = Array.from({ length: 30 }).map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - 29 + i)
        return {
          date: date.toISOString().split("T")[0],
          completedCount: Math.floor(Math.random() * 5),
          totalCount: 5,
          percentage: Math.floor(Math.random() * 100),
        }
      })

      const mockCategoryData: CategoryData[] = [
        { category: "fitness", count: 15, color: "#3b82f6" },
        { category: "nutrition", count: 8, color: "#8b5cf6" },
        { category: "education", count: 12, color: "#f59e0b" },
        { category: "career", count: 5, color: "#f97316" },
        { category: "finance", count: 10, color: "#10b981" },
      ]

      setCompletionData(mockCompletionData)
      setCategoryData(mockCategoryData)
      setIsLoading(false)
    }

    fetchInsightsData()
  }, [user, timeframe])

  // Calculate overall completion percentage
  const overallPercentage =
    completionData.length > 0
      ? Math.round(
          (completionData.reduce((sum, day) => sum + day.completedCount, 0) /
            completionData.reduce((sum, day) => sum + day.totalCount, 0)) *
            100,
        )
      : 0

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm pt-4 pb-2 px-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-2xl font-bold">Insights</h1>
          </div>
        </div>
        <p className="text-gray-400 text-sm">Track your progress and trends</p>
      </header>

      <main className="p-4 pb-24">
        <Tabs
          defaultValue="month"
          className="w-full"
          onValueChange={(value) => setTimeframe(value as "week" | "month")}
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="week">Last 7 Days</TabsTrigger>
              <TabsTrigger value="month">Last 30 Days</TabsTrigger>
            </TabsList>
            <div className="text-right">
              <div className="text-sm text-gray-400">Completion Rate</div>
              <div className="text-2xl font-bold">{isNaN(overallPercentage) ? 0 : overallPercentage}%</div>
            </div>
          </div>

          <TabsContent value="week" className="mt-0">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Weekly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">Chart visualization will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="mt-0">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">Chart visualization will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-400">Radar chart visualization will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
