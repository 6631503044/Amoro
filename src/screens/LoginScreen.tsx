"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import Input from "../components/Input"
import Button from "../components/Button"
import SocialButton from "../components/SocialButton"
// Import the RootStackParamList type
import type { RootStackParamList } from "../navigation/RootNavigator"
import type { StackNavigationProp } from "@react-navigation/stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { handleGoogleSignIn } from "../context/googleAuth"
import * as Google from "expo-auth-session/providers/google"
import { auth } from "../../firebaseConfig"

const API_URL = "https://amoro-backend-3gsl.onrender.com"

const LoginScreen = () => {
  // Then use this type for navigation
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { theme } = useTheme()
  const { signIn, signInWithGoogle, signInWithApple } = useAuth()
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "378572137696-oe8vginkilm2tt7050ao3lh7dvfa5fnt.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@ProjectAmoro/ProjectAmoro",
  })

  useEffect(() => {
    handleGoogleSignIn(API_URL, promptAsync, response)
  }, [response])

  const validateForm = () => {
    let valid = true
    const newErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        setLoading(true)

        // Use Firebase Authentication to sign in
        const { signInWithEmailAndPassword } = require("firebase/auth")
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Get the UID from Firebase
        const uid = user.uid
        console.log("Login successful, UID:", uid)

        // Fetch the latest user data from the backend
        const API_URL = "https://amoro-backend-3gsl.onrender.com"
        const response = await fetch(`${API_URL}/users/${uid}`)

        let userObject

        if (response.ok) {
          // If user data exists in backend, use it
          const userData = await response.json()

          userObject = {
            id: uid,
            email: email,
            displayName: userData.data?.Name || "User",
            username: userData.data?.username,
            birthday: userData.data?.Birthdate,
            hobbies: Array.isArray(userData.data?.Hobbies) ? userData.data?.Hobbies.join(", ") : "",
            phone: userData.data?.Phone,
            photoURL: userData.data?.photoURL || "https://via.placeholder.com/150",
          }
        } else {
          // If user data doesn't exist in backend, create a basic user object
          userObject = {
            id: uid,
            email: email,
            displayName: "User",
            photoURL: "https://via.placeholder.com/150",
          }
        }

        // Store the user in AsyncStorage to trigger auth state change
        await AsyncStorage.setItem("user", JSON.stringify(userObject))

        // After successful login, get the FCM token
        console.log("Trying to get Token")
        // For FCM token, you'll need to properly import and initialize firebase messaging
        // This is a placeholder - you'll need to implement proper FCM token retrieval
        let fcmToken = null
        console.log("FCM Token functionality needs proper implementation")

        // Save to backend
        if (user?.uid && fcmToken) {
          await fetch(`https://amoro-backend-3gsl.onrender.com/users/${user.uid}/fcmtoken`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fcmToken }),
          })
        }
        // After successful login, get the FCM token
        console.log("Trying to get Token")
        // For FCM token, you'll need to properly import and initialize firebase messaging
        // This is a placeholder - you'll need to implement proper FCM token retrieval
        fcmToken = null
        console.log("FCM Token functionality needs proper implementation")

        // Save to backend
        if (user?.uid && fcmToken) {
          await fetch(`https://amoro-backend-3gsl.onrender.com/users/${user.uid}/fcmtoken`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fcmToken }),
          })
        }
      } catch (error) {
        console.error("Login error:", error)

        // Handle specific Firebase error codes
        if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
          Alert.alert("Login Failed", "Invalid email or password. Please try again.")
        } else if (error.code === "auth/too-many-requests") {
          Alert.alert("Login Failed", "Too many failed login attempts. Please try again later.")
        } else {
          Alert.alert("Login Error", "An error occurred during login. Please try again.")
        }
        // Clear password field
        setPassword("")
        // Clear password field
        setPassword("")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await promptAsync()
    } catch (error) {
      console.error("Google login error:", error)
      Alert.alert("Error", "Failed to log in with Google. Please try again.")
    }
  }

  const handleAppleLogin = async () => {
    try {
      await signInWithApple()
    } catch (error) {
      console.error("Apple login error:", error)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/img/logo.jpg")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.appName, { color: theme.colors.primary }]}>Amoro</Text>
          <Text style={[styles.tagline, { color: theme.colors.secondaryText }]}>Calendar for Couples</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.secondaryText} />}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.secondaryText} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.secondaryText}
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title={loading ? <ActivityIndicator color="white" /> : "Login"}
            onPress={handleLogin}
            disabled={loading}
          />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.secondaryText }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          </View>

          <SocialButton
            title="Continue with Google"
            onPress={handleGoogleLogin}
            icon="logo-google"
            backgroundColor="#FFFFFF"
            textColor="#757575"
            borderColor="#DDDDDD"
          />

          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: theme.colors.text }]}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={[styles.signupLink, { color: theme.colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  formContainer: {
    width: "100%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  signupLink: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 5,
  },
})

export default LoginScreen
