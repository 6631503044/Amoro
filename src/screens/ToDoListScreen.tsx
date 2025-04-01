"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
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
  {
    id: "5",
    title: "Grocery Shopping",
    startTime: "16:00",
    endTime: "17:30",
    date: "2023-06-17",
    type: "couple",
    tag: "shopping",
    emoji: "🛒",
  },
  {
    id: "6",
    title: "Gym Session",
    startTime: "18:00",
    endTime: "19:30",
    date: "2023-06-18",
    type: "personal",
    tag: "exercise",
    emoji: "💪",
  },
]

type FilterType = "day" | "week" | "month"

const ToDoListScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [filter, setFilter] = useState<FilterType>("day")

  const getFilteredActivities = () => {
    const today = new Date()

    switch (filter) {
      case "day":
        // Filter for today
        return MOCK_ACTIVITIES.filter((activity) => {
          const activityDate = new Date(activity.date)
          return (
            activityDate.getDate() === today.getDate() &&
            activityDate.getMonth() === today.getMonth() &&
            activityDate.getFullYear() === today.getFullYear()
          )
        })

      case "week":
        // Filter for the current week
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)

        return MOCK_ACTIVITIES.filter((activity) => {
          const activityDate = new Date(activity.date)
          return activityDate >= startOfWeek && activityDate <= endOfWeek
        })

      case "month":
        // Filter for the current month
        return MOCK_ACTIVITIES.filter((activity) => {
          const activityDate = new Date(activity.date)
          return activityDate.getMonth() === today.getMonth() && activityDate.getFullYear() === today.getFullYear()
        })

      default:
        return MOCK_ACTIVITIES
    }
  }

  const handleAddActivity = () => {
    navigation.navigate("AddTask" as never)
  }

  const filteredActivities = getFilteredActivities()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>To-Do List</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "day" && { backgroundColor: theme.colors.primary }]}
          onPress={() => setFilter("day")}
        >
          <Text style={[styles.filterButtonText, { color: filter === "day" ? "#FFFFFF" : theme.colors.text }]}>
            Day
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === "week" && { backgroundColor: theme.colors.primary }]}
          onPress={() => setFilter("week")}
        >
          <Text style={[styles.filterButtonText, { color: filter === "week" ? "#FFFFFF" : theme.colors.text }]}>
            Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === "month" && { backgroundColor: theme.colors.primary }]}
          onPress={() => setFilter("month")}
        >
          <Text style={[styles.filterButtonText, { color: filter === "month" ? "#FFFFFF" : theme.colors.text }]}>
            Month
          </Text>
        </TouchableOpacity>
      </View>

      {filteredActivities.length > 0 ? (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActivityItem activity={item} onPress={() => {}} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={60} color={theme.colors.secondaryText} />
          <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>No Activities</Text>
          <Text style={[styles.emptyStateText, { color: theme.colors.secondaryText }]}>
            You don't have any activities for this {filter}
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleAddActivity}
          >
            <Text style={styles.addButtonText}>Add Activity</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddActivity}
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 30,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
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

export default ToDoListScreen

