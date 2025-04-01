"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import Input from "../components/Input"
import Button from "../components/Button"

const AddPartnerScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()

  const [partnerEmail, setPartnerEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validateForm = () => {
    if (!partnerEmail) {
      setError("Partner email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(partnerEmail)) {
      setError("Please enter a valid email address")
      return false
    }

    setError("")
    return true
  }

  const handleSendInvite = async () => {
    if (validateForm()) {
      setLoading(true)

      try {
        // In a real app, you would make an API call to send the invitation
        // For demo purposes, we'll just simulate the API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        Alert.alert("Invitation Sent", `An invitation has been sent to ${partnerEmail}`, [
          { text: "OK", onPress: () => navigation.goBack() },
        ])
      } catch (error) {
        Alert.alert("Error", "Failed to send invitation. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Add Partner</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconBackground, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Ionicons name="people" size={60} color={theme.colors.primary} />
          </View>
        </View>

        <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
          Connect with your partner by sending them an invitation. They will need to accept your invitation to become
          your partner.
        </Text>

        <View style={styles.formSection}>
          <Input
            label="Partner's Email"
            value={partnerEmail}
            onChangeText={setPartnerEmail}
            placeholder="Enter your partner's email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
            leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.secondaryText} />}
          />

          <Button
            title={loading ? "Sending..." : "Send Invitation"}
            onPress={handleSendInvite}
            disabled={loading}
            style={{ marginTop: 20 }}
          />
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
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  formSection: {
    marginBottom: 20,
  },
})

export default AddPartnerScreen

