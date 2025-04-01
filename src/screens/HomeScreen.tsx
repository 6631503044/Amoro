"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Calendar } from "react-native-calendars"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"
import ActivityItem from "../components/ActivityItem"

// Mock data for activities
const MOCK_ACTIVITIES = [
  {
    id: "1",
    title: "Morning Jog",
    startTime: "07:00",
    endTime: "08:00",
    date: "2023-06-15",
    type: "personal",
    tag: "exercise",
    emoji: "🏃‍♂️",
  },
  {
    id: "2",
    title: "Dinner Date",
    startTime: "19:00",
    endTime: "21:00",
    date: "2023-06-15",
    type: "couple",
    tag: "date",
    emoji: "🍽️",
  },
  {
    id: "3",
    title: "Movie Night",
    startTime: "21:30",
    endTime: "23:30",
    date: "2023-06-15",
    type: "couple",
    tag: "entertainment",
    emoji: "🎬",
  },
  {
    id: "4",
    title: "Work Meeting",
    startTime: "10:00",
    endTime: "11:00",
    date: "2023-06-16",
    type: "personal",
    tag: "work",
    emoji: "💼",
  },
]

const HomeScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { t, formatDate } = useLanguage()
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]) // Format: YYYY-MM-DD

  // Fix the calendar dots issue by making the keys unique
  const getMarkedDates = () => {
    const markedDates = {}

    MOCK_ACTIVITIES.forEach((activity) => {
      if (!markedDates[activity.date]) {
        markedDates[activity.date] = { dots: [] }
      }

      // Add dot with a unique key for each activity
      markedDates[activity.date].dots.push({
        key: `${activity.type}-${activity.id}`, // Make keys unique by adding ID
        color: activity.type === "personal" ? theme.colors.personalActivity : theme.colors.coupleActivity,
        selectedDotColor: activity.type === "personal" ? theme.colors.personalActivity : theme.colors.coupleActivity,
      })
    })

    // Add selected date styling
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: theme.colors.primary,
    }

    return markedDates
  }

  // Filter activities for the selected date
  const activitiesForSelectedDate = MOCK_ACTIVITIES.filter((activity) => activity.date === selectedDate)

  const handleAddActivity = () => {
    navigation.navigate("AddTask" as never)
  }

  const handleViewAllActivities = () => {
    navigation.navigate("ToDoList" as never)
  }

  const handleActivityPress = (activityId: string) => {
    // @ts-ignore - Ignoring type error for navigation
    navigation.navigate("ShowTask", { activityId })
  }

  // Calendar theme configuration
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
    'stylesheet.calendar.header': {
      dayHeader: {
        color: theme.colors.text,
      },
    },
    'stylesheet.calendar.main': {
      dayContainer: {
        backgroundColor: theme.colors.card,
      },
    },
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("homeTitle")}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Calendar
          theme={calendarTheme}
          markingType={"multi-dot"}
          markedDates={getMarkedDates()}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          enableSwipeMonths={true}
          style={[styles.calendar, { backgroundColor: theme.colors.card }]}
        />

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

          {activitiesForSelectedDate.length > 0 ? (
            <FlatList
              data={activitiesForSelectedDate}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ActivityItem activity={item} onPress={() => handleActivityPress(item.id)} />}
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
  calendar: {
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
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
})

export default HomeScreen

