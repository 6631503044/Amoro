"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import Input from "../components/Input"
import Button from "../components/Button"
import CalendarPickerModal from "../components/CalendarPickerModal"
import { useAuth } from "../context/AuthContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Mock tags data
const TAGS = [
  { id: "1", name: "Date", emoji: "❤️" },
  { id: "2", name: "Work", emoji: "💼" },
  { id: "3", name: "Exercise", emoji: "🏃‍♂️" },
  { id: "4", name: "Entertainment", emoji: "🎬" },
  { id: "5", name: "Travel", emoji: "✈️" },
  { id: "6", name: "Food", emoji: "🍽️" },
  { id: "7", name: "Shopping", emoji: "🛍️" },
  { id: "8", name: "Study", emoji: "📚" },
]

// Notification options
const NOTIFICATION_OPTIONS = [
  { id: "1", label: "At time of event", value: 0 },
  { id: "2", label: "15 minutes before", value: 15 },
  { id: "3", label: "30 minutes before", value: 30 },
  { id: "4", label: "1 hour before", value: 60 },
  { id: "5", label: "2 hours before", value: 120 },
  { id: "6", label: "1 day before", value: 1440 },
]

const EditTaskScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { user } = useAuth()
  const route = useRoute()

  // Get the activity data from the route params
  const { activityId, activityData } = route.params || {}

  const [withPartner, setWithPartner] = useState(activityData?.type === "couple")
  const [title, setTitle] = useState(activityData?.title || "")
  const [description, setDescription] = useState(activityData?.description || "")
  const [location, setLocation] = useState(activityData?.location || "")
  const [date, setDate] = useState(new Date(activityData?.date) || new Date())
  const [startTime, setStartTime] = useState(new Date(`2023-01-01T${activityData?.startTime}`) || new Date())
  const [endTime, setEndTime] = useState(
    new Date(`2023-01-01T${activityData?.endTime}`) || new Date(Date.now() + 60 * 60 * 1000),
  ) // 1 hour later
  const [selectedTag, setSelectedTag] = useState(activityData?.tag || null)
  const [notificationTime, setNotificationTime] = useState(
    NOTIFICATION_OPTIONS.find((option) => option.label === activityData?.notification)?.value || 0,
  )

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const [loading, setLoading] = useState(false)

  const formatDate = (date: Date) => {
    try {
      return `${date.toLocaleDateString("en-US", { month: "long" })} ${date.getDate()}, ${date.getFullYear()}`
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  const formatTime = (date: Date) => {
    try {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12
      const formattedMinutes = minutes.toString().padStart(2, "0")
      return `${formattedHours}:${formattedMinutes} ${ampm}`
    } catch (error) {
      console.error("Error formatting time:", error)
      return "Invalid time"
    }
  }

  const handleSave = async () => {
    if (!user || !user.id) {
      Alert.alert("Error", "User not authenticated")
      return
    }

    try {
      setLoading(true)

      // Format the date to YYYY-MM-DD
      const formattedDate = date.toISOString().split("T")[0]

      // Format times to HH:MM
      const formatTimeString = (date) => {
        const hours = date.getHours().toString().padStart(2, "0")
        const minutes = date.getMinutes().toString().padStart(2, "0")
        return `${hours}:${minutes}`
      }

      // Get the tag name from the selected tag ID
      const selectedTagObject = TAGS.find((tag) => tag.id === selectedTag)
      const tagName = selectedTagObject ? selectedTagObject.name : ""

      // Get the notification text - FIX: Use notificationOption.label instead of option.label
      const notificationOption = NOTIFICATION_OPTIONS.find((option) => option.value === notificationTime)
      const notificationText = notificationOption ? notificationOption.label : "At time of event"

      // Create payload
      const payload = {
        date: formattedDate,
        olddate: activityData.date, // Adding olddate field with the original date
        title: title,
        description: description || "",
        withPartner: withPartner,
        startTime: formatTimeString(startTime),
        endTime: formatTimeString(endTime),
        location: location || "",
        Mood: {
          Description: "",
          Score: "",
        },
        Tag: {
          name: tagName || "",
        },
        Notification: notificationText,
        Complete: activityData.complete || false,
      }

      console.log("Sending task update:", payload)

      // Send PUT request to update the task
      const API_URL = "https://amoro-backend-3gsl.onrender.com"
      const response = await fetch(`${API_URL}/tasks/${user.id}/${activityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      // Set flag to refresh home screen data
      await AsyncStorage.setItem("refreshHomeData", "true")

      // Navigate back on success
      navigation.goBack()
    } catch (error) {
      console.error("Error saving activity:", error)
      Alert.alert("Error", "Failed to save activity. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Activity</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.formContainer}>
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: theme.colors.text }]}>With Partner</Text>
            <Switch
              value={withPartner}
              onValueChange={setWithPartner}
              trackColor={{ false: "#767577", true: theme.colors.coupleActivity || "#f4f3f4" }}
              thumbColor={withPartner ? theme.colors.primary : "#f4f3f4"}
            />
          </View>

          <Input label="Title" value={title} onChangeText={setTitle} placeholder="Enter activity title" />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter activity description"
            multiline
            numberOfLines={2}
            style={[styles.descriptionInput, { color: theme.colors.text }]}
            placeholderTextColor={theme.colors.secondaryText}
            textAlignVertical="center"
            textAlign="left"
          />

          <TouchableOpacity
            style={[styles.dateTimeSelector, { borderColor: theme.colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateTimeSelectorLabel, { color: theme.colors.text }]}>Date</Text>
            <View style={styles.dateTimeValue}>
              <Text style={[styles.dateTimeValueText, { color: theme.colors.text }]}>{formatDate(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.secondaryText} />
            </View>
          </TouchableOpacity>

          {/* Calendar Picker Modal */}
          <CalendarPickerModal
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            selectedDate={date}
            onDateChange={(newDate) => setDate(newDate)}
            title="Select Date"
          />

          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location (optional)"
            leftIcon={<Ionicons name="location-outline" size={20} color={theme.colors.secondaryText} />}
          />

          <View style={styles.timeSelectionRow}>
            <TouchableOpacity
              style={[styles.timeSelector, { borderColor: theme.colors.border }]}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={[styles.timeSelectorLabel, { color: theme.colors.text }]}>Start Time</Text>
              <View style={styles.timeValue}>
                <Text style={[styles.timeValueText, { color: theme.colors.text }]}>{formatTime(startTime)}</Text>
                <Ionicons name="time-outline" size={20} color={theme.colors.secondaryText} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timeSelector, { borderColor: theme.colors.border }]}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={[styles.timeSelectorLabel, { color: theme.colors.text }]}>End Time</Text>
              <View style={styles.timeValue}>
                <Text style={[styles.timeValueText, { color: theme.colors.text }]}>{formatTime(endTime)}</Text>
                <Ionicons name="time-outline" size={20} color={theme.colors.secondaryText} />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Add Tag</Text>

          <View style={styles.tagsContainer}>
            {TAGS.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tagItem,
                  { borderColor: theme.colors.border },
                  selectedTag === tag.name && {
                    backgroundColor: `${theme.colors.primary}20`,
                    borderColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
              >
                <Text style={styles.tagEmoji}>{tag.emoji}</Text>
                <Text
                  style={[
                    styles.tagName,
                    { color: theme.colors.text },
                    selectedTag === tag.name && { color: theme.colors.primary },
                  ]}
                >
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.dateTimeSelector, { borderColor: theme.colors.border }]}>
            <Text style={[styles.dateTimeSelectorLabel, { color: theme.colors.text }]}>Notification</Text>
            <View style={styles.dateTimeValue}>
              <Text style={[styles.dateTimeValueText, { color: theme.colors.text }]}>At time of event</Text>
              <Ionicons name="chevron-down" size={20} color={theme.colors.secondaryText} />
            </View>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Button title={loading ? "Saving..." : "Save Activity"} onPress={handleSave} disabled={loading} />
          </View>
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
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  saveButton: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  formContainer: {
    padding: 20,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  dateTimeSelector: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  dateTimeSelectorLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  dateTimeValue: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTimeValueText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  timeSelectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  timeSelector: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    width: "48%",
  },
  timeSelectorLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  timeValue: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeValueText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  tagName: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  descriptionInput: {
    textAlignVertical: "center",
    paddingTop: 0,
    height: 80, // Height for 2 lines of text
    lineHeight: 20, // Line height for better readability
    paddingLeft: 15, // Match the title input's left padding
    paddingBottom: 0, // Reduced padding to move text lower
  },
})

export default EditTaskScreen
