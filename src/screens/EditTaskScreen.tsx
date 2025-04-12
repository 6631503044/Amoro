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
  Modal,
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

  // Check if user has a partner
  const hasPartner = user?.partnerId && user.partnerId !== ""

  const [withPartner, setWithPartner] = useState<string | null>(
    typeof activityData?.withPartner === "string"
      ? activityData.withPartner
      : activityData?.type === "couple"
        ? user?.partnerId || "partner-placeholder-id"
        : null,
  )
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

  // Time picker state
  const [selectedHours, setSelectedHours] = useState(startTime.getHours())
  const [selectedMinutes, setSelectedMinutes] = useState(startTime.getMinutes())
  const [isStartTime, setIsStartTime] = useState(true)
  const [showNotificationOptions, setShowNotificationOptions] = useState(false)

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

  // Generate hours for time picker
  const generateHours = () => {
    const hours = []
    for (let i = 0; i < 24; i++) {
      const displayHour = i % 12 || 12
      const ampm = i >= 12 ? "PM" : "AM"
      hours.push({ value: i, display: `${displayHour} ${ampm}` })
    }
    return hours
  }

  // Generate minutes for time picker
  const generateMinutes = () => {
    const minutes = []
    for (let i = 0; i < 60; i += 5) {
      minutes.push({ value: i, display: i.toString().padStart(2, "0") })
    }
    return minutes
  }

  // Handle time selection
  const handleTimeSelection = (hours: number, minutes: number) => {
    const newTime = new Date(isStartTime ? startTime : endTime)
    newTime.setHours(hours)
    newTime.setMinutes(minutes)

    if (isStartTime) {
      setStartTime(newTime)

      // Ensure end time is after start time
      if (newTime > endTime) {
        const newEndTime = new Date(newTime)
        newEndTime.setHours(newTime.getHours() + 1)
        setEndTime(newEndTime)
      }
    } else {
      // Ensure end time is after start time
      if (newTime < startTime) {
        newTime.setDate(newTime.getDate() + 1)
      }
      setEndTime(newTime)
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
        date: formattedDate, // This is the potentially new date if user changed it
        olddate: activityData.date, // This is the original date that should not change
        title: title,
        description: description || "",
        withPartner: withPartner, // Now sending the partner ID or null
        startTime: formatTimeString(startTime),
        endTime: formatTimeString(endTime),
        location: location || "",
        Mood: activityData.mood || {},
        Tag: {
          name: tagName || "",
        },
        Notification: notificationText,
        Complete: activityData.complete || false,
      }

      console.log("Sending task update - date:", payload.date, "olddate:", payload.olddate)
      console.log(payload)
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!hasPartner && (
                <Text style={[styles.noPartnerText, { color: theme.colors.secondaryText }]}>No partner</Text>
              )}
              <Switch
                value={withPartner !== null}
                onValueChange={(value) => {
                  // Only allow toggling if user has a partner
                  if (hasPartner) {
                    setWithPartner(value ? user.partnerId : null)
                  }
                }}
                trackColor={{ false: "#767577", true: theme.colors.coupleActivity || "#f4f3f4" }}
                thumbColor={withPartner !== null ? theme.colors.primary : "#f4f3f4"}
                disabled={!hasPartner}
              />
            </View>
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
              onPress={() => {
                setIsStartTime(true)
                setSelectedHours(startTime.getHours())
                setSelectedMinutes(startTime.getMinutes())
                setShowStartTimePicker(true)
              }}
            >
              <Text style={[styles.timeSelectorLabel, { color: theme.colors.text }]}>Start Time</Text>
              <View style={styles.timeValue}>
                <Text style={[styles.timeValueText, { color: theme.colors.text }]}>{formatTime(startTime)}</Text>
                <Ionicons name="time-outline" size={20} color={theme.colors.secondaryText} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timeSelector, { borderColor: theme.colors.border }]}
              onPress={() => {
                setIsStartTime(false)
                setSelectedHours(endTime.getHours())
                setSelectedMinutes(endTime.getMinutes())
                setShowEndTimePicker(true)
              }}
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

          <TouchableOpacity
            style={[styles.dateTimeSelector, { borderColor: theme.colors.border }]}
            onPress={() => setShowNotificationOptions(!showNotificationOptions)}
          >
            <Text style={[styles.dateTimeSelectorLabel, { color: theme.colors.text }]}>Notification</Text>
            <View style={styles.dateTimeValue}>
              <Text style={[styles.dateTimeValueText, { color: theme.colors.text }]}>
                {NOTIFICATION_OPTIONS.find((option) => option.value === notificationTime)?.label || "At time of event"}
              </Text>
              <Ionicons
                name={showNotificationOptions ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.colors.secondaryText}
              />
            </View>
          </TouchableOpacity>

          {showNotificationOptions && (
            <View style={[styles.notificationOptions, { backgroundColor: theme.colors.card }]}>
              {NOTIFICATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.notificationOption,
                    notificationTime === option.value && {
                      backgroundColor: `${theme.colors.primary}20`,
                    },
                  ]}
                  onPress={() => {
                    setNotificationTime(option.value)
                    setShowNotificationOptions(false)
                  }}
                >
                  <Text
                    style={[
                      styles.notificationOptionText,
                      { color: theme.colors.text },
                      notificationTime === option.value && {
                        color: theme.colors.primary,
                        fontFamily: "Poppins-SemiBold",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {notificationTime === option.value && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button title={loading ? "Saving..." : "Save Activity"} onPress={handleSave} disabled={loading} />
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={showStartTimePicker || showEndTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowStartTimePicker(false)
          setShowEndTimePicker(false)
        }}
      >
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            style={styles.datePickerBackdrop}
            onPress={() => {
              setShowStartTimePicker(false)
              setShowEndTimePicker(false)
            }}
          />
          <View style={[styles.datePickerContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.datePickerTitle, { color: theme.colors.text }]}>
              {isStartTime ? "Select Start Time" : "Select End Time"}
            </Text>

            <View style={styles.timePickerContainer}>
              {/* Hours */}
              <View style={styles.timePickerColumn}>
                <Text style={[styles.timePickerLabel, { color: theme.colors.secondaryText }]}>Hour</Text>
                <ScrollView style={styles.timePickerScroll}>
                  {generateHours().map((hour, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timePickerItem,
                        selectedHours === hour.value && {
                          backgroundColor: `${theme.colors.primary}20`,
                        },
                      ]}
                      onPress={() => setSelectedHours(hour.value)}
                    >
                      <Text
                        style={[
                          styles.timePickerItemText,
                          { color: theme.colors.text },
                          selectedHours === hour.value && {
                            color: theme.colors.primary,
                            fontFamily: "Poppins-SemiBold",
                          },
                        ]}
                      >
                        {hour.display}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Minutes */}
              <View style={styles.timePickerColumn}>
                <Text style={[styles.timePickerLabel, { color: theme.colors.secondaryText }]}>Minute</Text>
                <ScrollView style={styles.timePickerScroll}>
                  {generateMinutes().map((minute, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timePickerItem,
                        selectedMinutes === minute.value && {
                          backgroundColor: `${theme.colors.primary}20`,
                        },
                      ]}
                      onPress={() => setSelectedMinutes(minute.value)}
                    >
                      <Text
                        style={[
                          styles.timePickerItemText,
                          { color: theme.colors.text },
                          selectedMinutes === minute.value && {
                            color: theme.colors.primary,
                            fontFamily: "Poppins-SemiBold",
                          },
                        ]}
                      >
                        {minute.display}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.datePickerButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                handleTimeSelection(selectedHours, selectedMinutes)
                setShowStartTimePicker(false)
                setShowEndTimePicker(false)
              }}
            >
              <Text style={styles.datePickerButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  noPartnerText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginRight: 8,
    fontStyle: "italic",
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
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timePickerColumn: {
    width: "48%",
  },
  timePickerLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 10,
    textAlign: "center",
  },
  timePickerScroll: {
    height: 200,
  },
  timePickerItem: {
    padding: 10,
    borderRadius: 8,
  },
  timePickerItemText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  notificationOptions: {
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  notificationOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  notificationOptionText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
})

export default EditTaskScreen
