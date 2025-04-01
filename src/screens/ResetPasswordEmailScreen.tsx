"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import Input from "../components/Input"
import Button from "../components/Button"

const ResetPasswordEmailScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const validateForm = () => {
    if (!email) {
      setError("Email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid")
      return false
    }

    setError("")
    return true
  }

  const handleSendEmail = () => {
    if (validateForm()) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setLoading(false)
        setEmailSent(true)
      }, 1000)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Reset Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!emailSent ? (
          <>
            <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
              Enter your email address and we'll send you a link to reset your password
            </Text>

            <View style={styles.formSection}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                keyboardType="email-address"
                error={error}
                leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.secondaryText} />}
              />

              <Button
                title={loading ? "Sending..." : "Send Reset Link"}
                onPress={handleSendEmail}
                disabled={loading}
                style={{ marginTop: 20 }}
              />
            </View>
          </>
        ) : (
          <View style={styles.successContainer}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="mail" size={50} color={theme.colors.primary} />
            </View>
            <Text style={[styles.successTitle, { color: theme.colors.text }]}>Email Sent!</Text>
            <Text style={[styles.successDescription, { color: theme.colors.secondaryText }]}>
              We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
            </Text>
            <Button
              title="Back to Login"
              onPress={() => navigation.navigate("Login" as never)}
              style={{ marginTop: 30 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 20,
    textAlign: "center",
  },
  formSection: {
    marginBottom: 20,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  successDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 20,
  },
})

export default ResetPasswordEmailScreen

