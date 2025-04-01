"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

type ThemeType = "light" | "dark" | "system"

interface ThemeColors {
  primary: string
  background: string
  card: string
  text: string
  border: string
  notification: string
  secondaryText: string
  personalActivity: string
  coupleActivity: string
}

interface ThemeContextType {
  theme: {
    mode: ThemeType
    colors: ThemeColors
  }
  toggleTheme: () => void
  setThemeMode: (mode: ThemeType) => void
}

const lightColors: ThemeColors = {
  primary: "#FF6B8B", // Pink for couple-oriented app
  background: "#FFFFFF",
  card: "#F9F9F9",
  text: "#333333",
  border: "#E0E0E0",
  notification: "#FF3B30",
  secondaryText: "#666666",
  personalActivity: "#4A90E2", // Blue for personal activities
  coupleActivity: "#FF6B8B", // Pink for couple activities
}

const darkColors: ThemeColors = {
  primary: "#FF6B8B",
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  border: "#2C2C2C",
  notification: "#FF453A",
  secondaryText: "#BBBBBB",
  personalActivity: "#5A9CF0",
  coupleActivity: "#FF8DA6",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [themeMode, setThemeMode] = useState<ThemeType>("system")

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeMode")
        if (savedTheme) {
          setThemeMode(savedTheme as ThemeType)
        }
      } catch (error) {
        console.error("Failed to load theme:", error)
      }
    }

    loadTheme()
  }, [])

  const saveTheme = async (mode: ThemeType) => {
    try {
      await AsyncStorage.setItem("themeMode", mode)
    } catch (error) {
      console.error("Failed to save theme:", error)
    }
  }

  const toggleTheme = () => {
    const newMode = themeMode === "light" ? "dark" : "light"
    setThemeMode(newMode)
    saveTheme(newMode)
  }

  const setThemeModeAndSave = (mode: ThemeType) => {
    setThemeMode(mode)
    saveTheme(mode)
  }

  const isDark = themeMode === "dark" || (themeMode === "system" && systemColorScheme === "dark")

  const theme = {
    mode: themeMode,
    colors: isDark ? darkColors : lightColors,
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setThemeMode: setThemeModeAndSave,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

