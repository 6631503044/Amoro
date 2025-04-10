"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
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
  isDark: boolean
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
  const [isInitialized, setIsInitialized] = useState(false)

  // Calculate isDark once and use it consistently
  const isDark = themeMode === "dark" || (themeMode === "system" && systemColorScheme === "dark")

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeMode")
        if (savedTheme) {
          setThemeMode(savedTheme as ThemeType)
        }
        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to load theme:", error)
        setIsInitialized(true)
      }
    }

    loadTheme()
  }, [])

  // Save theme to AsyncStorage
  const saveTheme = useCallback(async (mode: ThemeType) => {
    try {
      await AsyncStorage.setItem("themeMode", mode)
    } catch (error) {
      console.error("Failed to save theme:", error)
    }
  }, [])

  // Toggle between light and dark mode
  const toggleTheme = useCallback(() => {
    // If currently in system mode, switch to explicit light/dark based on current appearance
    if (themeMode === "system") {
      const newMode = isDark ? "light" : "dark"
      setThemeMode(newMode)
      saveTheme(newMode)
      return
    }

    // Otherwise toggle between light and dark
    const newMode = themeMode === "light" ? "dark" : "light"
    setThemeMode(newMode)
    saveTheme(newMode)
  }, [themeMode, isDark, saveTheme])

  // Set theme mode and save to AsyncStorage
  const setThemeModeAndSave = useCallback(
    (mode: ThemeType) => {
      setThemeMode(mode)
      saveTheme(mode)
    },
    [saveTheme],
  )

  // Create theme object with colors based on isDark
  const theme = {
    mode: themeMode,
    colors: isDark ? darkColors : lightColors,
  }

  // Don't render until we've loaded the saved theme
  if (!isInitialized) {
    return null
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setThemeMode: setThemeModeAndSave,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
