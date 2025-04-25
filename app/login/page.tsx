"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Lock, Mail, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const { user, signInWithPassword, isLoading, authError, clearAuthError } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showHelp, setShowHelp] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/")
    }

    // Clear any auth errors when the component mounts
    clearAuthError()
  }, [user, isLoading, router, clearAuthError])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signInWithPassword(email, password)
    if (result.success) {
      router.push("/")
    } else {
      // Show help message if login fails
      setShowHelp(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">trackr</h1>
          <p className="mt-2 text-gray-400">Track your habits. Build your streaks.</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4 bg-red-900 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            {showHelp && !authError && (
              <Alert className="mb-4 bg-blue-900 border-blue-800">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  If you haven't created an account yet, please{" "}
                  <Link href="/signup" className="font-medium underline">
                    sign up here
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="bg-gray-800 border-gray-700 pl-10"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-gray-800 border-gray-700 pl-10"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading || !email || !password}
              >
                <span>{isLoading ? "Signing in..." : "Sign In"}</span>
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center w-full">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-500 hover:text-blue-400">
                  Sign up
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Test account information */}
        <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <h3 className="text-white font-medium mb-2">Test Account</h3>
          <p className="text-gray-400 text-sm mb-2">
            For testing purposes, you can create a new account using the sign-up page.
          </p>
          <div className="bg-gray-800 p-2 rounded text-sm text-gray-300">
            <p>1. Click "Sign up" to create a new account</p>
            <p>2. Enter your email and create a password (min 6 characters)</p>
            <p>3. Use these credentials to sign in</p>
          </div>
        </div>
      </div>
    </div>
  )
}
