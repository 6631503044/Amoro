"use client"

import { createContext, useContext } from "react"

type UserContextType = {
  userId: string
  setUserId: (userId: string) => void
}


const UserContext = createContext<UserContextType | null>(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

