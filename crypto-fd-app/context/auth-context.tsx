"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to restore auth state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // This is a mock implementation
    // In a real app, you would call your authentication API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          // Mock successful login
          const newUser = { id: `user_${Date.now()}`, email }
          setUser(newUser)
          localStorage.setItem("user", JSON.stringify(newUser))
          resolve()
        } catch (error) {
          reject(error)
        }
      }, 1000)
    })
  }

  const signup = async (email: string, password: string) => {
    // This is a mock implementation
    // In a real app, you would call your authentication API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          // Mock successful signup
          const newUser = { id: `user_${Date.now()}`, email }
          setUser(newUser)
          localStorage.setItem("user", JSON.stringify(newUser))
          resolve()
        } catch (error) {
          reject(error)
        }
      }, 1000)
    })
  }

  const logout = async () => {
    // This is a mock implementation
    // In a real app, you would call your authentication API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(null)
        localStorage.removeItem("user")
        resolve()
      }, 500)
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
