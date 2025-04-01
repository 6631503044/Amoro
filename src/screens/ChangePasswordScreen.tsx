"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import Input from "../components/Input"
import Button from "../components/Button"

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

  const handleResetPassword = () => {
    if (validateForm()) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setLoading(false)
        navigation.goBack()
      }, 1000)
    }
  }

  const navigateToResetPasswordEmail = () => {
    navigation.navigate("ResetPasswordEmail" as any)
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
            onChangeText={setNewPassword}
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
            title={loading ? "Resetting..." : "Reset Password"}
            onPress={handleResetPassword}
            disabled={loading}
            style={{ marginTop: 20 }}
          />

          <View style={styles.alternativeMethodContainer}>
            <TouchableOpacity onPress={navigateToResetPasswordEmail}>
              <Text style={[styles.alternativeMethod, { color: theme.colors.primary }]}>Try another method</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    alignItems: "flex-end",
    marginTop: 15,
  },
  alternativeMethod: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    textDecorationLine: "underline",
  },
})

export default ChangePasswordScreen

