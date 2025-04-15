"use client"
import { useState } from "react"
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

const AddPartnerScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { user, updatePartnerInfo } = useAuth()
  const [partnerEmail, setPartnerEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

    setLoading(true)
    setError("")

    try {
      // Send invitation to backend
      const API_URL = "https://amoro-backend-3gsl.onrender.com"
      const response = await fetch(`${API_URL}/notification/sendpartnerrequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderemail: user?.email,
          receiveremail: partnerEmail,
        }),
      })

      if (response.ok) {
        // Store the partner email temporarily in AsyncStorage
        // This will be updated with the partnerId when the invitation is accepted
        await updatePartnerInfo(undefined, partnerEmail)

        Alert.alert(
          "Invitation Sent",
          "Your partner invitation has been sent successfully. They will need to accept it to connect your accounts.",
          [{ text: "OK", onPress: () => navigation.goBack() }],
        )
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to send invitation. Please try again.")
      }
    } catch (error) {
      console.error("Error sending partner invitation:", error)
      setError("An error occurred. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
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
              onChangeText={setPartnerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <Button
            title={loading ? <ActivityIndicator color="white" /> : "Send Invitation"}
            onPress={handleSendInvite}
            disabled={loading}
          />
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
})

export default AddPartnerScreen
