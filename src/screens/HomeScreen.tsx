"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Modal, ActivityIndicator } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { Calendar } from "react-native-calendars"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"
import ActivityItem from "../components/ActivityItem"
import AsyncStorage from "@react-native-async-storage/async-storage"

const HomeScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { t, formatDate } = useLanguage()
  const { user } = useAuth()
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]) // Format: YYYY-MM-DD

  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate).getMonth())
  const [currentYear, setCurrentYear] = useState(new Date(selectedDate).getFullYear())

  // Replace the useState declarations at the top of the component with this updated version that includes a cache
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [dataCache, setDataCache] = useState({})
  const [initialLoadDone, setInitialLoadDone] = useState(false)

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

  // Replace the fetchActivities function with this optimized version
  const fetchActivities = async (forceRefresh = false) => {
    if (!user || !user.id) return

    // Format the date components for the API path
    const year = currentYear
    const month = String(currentMonth + 1).padStart(2, "0")
    const cacheKey = `${year}-${month}`

    // Check if we already have this data in cache and it's not a forced refresh
    if (!forceRefresh && dataCache[cacheKey] && dataCache[cacheKey].length > 0) {
      setActivities(dataCache[cacheKey])
      return
    }

    // Only show loading indicator on initial load or when changing months
    if (!initialLoadDone || !dataCache[cacheKey]) {
      setLoading(true)
    }

    setError(null)

    try {
      const API_URL = "https://amoro-backend-3gsl.onrender.com"
      const response = await fetch(`${API_URL}/tasks/${user.id}/${year}/${month}`)

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Transform the data to match the ActivityItem component's expected format
      const formattedActivities = []

      // Check if data is an array and not empty
      if (data && Array.isArray(data) && data.length > 0) {
        data.forEach((item) => {
          const { taskId, data: taskData, day } = item

          // Get emoji based on tag
          let emoji = "📝" // Default emoji
          const tag = taskData.Tag || taskData.tag // Handle both capitalization formats

          switch (tag) {
            case "Date":
              emoji = "❤️"
              break
            case "Work":
              emoji = "💼"
              break
            case "Exercise":
              emoji = "🏃‍♂️"
              break
            case "Entertainment":
              emoji = "🎬"
              break
            case "Travel":
              emoji = "✈️"
              break
            case "Food":
              emoji = "🍽️"
              break
            case "Shopping":
              emoji = "🛍️"
              break
            case "Study":
              emoji = "📚"
              break
          }

          formattedActivities.push({
            id: taskId,
            title: taskData.title,
            startTime: taskData.startTime || "00:00",
            endTime: taskData.endTime || "23:59",
            date: taskData.date,
            type: taskData.withPartner ? "couple" : "personal",
            tag: tag,
            emoji: emoji,
            description: taskData.description,
            location: taskData.location,
            notification: taskData.Notification || taskData.notification,
            complete: taskData.Complete || taskData.completed || false,
            mood: taskData.Mood || taskData.mood,
            // Include the original task data for passing to other screens
            originalData: taskData,
          })
        })
      }

      // Update the cache with the new data
      setDataCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: formattedActivities,
      }))

      setActivities(formattedActivities)
      setInitialLoadDone(true)

      // Save the last fetch time
      await AsyncStorage.setItem("lastDataFetch", new Date().toISOString())
      await AsyncStorage.setItem(`lastFetch-${cacheKey}`, new Date().toISOString())
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Replace the useFocusEffect with this optimized version
  useFocusEffect(
    useCallback(() => {
      const checkRefreshNeeded = async () => {
        try {
          const refreshFlag = await AsyncStorage.getItem("refreshHomeData")
          if (refreshFlag === "true") {
            // Clear the flag
            await AsyncStorage.setItem("refreshHomeData", "false")
            // Force refresh the current month's data
            fetchActivities(true)
          }
        } catch (error) {
          console.error("Error checking refresh flag:", error)
        }
      }

      checkRefreshNeeded()
    }, []),
  )

  // Replace the useEffect with this optimized version
  useEffect(() => {
    // Only fetch if we don't have data for this month/year in cache
    const cacheKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`

    if (!dataCache[cacheKey]) {
      fetchActivities()
    } else {
      // If we have cached data, use it
      setActivities(dataCache[cacheKey])
    }
  }, [currentYear, currentMonth, user, refreshTrigger])

  // Generate years for picker (5 years back and 5 years forward)
  const generateYears = () => {
    const years = []
    const currentYear = new Date().getFullYear()
    for (let i = -5; i <= 5; i++) {
      years.push(currentYear + i)
    }
    return years
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
      updateSelectedDate(11, currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
      updateSelectedDate(currentMonth - 1, currentYear)
    }
  }

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
      updateSelectedDate(0, currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
      updateSelectedDate(currentMonth + 1, currentYear)
    }
  }

  // Replace the updateSelectedDate function with this optimized version
  const updateSelectedDate = (month, year) => {
    const currentDate = new Date(selectedDate)
    const day = currentDate.getDate()

    // Check if the day exists in the new month
    const daysInNewMonth = new Date(year, month + 1, 0).getDate()
    const newDay = day > daysInNewMonth ? daysInNewMonth : day

    const newDate = new Date(year, month, newDay)
    setSelectedDate(newDate.toISOString().split("T")[0])
  }

  // Fix the calendar dots issue by making the keys unique
  const getMarkedDates = () => {
    const markedDates = {}

    // First, mark the selected date
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: theme.colors.primary,
      dots: [],
    }

    // If we have activities data, add dots for each activity date
    if (Array.isArray(activities)) {
      activities.forEach((activity) => {
        if (!markedDates[activity.date]) {
          markedDates[activity.date] = { dots: [] }
        } else if (!markedDates[activity.date].dots) {
          markedDates[activity.date].dots = []
        }

        // Add dot with a unique key for each activity
        markedDates[activity.date].dots.push({
          key: `${activity.type}-${activity.id}`, // Make keys unique by adding ID
          color: activity.type === "personal" ? theme.colors.personalActivity : theme.colors.coupleActivity,
          selectedDotColor: activity.type === "personal" ? theme.colors.personalActivity : theme.colors.coupleActivity,
        })
      })
    }

    return markedDates
  }

  // Filter activities for the selected date
  const activitiesForSelectedDate = activities.filter((activity) => activity.date === selectedDate)

  const handleAddActivity = () => {
    navigation.navigate("AddTask" as never)
  }

  const handleViewAllActivities = () => {
    navigation.navigate("ToDoList" as never)
  }

  const handleActivityPress = (activity) => {
    // Navigate to ShowTask screen with the activity data
    navigation.navigate(
      "ShowTask" as never,
      {
        activityId: activity.id,
        activityData: activity,
      } as never,
    )
  }

  // Update the calendarTheme object to better follow the theme system
  const calendarTheme = {
    calendarBackground: theme.colors.card,
    textSectionTitleColor: theme.colors.text,
    selectedDayBackgroundColor: theme.colors.primary,
    selectedDayTextColor: "#ffffff",
    todayTextColor: theme.colors.primary,
    dayTextColor: theme.colors.text,
    textDisabledColor: theme.colors.secondaryText,
    dotColor: theme.colors.primary,
    selectedDotColor: "#ffffff",
    arrowColor: theme.colors.primary,
    monthTextColor: theme.colors.text,
    indicatorColor: theme.colors.primary,
    textDayFontFamily: "Poppins-Regular",
    textMonthFontFamily: "Poppins-SemiBold",
    textDayHeaderFontFamily: "Poppins-Medium",
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 14,
    "stylesheet.day.basic": {
      base: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
      },
      today: {
        backgroundColor: `${theme.colors.primary}20`,
        borderRadius: 16,
      },
      todayText: {
        color: theme.colors.primary,
        fontWeight: "bold",
      },
    },
    "stylesheet.calendar.header": {
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 6,
        alignItems: "center",
      },
      monthText: {
        color: theme.colors.text,
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
      },
      arrow: {
        padding: 10,
      },
      dayHeader: {
        marginTop: 2,
        marginBottom: 7,
        width: 32,
        textAlign: "center",
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: theme.colors.secondaryText,
      },
    },
    "stylesheet.dot": {
      dot: {
        width: 6,
        height: 6,
        marginTop: 1,
        marginHorizontal: 1,
        borderRadius: 3,
      },
    },
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("homeTitle")}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.calendarContainer,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              borderWidth: 1,
            },
          ]}
        >
          {/* Custom Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            <View style={styles.monthYearSelectors}>
              <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
                <Text style={[styles.calendarMonthYear, { color: theme.colors.text }]}>{MONTHS[currentMonth]}</Text>
              </TouchableOpacity>
              <Text style={[styles.calendarMonthYearSeparator, { color: theme.colors.text }]}> </Text>
              <TouchableOpacity onPress={() => setShowYearPicker(true)}>
                <Text style={[styles.calendarMonthYear, { color: theme.colors.text }]}>{currentYear}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={goToNextMonth}>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Use the original Calendar component but with customized renderHeader */}
          <Calendar
            key={`calendar-${theme.mode}-${currentMonth}-${currentYear}`}
            theme={calendarTheme}
            markingType={"multi-dot"}
            markedDates={getMarkedDates()}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            enableSwipeMonths={true}
            hideArrows={true}
            hideExtraDays={false}
            renderHeader={() => null} // Hide the default header
            current={`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`}
            style={styles.calendar}
          />
        </View>

        {/* Month Picker Modal */}
        <Modal
          visible={showMonthPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowMonthPicker(false)}
        >
          <View style={styles.pickerContainer}>
            <TouchableOpacity style={styles.pickerBackdrop} onPress={() => setShowMonthPicker(false)} />
            <View style={[styles.pickerContent, { backgroundColor: theme.colors.card }]}>
              <View style={styles.pickerHeader}>
                <Text style={[styles.pickerTitle, { color: theme.colors.text }]}>Select Month</Text>
                <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.pickerScrollView}>
                {MONTHS.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      currentMonth === index && {
                        backgroundColor: `${theme.colors.primary}20`,
                      },
                    ]}
                    onPress={() => {
                      setCurrentMonth(index)
                      updateSelectedDate(index, currentYear)
                      setShowMonthPicker(false)
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        { color: theme.colors.text },
                        currentMonth === index && {
                          color: theme.colors.primary,
                          fontFamily: "Poppins-SemiBold",
                        },
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Year Picker Modal */}
        <Modal
          visible={showYearPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowYearPicker(false)}
        >
          <View style={styles.pickerContainer}>
            <TouchableOpacity style={styles.pickerBackdrop} onPress={() => setShowYearPicker(false)} />
            <View style={[styles.pickerContent, { backgroundColor: theme.colors.card }]}>
              <View style={styles.pickerHeader}>
                <Text style={[styles.pickerTitle, { color: theme.colors.text }]}>Select Year</Text>
                <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.pickerScrollView}>
                {generateYears().map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      currentYear === year && {
                        backgroundColor: `${theme.colors.primary}20`,
                      },
                    ]}
                    onPress={() => {
                      setCurrentYear(year)
                      updateSelectedDate(currentMonth, year)
                      setShowYearPicker(false)
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        { color: theme.colors.text },
                        currentYear === year && {
                          color: theme.colors.primary,
                          fontFamily: "Poppins-SemiBold",
                        },
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View style={styles.dateSection}>
          <Text style={[styles.selectedDate, { color: theme.colors.text }]}>
            {formatDate(new Date(selectedDate), "dateFormat")}
          </Text>
        </View>

        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t("activities")}</Text>
            <TouchableOpacity onPress={handleViewAllActivities}>
              <Text style={[styles.viewAll, { color: theme.colors.primary }]}>{t("viewAll")}</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.colors.secondaryText }]}>
                Error loading activities. Please try again.
              </Text>
            </View>
          ) : activitiesForSelectedDate.length > 0 ? (
            <FlatList
              data={activitiesForSelectedDate}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ActivityItem activity={item} onPress={() => handleActivityPress(item)} />}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: theme.colors.secondaryText }]}>{t("noActivities")}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddActivity}
        accessibilityLabel={t("addActivity")}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  calendarContainer: {
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
    overflow: "hidden",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
  },
  monthYearSelectors: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarMonthYear: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  calendarMonthYearSeparator: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  calendar: {
    borderRadius: 10,
    overflow: "hidden",
  },
  dateSection: {
    paddingHorizontal: 20,
    marginVertical: 15,
    alignItems: "center",
  },
  selectedDate: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  activitiesSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  viewAll: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 15,
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  errorContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  pickerBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContent: {
    width: "80%",
    maxHeight: "60%",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  pickerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  pickerScrollView: {
    maxHeight: 300,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
})

export default HomeScreen

