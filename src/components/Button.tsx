"use client"

import type React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../context/ThemeContext"

interface ButtonProps {
  title: string | React.ReactNode
  onPress: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme()

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border

    switch (variant) {
      case "primary":
        return theme.colors.primary
      case "secondary":
        return theme.colors.personalActivity
      case "outline":
        return "transparent"
      default:
        return theme.colors.primary
    }
  }

  const getTextColor = () => {
    if (disabled) return theme.colors.secondaryText

    switch (variant) {
      case "outline":
        return theme.colors.primary
      default:
        return "#FFFFFF"
    }
  }

  const getBorderColor = () => {
    if (disabled) return theme.colors.border

    switch (variant) {
      case "outline":
        return theme.colors.primary
      default:
        return "transparent"
    }
  }

  const getHeight = () => {
    switch (size) {
      case "small":
        return 36
      case "large":
        return 56
      default:
        return 48
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          height: getHeight(),
          borderWidth: variant === "outline" ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : typeof title === "string" ? (
        <Text
          style={[
            styles.buttonText,
            {
              color: getTextColor(),
              fontSize: size === "small" ? 14 : 16,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      ) : (
        title
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold",
  },
})

export default Button

