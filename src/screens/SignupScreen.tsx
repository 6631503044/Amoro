"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import Input from "../components/Input"
import Button from "../components/Button"
import SocialButton from "../components/SocialButton"

// Add calendar constants
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const SignupScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { signUp, signInWithGoogle, signInWithApple, loading } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [birthday, setBirthday] = useState("")
  const [hobbies, setHobbies] = useState("")
  const [phone, setPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    birthday: "",
    phone: "",
  })

  // Add calendar helper functions
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

    const days = []

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: "", isCurrentMonth: false })
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true })
    }

    return days
  }

  const handleDateSelection = (day: number) => {
    if (day) {
      const newDate = new Date(currentYear, currentMonth, day)
      const formattedDate = newDate.toISOString().split('T')[0]
      setBirthday(formattedDate)
      setSelectedDay(day)
      setShowDatePicker(false)
    }
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      birthday: "",
      phone: "",
    }

    if (!name) {
      newErrors.name = "Name is required"
      valid = false
    }

    if (!username) {
      newErrors.username = "Username is required"
      valid = false
    }

    if (!email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!phone) {
      newErrors.phone = "Phone number is required"
      valid = false
    } else if (!/^\+?[0-9\s-()]{10,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number"
      valid = false
    }

    if (!birthday) {
      newErrors.birthday = "Birthday is required"
      valid = false
    } else {
      // Simple date validation (YYYY-MM-DD format)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(birthday)) {
        newErrors.birthday = "Please use YYYY-MM-DD format"
        valid = false
      }
    }

    if (!password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSignUp = async () => {
    if (validateForm()) {
      try {
        await signUp(email, password, name, username, birthday, hobbies, phone)
      } catch (error) {
        console.error("Sign up error:", error)
        // Handle specific error cases here
      }
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Google sign up error:", error)
    }
  }

  const handleAppleSignUp = async () => {
    try {
      await signInWithApple()
    } catch (error) {
      console.error("Apple sign up error:", error)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Create Account</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            error={errors.name}
            leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.secondaryText} />}
          />

          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            autoCapitalize="none"
            error={errors.username}
            leftIcon={<Ionicons name="at-outline" size={20} color={theme.colors.secondaryText} />}
          />

          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            error={errors.phone}
            leftIcon={<Ionicons name="call-outline" size={20} color={theme.colors.secondaryText} />}
          />

          <View>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Birthday</Text>
            <TouchableOpacity
              style={[
                styles.inputContainer,
                { 
                  borderColor: errors.birthday ? "red" : theme.colors.border,
                  backgroundColor: theme.colors.card,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.inputContent}>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.secondaryText} />
                <Text style={[styles.inputText, { color: theme.colors.text }]}>
                  {birthday ? formatDate(birthday) : "Select your birthday"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.secondaryText} />
            </TouchableOpacity>
            {errors.birthday ? <Text style={styles.errorText}>{errors.birthday}</Text> : null}
          </View>

          <Input
            label="Hobbies (Optional)"
            value={hobbies}
            onChangeText={setHobbies}
            placeholder="Reading, Hiking, Photography, etc."
            autoCapitalize="words"
            leftIcon={<Ionicons name="heart-outline" size={20} color={theme.colors.secondaryText} />}
          />

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

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
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
            title={loading ? <ActivityIndicator color="white" /> : "Sign Up"}
            onPress={handleSignUp}
            disabled={loading}
            style={{ marginTop: 20 }}
          />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.secondaryText }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          </View>

          <SocialButton
            title="Continue with Google"
            onPress={handleGoogleSignUp}
            icon="logo-google"
            backgroundColor="#FFFFFF"
            textColor="#757575"
            borderColor="#DDDDDD"
          />

          <SocialButton
            title="Continue with Apple"
            onPress={handleAppleSignUp}
            icon="logo-apple"
            backgroundColor="#000000"
            textColor="#FFFFFF"
          />

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.colors.text }]}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
              <Text style={[styles.loginLink, { color: theme.colors.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerContainer}>
            <TouchableOpacity style={styles.datePickerBackdrop} onPress={() => setShowDatePicker(false)} />
            <View style={[styles.datePickerContent, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.datePickerTitle, { color: theme.colors.text }]}>Select Birthday</Text>

              {/* Calendar header */}
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={goToPreviousMonth}>
                  <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.calendarMonthYear, { color: theme.colors.text }]}>
                  {MONTHS[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity onPress={goToNextMonth}>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Days of week */}
              <View style={styles.calendarDaysOfWeek}>
                {DAYS.map((day, index) => (
                  <Text key={index} style={[styles.calendarDayOfWeek, { color: theme.colors.secondaryText }]}>
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar days */}
              <View style={styles.calendarDays}>
                {generateCalendarDays().map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      item.isCurrentMonth &&
                        item.day === selectedDay && {
                          backgroundColor: theme.colors.primary,
                          borderRadius: 20,
                        },
                    ]}
                    onPress={() => item.isCurrentMonth && handleDateSelection(item.day)}
                    disabled={!item.isCurrentMonth}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        { color: item.isCurrentMonth ? theme.colors.text : "transparent" },
                        item.isCurrentMonth &&
                          item.day === selectedDay && {
                            color: "#FFFFFF",
                          },
                      ]}
                    >
                      {item.day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.datePickerButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.datePickerButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  formContainer: {
    width: "100%",
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  loginText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  loginLink: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  inputText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 5,
  },
  datePickerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  datePickerBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  datePickerContent: {
    width: "80%",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  datePickerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
    textAlign: "center",
  },
  datePickerButton: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  datePickerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  calendarMonthYear: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  calendarDaysOfWeek: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calendarDayOfWeek: {
    width: 35,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  calendarDays: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  calendarDay: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  calendarDayText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
})

export default SignupScreen

