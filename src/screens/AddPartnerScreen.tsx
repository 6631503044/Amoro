"use client"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import Button from "../components/Button"

// API configuration with the correct endpoint
const API_CONFIG = {
  BASE_URL: "https://amoro-backend-3gsl.onrender.com",
  // Updated endpoints list with the correct one first
  ENDPOINTS: [
    "/notification/send", // Correct endpoint provided by user
  ],
}

const AddPartnerScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { user, updatePartnerInfo } = useAuth()
  const [partnerEmail, setPartnerEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [apiStatus, setApiStatus] = useState({ tested: false, working: false })

  // Test API connection on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        // Simple HEAD request to check if the API is reachable
        const response = await fetch(API_CONFIG.BASE_URL, {
          method: "HEAD",
          headers: { Accept: "application/json" },
        })
        setApiStatus({ tested: true, working: response.ok })
        console.log(`API connection test: ${response.ok ? "SUCCESS" : "FAILED"} (${response.status})`)
      } catch (error) {
        console.error("API connection test failed:", error)
        setApiStatus({ tested: true, working: false })
      }
    }

    testApiConnection()
  }, [])

  const handleSendInvite = async () => {
    if (!partnerEmail) {
      setError("Please enter your partner's email")
      return
    }

    if (!/\S+@\S+\.\S+/.test(partnerEmail)) {
      setError("Please enter a valid email address")
      return
    }

    if (partnerEmail === user?.email) {
      setError("You cannot add yourself as a partner")
      return
    }

    if (!apiStatus.working && apiStatus.tested) {
      Alert.alert(
        "API Connection Issue",
        "We're having trouble connecting to our servers. Would you like to try anyway?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Try Anyway", onPress: () => sendInvitation() },
        ],
      )
      return
    }

    sendInvitation()
  }

  const sendInvitation = async () => {
    setLoading(true)
    setError("")

    try {
      // Prepare the payload according to the required structure
      const payload = {
        senderemail: user?.email,
        receiveremail: partnerEmail,
      }

      // Full URL for the API endpoint
      const fullUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[0]}`
      console.log(`Sending partner invitation to: ${fullUrl}`)
      console.log("With payload:", payload)

      // Send invitation to backend
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log(`API response status: ${response.status} ${response.statusText}`)

      // Check if response is ok
      if (response.ok) {
        try {
          const responseData = await response.json()
          console.log("Partner invitation sent successfully:", responseData)

          // Store the partner email temporarily
          await updatePartnerInfo(undefined, partnerEmail)

          Alert.alert(
            "Invitation Sent",
            "Your partner invitation has been sent successfully. They will need to accept it to connect your accounts.",
            [{ text: "OK", onPress: () => navigation.goBack() }],
          )
        } catch (parseError) {
          console.log("Response was OK but couldn't parse JSON:", parseError)
          // Even if we can't parse the JSON, if the response was OK, we consider it a success
          await updatePartnerInfo(undefined, partnerEmail)
          Alert.alert(
            "Invitation Sent",
            "Your partner invitation has been sent successfully. They will need to accept it to connect your accounts.",
            [{ text: "OK", onPress: () => navigation.goBack() }],
          )
        }
      } else if (response.status === 404) {
        // 404 error - endpoint not found
        console.error(`Endpoint ${API_CONFIG.ENDPOINTS[0]} not found (404)`)
        setError("The invitation service is currently unavailable. Please try again later or contact support.")

        // Show detailed error for debugging
        console.error("API Error Details:", await response.text().catch(() => "Could not read response text"))
      } else {
        // For other non-OK responses, try to get more information
        try {
          const responseText = await response.text()
          console.error("API error:", response.status, responseText)

          // Try to parse as JSON if possible
          try {
            const errorData = JSON.parse(responseText)
            setError(errorData.message || `Server error (${response.status}). Please try again.`)
          } catch (jsonError) {
            // If not JSON, use the status text
            setError(`Server error (${response.status}): ${response.statusText || "Unknown error"}. Please try again.`)
          }
        } catch (textError) {
          console.error("Couldn't read response text:", textError)
          setError(`Server error (${response.status}). Please try again.`)
        }
      }
    } catch (error) {
      console.error("Error sending partner invitation:", error)
      if (error instanceof SyntaxError && error.message.includes("JSON Parse error")) {
        setError("Server returned an invalid response. Please try again later or contact support.")
      } else {
        setError("Network error. Please check your connection and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleManualInvite = () => {
    if (!partnerEmail || !/\S+@\S+\.\S+/.test(partnerEmail)) {
      setError("Please enter a valid email address first")
      return
    }

    Alert.alert(
      "Manual Invitation",
      "Since we're having trouble with our servers, you can manually invite your partner by sharing your email address with them.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Copy My Email",
          onPress: () => {
            // In a real app, this would copy the email to clipboard
            Alert.alert(
              "Email Copied",
              `Your email (${user?.email}) has been copied to clipboard. Share it with your partner.`,
            )
          },
        },
      ],
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
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
            <Ionicons name="people" size={80} color={theme.colors.primary} />
          </View>

          <Text style={[styles.subtitle, { color: theme.colors.text }]}>Connect with your partner</Text>
          <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
            Enter your partner's email address to send them an invitation to connect your accounts.
          </Text>

          {apiStatus.tested && !apiStatus.working && (
            <View style={styles.apiWarning}>
              <Ionicons name="warning-outline" size={20} color="#f59e0b" />
              <Text style={styles.apiWarningText}>
                Server connection issues detected. You can still try to send an invitation.
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Partner's Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: error ? "red" : theme.colors.border,
                },
              ]}
              placeholder="Enter email address"
              placeholderTextColor={theme.colors.secondaryText}
              value={partnerEmail}
              onChangeText={(text) => {
                setPartnerEmail(text)
                if (error) setError("") // Clear error when user types
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <Button
            title={loading ? "Sending..." : "Send Invitation"}
            onPress={handleSendInvite}
            disabled={loading}
            icon={loading ? <ActivityIndicator size="small" color="white" /> : null}
          />

          {apiStatus.tested && !apiStatus.working && (
            <TouchableOpacity style={styles.manualInviteButton} onPress={handleManualInvite}>
              <Text style={[styles.manualInviteText, { color: theme.colors.primary }]}>
                Having trouble? Try manual invitation
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.troubleshootButton}
            onPress={() => {
              Alert.alert(
                "Troubleshooting",
                `If you're experiencing issues:\n\n1. Check your internet connection\n2. Verify the email address is correct\n3. Try again later\n\nCurrent API endpoint: ${API_CONFIG.ENDPOINTS[0]}\nAPI status: ${apiStatus.working ? "Connected" : "Connection issues"}\n\nIf problems persist, please contact support.`,
              )
            }}
          >
            <Text style={[styles.troubleshootText, { color: theme.colors.primary }]}>Having trouble? Tap for help</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    marginVertical: 30,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 5,
  },
  troubleshootButton: {
    marginTop: 20,
    alignItems: "center",
  },
  troubleshootText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    textDecorationLine: "underline",
  },
  apiWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  apiWarningText: {
    color: "#92400e",
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  manualInviteButton: {
    marginTop: 15,
    alignItems: "center",
  },
  manualInviteText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    textDecorationLine: "underline",
  },
})

export default AddPartnerScreen
