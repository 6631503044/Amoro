"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import Input from "../components/Input"
import Button from "../components/Button"

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

// Days of the week for calendar
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Months for calendar
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

const AddTaskScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const scrollViewRef = useRef<ScrollView>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollViewWidth, setScrollViewWidth] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)
  const fadeAnim = useRef(new Animated.Value(1)).current

  // Form state
  const [withPartner, setWithPartner] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000)) // 1 hour later
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [notificationTime, setNotificationTime] = useState(NOTIFICATION_OPTIONS[2].value)

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const [showNotificationOptions, setShowNotificationOptions] = useState(false)

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(date.getMonth())
  const [currentYear, setCurrentYear] = useState(date.getFullYear())
  const [selectedDay, setSelectedDay] = useState(date.getDate())

  // Time picker state
  const [selectedHours, setSelectedHours] = useState(startTime.getHours())
  const [selectedMinutes, setSelectedMinutes] = useState(startTime.getMinutes())
  const [isStartTime, setIsStartTime] = useState(true)

  // UI state
  const [isMounted, setIsMounted] = useState(true)

  // Pulse animation for scroll indicator
  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])

    Animated.loop(pulseAnimation).start()

    return () => {
      fadeAnim.stopAnimation()
    }
  }, [fadeAnim])

  // Set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      setIsMounted(false)
    }
  }, [])

  // Safe state update function to prevent updates on unmounted component
  const safeSetState = (setter, value) => {
    if (isMounted) {
      setter(value)
    }
  }

  const handleSave = () => {
    // Validate required fields
    if (!title.trim()) {
      // You would typically show an error message here
      console.warn("Title is required")
      return
    }

    // Here you would save the activity to your data store
    try {
      console.log({
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
    } catch (error) {
      console.error("Error saving activity:", error)
      // You would typically show an error message here
    }
  }

  const formatDate = (date: Date) => {
    try {
      return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
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

  const getSelectedNotificationLabel = () => {
    const option = NOTIFICATION_OPTIONS.find((opt) => opt.value === notificationTime)
    return option ? option.label : NOTIFICATION_OPTIONS[0].label
  }

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Generate calendar days
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

  // Handle date selection
  const handleDateSelection = (day: number) => {
    if (day) {
      const newDate = new Date(date)
      newDate.setFullYear(currentYear)
      newDate.setMonth(currentMonth)
      newDate.setDate(day)
      setDate(newDate)
      setSelectedDay(day)
    }
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
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

  // Handle scroll events for the tags ScrollView
  const handleTagsScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent
    setScrollPosition(contentOffset.x)
    setScrollViewWidth(layoutMeasurement.width)
    setContentWidth(contentSize.width)
  }

  // Calculate if we can scroll more to the right
  const canScrollRight = contentWidth > scrollViewWidth && scrollPosition < contentWidth - scrollViewWidth

  // Scroll to a specific section based on dot index
  const scrollToSection = (dotIndex) => {
    if (scrollViewRef.current && contentWidth > scrollViewWidth) {
      const sectionWidth = (contentWidth - scrollViewWidth) / 2
      let targetX = 0

      if (dotIndex === 1) {
        targetX = sectionWidth
      } else if (dotIndex === 2) {
        targetX = contentWidth - scrollViewWidth
      }

      scrollViewRef.current.scrollTo({ x: targetX, animated: true })
    }
  }

  // Scroll to the next section
  const scrollToNextSection = () => {
    if (scrollViewRef.current && contentWidth > scrollViewWidth) {
      const sectionWidth = (contentWidth - scrollViewWidth) / 2

      // Determine which section we're currently in
      let targetX = 0
      if (scrollPosition < sectionWidth / 2) {
        // We're in the first section, scroll to second
        targetX = sectionWidth
      } else if (scrollPosition < sectionWidth * 1.5) {
        // We're in the second section, scroll to third
        targetX = contentWidth - scrollViewWidth
      } else {
        // We're already at the end, loop back to start
        targetX = 0
      }

      scrollViewRef.current.scrollTo({ x: targetX, animated: true })
    }
  }

  // Format time values for input elements
  const getTimeInputValue = (date: Date) => {
    try {
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
    } catch (error) {
      console.error("Error formatting time for input:", error)
      return "00:00"
    }
  }

  // Format date value for input element
  const getDateInputValue = (date: Date) => {
    try {
      return date.toISOString().split("T")[0]
    } catch (error) {
      console.error("Error formatting date for input:", error)
      return new Date().toISOString().split("T")[0]
    }
  }

  // Get current active dot index based on scroll position
  const getActiveDotIndex = () => {
    if (contentWidth <= scrollViewWidth) return 0

    const sectionWidth = (contentWidth - scrollViewWidth) / 2
    if (scrollPosition < sectionWidth / 2) return 0
    if (scrollPosition < sectionWidth * 1.5) return 1
    return 2
  }

  const activeDotIndex = getActiveDotIndex()

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Add Activity</Text>
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

          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.datePickerContainer}>
              <TouchableOpacity style={styles.datePickerBackdrop} onPress={() => setShowDatePicker(false)} />
              <View style={[styles.datePickerContent, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.datePickerTitle, { color: theme.colors.text }]}>Select Date</Text>

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
                          item.day === selectedDay &&
                          currentMonth === date.getMonth() &&
                          currentYear === date.getFullYear() && {
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
                            item.day === selectedDay &&
                            currentMonth === date.getMonth() &&
                            currentYear === date.getFullYear() && {
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

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Add Tag</Text>

          <View style={styles.tagsContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleTagsScroll}
              scrollEventThrottle={16}
              style={styles.tagsScrollView}
              contentContainerStyle={styles.tagsScrollViewContent}
            >
              {TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  style={[
                    styles.tagItem,
                    { borderColor: theme.colors.border },
                    selectedTag === tag.id && {
                      backgroundColor: `${theme.colors.primary}20`,
                      borderColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => setSelectedTag(tag.id === selectedTag ? null : tag.id)}
                >
                  <Text style={styles.tagEmoji}>{tag.emoji}</Text>
                  <Text
                    style={[
                      styles.tagName,
                      { color: theme.colors.text },
                      selectedTag === tag.id && { color: theme.colors.primary },
                    ]}
                  >
                    {tag.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Clickable scroll indicator arrow */}
            {canScrollRight && (
              <TouchableOpacity onPress={scrollToNextSection} activeOpacity={0.7} style={styles.scrollIndicatorButton}>
                <Animated.View
                  style={[styles.scrollIndicator, { opacity: fadeAnim, backgroundColor: theme.colors.primary }]}
                >
                  <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </Animated.View>
              </TouchableOpacity>
            )}

            {/* Clickable scroll progress dots */}
            {contentWidth > scrollViewWidth && (
              <View style={styles.scrollProgressContainer}>
                <View style={styles.scrollProgressDots}>
                  {[0, 1, 2].map((dotIndex) => (
                    <TouchableOpacity
                      key={dotIndex}
                      onPress={() => scrollToSection(dotIndex)}
                      style={styles.scrollDotTouchable}
                    >
                      <View
                        style={[
                          styles.scrollProgressDot,
                          {
                            backgroundColor: activeDotIndex === dotIndex ? theme.colors.primary : theme.colors.border,
                            width: activeDotIndex === dotIndex ? 10 : 6,
                            height: activeDotIndex === dotIndex ? 6 : 6,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
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
            <Button title="Save Activity" onPress={handleSave} />
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
    position: "relative",
    marginBottom: 20,
  },
  tagsScrollView: {
    flexGrow: 0,
  },
  tagsScrollViewContent: {
    paddingRight: 40, // Space for the scroll indicator
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
  scrollIndicatorButton: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: [{ translateY: -12 }],
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  scrollProgressContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  scrollProgressDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollDotTouchable: {
    padding: 8, // Larger touch target
    marginHorizontal: 2,
  },
  scrollProgressDot: {
    borderRadius: 3,
    marginHorizontal: 1,
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
})

export default AddTaskScreen

