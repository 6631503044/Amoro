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
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import Input from "../components/Input"
import Button from "../components/Button"
import TagSelector from "../components/TagSelector"

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

// Mock activity data
const MOCK_ACTIVITY = {
  id: "1",
  title: "Morning Jog",
  description: "Morning jog in the park to start the day fresh",
  startTime: "07:00",
  endTime: "08:00",
  date: "2023-06-15",
  type: "personal",
  tag: "3", // exercise
  emoji: "🏃‍♂️",
  location: "Central Park",
  withPartner: false,
  notification: 15, // minutes before
}

const EditTaskScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { theme } = useTheme()

  // In a real app, you would fetch the activity based on the ID from the route
  // const { activityId } = route.params;
  const activity = MOCK_ACTIVITY

  // Form state
  const [withPartner, setWithPartner] = useState(activity.withPartner)
  const [title, setTitle] = useState(activity.title)
  const [description, setDescription] = useState(activity.description)
  const [location, setLocation] = useState(activity.location)
  const [date, setDate] = useState(new Date(activity.date))
  const [startTime, setStartTime] = useState(new Date(`2023-01-01T${activity.startTime}`))
  const [endTime, setEndTime] = useState(new Date(`2023-01-01T${activity.endTime}`))
  const [selectedTag, setSelectedTag] = useState(activity.tag)
  const [notificationTime, setNotificationTime] = useState(activity.notification)
  const [showAllTags, setShowAllTags] = useState(false)

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const [showNotificationOptions, setShowNotificationOptions] = useState(false)

  const handleSave = () => {
    // Here you would save the activity to your data store
    console.log({
      id: activity.id,
      withPartner,
      title,
      description,
      location,
      date,
      startTime,
      endTime,
      selectedTag,
      notificationTime,
    })

    navigation.goBack()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getSelectedNotificationLabel = () => {
    const option = NOTIFICATION_OPTIONS.find((opt) => opt.value === notificationTime)
    return option ? option.label : NOTIFICATION_OPTIONS[0].label
  }

  // Get visible tags (first 6 if not showing all)
  const visibleTags = showAllTags ? TAGS : TAGS.slice(0, 6)

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
              trackColor={{ false: "#767577", true: theme.colors.coupleActivity }}
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
            numberOfLines={3}
            style={{ textAlignVertical: "top", paddingTop: 15 }}
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

          {showDatePicker && (
            <View style={styles.datePickerContainer}>
              <TouchableOpacity style={styles.datePickerBackdrop} onPress={() => setShowDatePicker(false)} />
              <View style={[styles.datePickerContent, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.datePickerTitle, { color: theme.colors.text }]}>Select Date</Text>
                <input
                  type="date"
                  value={date.toISOString().split("T")[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value)
                    setDate(newDate)
                    setShowDatePicker(false)
                  }}
                  style={{
                    fontSize: 16,
                    padding: 10,
                    borderRadius: 8,
                    border: `1px solid ${theme.colors.border}`,
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    width: "100%",
                    marginBottom: 10,
                  }}
                />
                <TouchableOpacity
                  style={[styles.datePickerButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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

          {showStartTimePicker && (
            <View style={styles.datePickerContainer}>
              <TouchableOpacity style={styles.datePickerBackdrop} onPress={() => setShowStartTimePicker(false)} />
              <View style={[styles.datePickerContent, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.datePickerTitle, { color: theme.colors.text }]}>Select Start Time</Text>
                <input
                  type="time"
                  value={`${startTime.getHours().toString().padStart(2, "0")}:${startTime.getMinutes().toString().padStart(2, "0")}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":").map(Number)
                    const newTime = new Date(startTime)
                    newTime.setHours(hours)
                    newTime.setMinutes(minutes)
                    setStartTime(newTime)

                    // Ensure end time is after start time
                    if (newTime > endTime) {
                      const newEndTime = new Date(newTime)
                      newEndTime.setHours(newTime.getHours() + 1)
                      setEndTime(newEndTime)
                    }

                    setShowStartTimePicker(false)
                  }}
                  style={{
                    fontSize: 16,
                    padding: 10,
                    borderRadius: 8,
                    border: `1px solid ${theme.colors.border}`,
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    width: "100%",
                    marginBottom: 10,
                  }}
                />
                <TouchableOpacity
                  style={[styles.datePickerButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => setShowStartTimePicker(false)}
                >
                  <Text style={styles.datePickerButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {showEndTimePicker && (
            <View style={styles.datePickerContainer}>
              <TouchableOpacity style={styles.datePickerBackdrop} onPress={() => setShowEndTimePicker(false)} />
              <View style={[styles.datePickerContent, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.datePickerTitle, { color: theme.colors.text }]}>Select End Time</Text>
                <input
                  type="time"
                  value={`${endTime.getHours().toString().padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":").map(Number)
                    const newTime = new Date(endTime)
                    newTime.setHours(hours)
                    newTime.setMinutes(minutes)
                    setEndTime(newTime)
                    setShowEndTimePicker(false)
                  }}
                  style={{
                    fontSize: 16,
                    padding: 10,
                    borderRadius: 8,
                    border: `1px solid ${theme.colors.border}`,
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    width: "100%",
                    marginBottom: 10,
                  }}
                />
                <TouchableOpacity
                  style={[styles.datePickerButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => setShowEndTimePicker(false)}
                >
                  <Text style={styles.datePickerButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Add Tag</Text>

          <View>
            <TagSelector tags={visibleTags} selectedTagId={selectedTag} onSelectTag={setSelectedTag} />

            {!showAllTags && (
              <TouchableOpacity style={styles.showMoreTags} onPress={() => setShowAllTags(true)}>
                <Text style={[styles.showMoreTagsText, { color: theme.colors.primary }]}>เพิ่มเติม</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.dateTimeSelector, { borderColor: theme.colors.border }]}
            onPress={() => setShowNotificationOptions(!showNotificationOptions)}
          >
            <Text style={[styles.dateTimeSelectorLabel, { color: theme.colors.text }]}>Notification</Text>
            <View style={styles.dateTimeValue}>
              <Text style={[styles.dateTimeValueText, { color: theme.colors.text }]}>
                {getSelectedNotificationLabel()}
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
            <Button title="Save Changes" onPress={handleSave} />
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
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
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
  showMoreTags: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 10,
    marginBottom: 15,
  },
  showMoreTagsText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginRight: 5,
  },
})

export default EditTaskScreen

