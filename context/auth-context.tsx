"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUpWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  authError: string | null
  clearAuthError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function getSession() {
      setIsLoading(true)

      // Check active session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Error getting session:", error)
      }

      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        // Refresh the page to update the UI
        if (session) {
          router.refresh()
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    getSession()
  }, [router])

  const clearAuthError = () => {
    setAuthError(null)
  }

  const signInWithPassword = async (email: string, password: string) => {
    setAuthError(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Error signing in:", error)

        // Provide more user-friendly error messages
        if (error.message === "Invalid login credentials") {
          setAuthError("The email or password you entered is incorrect. Please try again or sign up for a new account.")
        } else {
          setAuthError(error.message)
        }

        setIsLoading(false)
        return { success: false, error: error.message }
      }

      setIsLoading(false)
      return { success: true }
    } catch (error: any) {
      console.error("Error signing in:", error)
      const errorMessage = error.message || "An error occurred during sign in"
      setAuthError(errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  const signUpWithPassword = async (email: string, password: string) => {
    setAuthError(null)
    setIsLoading(true)

    try {
      // First check if user already exists
      const { data: userData } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      })

      // If we get here without an error, the user likely exists
      // Proceed with signup which will either create a new user or return an error if the user exists

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Error signing up:", error)

        // Provide more user-friendly error messages
        if (error.message.includes("already registered")) {
          setAuthError("This email is already registered. Please try signing in instead.")
        } else {
          setAuthError(error.message)
        }

        setIsLoading(false)
        return { success: false, error: error.message }
      }

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        setAuthError("This email is already registered. Please try signing in instead.")
        setIsLoading(false)
        return { success: false, error: "Email already registered" }
      }

      if (data?.user?.identities && data.user.identities.length === 0) {
        setAuthError("This email is already registered. Please try signing in instead.")
        setIsLoading(false)
        return { success: false, error: "Email already registered" }
      }

      setIsLoading(false)
      return { success: true }
    } catch (error: any) {
      console.error("Error signing up:", error)
      const errorMessage = error.message || "An error occurred during sign up"
      setAuthError(errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    authError,
    clearAuthError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
