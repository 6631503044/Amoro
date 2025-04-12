"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import Input from "../components/Input"
import Button from "../components/Button"
import { auth } from "../../firebaseConfig"
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, sendPasswordResetEmail } from "firebase/auth"

const ChangePasswordScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: "" })

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ score: 0, message: "" })
      return
    }

    let score = 0
    let message = ""

    // Length check
    if (password.length >= 8) score += 1

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    // Set message based on score
    if (score === 0 || score === 1) {
      message = "Weak password"
    } else if (score === 2) {
      message = "Moderate password"
    } else if (score === 3) {
      message = "Strong password"
    } else {
      message = "Very strong password"
    }

    setPasswordStrength({ score, message })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { currentPassword: "", newPassword: "", confirmPassword: "" }

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required"
      valid = false
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required"
      valid = false
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
      valid = false
    } else if (passwordStrength.score < 2) {
      newErrors.newPassword = "Please use a stronger password"
      valid = false
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
      valid = false
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleResetPassword = async () => {
    if (validateForm()) {
      setLoading(true)

      try {
        const user = auth.currentUser

        if (!user || !user.email) {
          throw new Error("User not found or email not available")
        }

        console.log("Attempting to re-authenticate user...")
        // Re-authenticate user before changing password
        const credential = EmailAuthProvider.credential(user.email, currentPassword)
        await reauthenticateWithCredential(user, credential)
        console.log("Re-authentication successful")

        // Update password
        console.log("Updating password...")
        await updatePassword(user, newPassword)
        console.log("Password updated successfully")

        // Clear form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setPasswordStrength({ score: 0, message: "" })

        // Show success message
        Alert.alert("Success", "Your password has been updated successfully.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ])
      } catch (error) {
        console.error("Password change error:", error)
        let errorMessage = "Failed to change password. Please try again."

        // Handle specific error cases
        if (error.code === "auth/wrong-password") {
          errorMessage = "Current password is incorrect."
          setErrors((prev) => ({ ...prev, currentPassword: errorMessage }))
        } else if (error.code === "auth/weak-password") {
          errorMessage = "New password is too weak. Please use a stronger password."
          setErrors((prev) => ({ ...prev, newPassword: errorMessage }))
        } else if (error.code === "auth/requires-recent-login") {
          errorMessage = "For security reasons, please log in again before changing your password."
          Alert.alert("Session Expired", errorMessage, [
            {
              text: "OK",
              onPress: () => {
                // Sign out user and redirect to login
                auth.signOut().then(() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" as never }],
                  })
                })
              },
            },
          ])
        } else if (error.code === "auth/network-request-failed") {
          Alert.alert("Network Error", "Please check your internet connection and try again.")
        } else {
          // Generic error handling
          Alert.alert("Error", errorMessage)
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleResetViaEmail = async () => {
    const user = auth.currentUser
    if (!user || !user.email) {
      Alert.alert("Error", "Unable to find your email address. Please contact support.")
      return
    }

    try {
      setLoading(true)
      await sendPasswordResetEmail(auth, user.email)
      Alert.alert("Email Sent", `A password reset link has been sent to ${user.email}. Please check your inbox.`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Password reset email error:", error)
      Alert.alert("Error", "Failed to send password reset email. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
          Enter your current password and create a new password for your account
        </Text>

        <View style={styles.formSection}>
          <Input
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter your current password"
            secureTextEntry={!showCurrentPassword}
            error={errors.currentPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.secondaryText} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Ionicons
                  name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.secondaryText}
                />
              </TouchableOpacity>
            }
          />

          <Input
            label="New Password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text)
              checkPasswordStrength(text)
            }}
            placeholder="Create a new password"
            secureTextEntry={!showNewPassword}
            error={errors.newPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.secondaryText} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.secondaryText}
                />
              </TouchableOpacity>
            }
          />

          {newPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBars}>
                {[1, 2, 3, 4].map((bar) => (
                  <View
                    key={bar}
                    style={[
                      styles.strengthBar,
                      {
                        backgroundColor:
                          bar <= passwordStrength.score
                            ? getStrengthColor(passwordStrength.score, theme)
                            : theme.colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.strengthText, { color: getStrengthColor(passwordStrength.score, theme) }]}>
                {passwordStrength.message}
              </Text>
            </View>
          )}

          <Input
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your new password"
            secureTextEntry={!showConfirmPassword}
            error={errors.confirmPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.secondaryText} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.secondaryText}
                />
              </TouchableOpacity>
            }
          />

          <Button
            title={
              loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.loadingText}>Processing...</Text>
                </View>
              ) : (
                "Reset Password"
              )
            }
            onPress={handleResetPassword}
            disabled={loading}
            style={{ marginTop: 20 }}
          />

          <View style={styles.alternativeMethodContainer}>
            <TouchableOpacity onPress={handleResetViaEmail} disabled={loading}>
              <Text style={[styles.alternativeMethod, { color: theme.colors.primary, opacity: loading ? 0.5 : 1 }]}>
                Reset via email instead
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

// Helper function to get color based on password strength
const getStrengthColor = (score, theme) => {
  if (score === 0 || score === 1) return theme.colors.error
  if (score === 2) return "#FFA500" // Orange
  if (score === 3) return "#2E8B57" // Sea Green
  if (score === 4) return "#008000" // Green
  return theme.colors.border
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
  alternativeMethodContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  alternativeMethod: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    textDecorationLine: "underline",
  },
  strengthContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  strengthBars: {
    flexDirection: "row",
    marginBottom: 5,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    textAlign: "right",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "white",
    marginLeft: 8,
    fontFamily: "Poppins-Medium",
  },
})

export default ChangePasswordScreen
