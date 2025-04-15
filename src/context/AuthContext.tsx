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
  partnerEmail?: string
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
  updatePartnerInfo: (partnerId?: string, partnerEmail?: string) => Promise<boolean>
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

        // We'll finish loading regardless of whether a user was found
        setLoading(false)
      } catch (error) {
        console.error("Failed to load user:", error)
        setLoading(false)
      }
    }

    loadUser()

    // Set up a listener for changes to the user in AsyncStorage
    const handleStorageChange = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error handling storage change:", error)
      }
    }

    // This is a simplified approach - in a real app, you'd use proper event listeners
    // or a state management library like Redux
    const interval = setInterval(handleStorageChange, 1000)

    return () => clearInterval(interval)
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
        partnerEmail: "partner@example.com",
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
      return true // Return success status
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

  // Update the updateProfile function to save changes to both AsyncStorage and the backend
  const updateProfile = async (params: UpdateProfileParams) => {
    try {
      setLoading(true)
      if (!user) throw new Error("No user logged in")

      // Update user object
      const updatedUser = { ...user, ...params }

      // Save to backend API
      const API_URL = "https://amoro-backend-3gsl.onrender.com"
      const userData = {
        uid: user.id,
        data: {
          email: user.email,
          username: params.username || user.username,
          Name: params.displayName || user.displayName,
          Hobbies: params.hobbies
            ? params.hobbies.split(",").map((hobby) => hobby.trim())
            : user.hobbies
              ? user.hobbies.split(",").map((hobby) => hobby.trim())
              : [],
          Birthdate: params.birthday || user.birthday,
          Phone: params.phone || user.phone,
          photoURL: params.photoURL || user.photoURL,
        },
      }

      // Send PUT request to update user data
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

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

  const updatePartnerInfo = async (partnerId?: string, partnerEmail?: string) => {
    try {
      if (!user) throw new Error("No user logged in")

      // Update user object with partner info
      const updatedUser = {
        ...user,
        partnerId: partnerId,
        partnerEmail: partnerEmail,
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))

      // Update state
      setUser(updatedUser)

      return true
    } catch (error) {
      console.error("Partner info update failed:", error)
      throw error
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
    updatePartnerInfo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
