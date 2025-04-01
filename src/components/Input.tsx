"use client"

import type React from "react"
import { View, Text, TextInput, StyleSheet, type TextInputProps } from "react-native"
import { useTheme } from "../context/ThemeContext"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input: React.FC<InputProps> = ({ label, error, leftIcon, rightIcon, ...props }) => {
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? "red" : theme.colors.border,
            backgroundColor: theme.colors.card,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              paddingLeft: leftIcon ? 10 : 15,
              paddingRight: rightIcon ? 10 : 15,
            },
          ]}
          placeholderTextColor={theme.colors.secondaryText}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  leftIcon: {
    paddingLeft: 15,
  },
  rightIcon: {
    paddingRight: 15,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 5,
  },
})

export default Input

