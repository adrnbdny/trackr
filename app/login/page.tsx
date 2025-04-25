"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const { user, signInWithEmail, isLoading, authError } = useAuth()
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/")
    }
  }, [user, isLoading, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signInWithEmail(email)
    if (result.success) {
      setEmailSent(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">trackr</h1>
          <p className="mt-2 text-gray-400">Track your habits. Build your streaks.</p>
        </div>

        {authError && (
          <Alert variant="destructive" className="bg-red-900 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {emailSent ? (
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-gray-400 mb-4">
              We've sent a magic link to <span className="text-white">{email}</span>
            </p>
            <p className="text-gray-400">Click the link in the email to sign in to your account.</p>
            <Button className="mt-4" variant="outline" onClick={() => setEmailSent(false)}>
              Use a different email
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading || !email}
              >
                <Mail className="h-5 w-5" />
                <span>{isLoading ? "Sending..." : "Sign in with Email"}</span>
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-400">We'll send you a magic link to sign in instantly.</p>
          </div>
        )}
      </div>
    </div>
  )
}
