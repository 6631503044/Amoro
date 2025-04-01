"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type User = {
  id: string
  email: string
  displayName: string
  username?: string
  birthday?: string
  hobbies?: string
  phone?: string
  photoURL?: string
  partnerId?: string
}

type UpdateProfileParams = {
  displayName?: string
  username?: string
  birthday?: string
  hobbies?: string
  phone?: string
  photoURL?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    displayName: string,
    username?: string,
    birthday?: string,
    hobbies?: string,
    phone?: string,
  ) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  updateProfile?: (params: UpdateProfileParams) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      // Mock authentication
      const mockUser: User = {
        id: "123",
        email,
        displayName: "John Doe",
        photoURL: "https://via.placeholder.com/150",
        partnerId: "456",
      }

      await AsyncStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    username?: string,
    birthday?: string,
    hobbies?: string,
    phone?: string,
  ) => {
    try {
      setLoading(true)
      // Mock registration
      const mockUser: User = {
        id: "123",
        email,
        displayName,
        username,
        birthday,
        hobbies,
        phone,
        photoURL: "https://via.placeholder.com/150",
      }

      await AsyncStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Sign out failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      // Mock successful Google auth
      const mockUser: User = {
        id: "789",
        email: "google@example.com",
        displayName: "Google User",
        photoURL: "https://via.placeholder.com/150",
      }

      await AsyncStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Google sign in failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithApple = async () => {
    try {
      setLoading(true)
      // Mock Apple authentication
      const mockUser: User = {
        id: "101",
        email: "apple@example.com",
        displayName: "Apple User",
        photoURL: "https://via.placeholder.com/150",
      }

      await AsyncStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Apple sign in failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (params: UpdateProfileParams) => {
    try {
      setLoading(true)
      if (!user) throw new Error("No user logged in")

      // Update user object
      const updatedUser = { ...user, ...params }

      // Save to storage
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))

      // Update state
      setUser(updatedUser)
    } catch (error) {
      console.error("Profile update failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider

