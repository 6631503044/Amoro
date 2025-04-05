"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import ActivityItem from "../components/ActivityItem"

type FilterType = "day" | "week" | "month"

const ToDoListScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { user } = useAuth()
  const [filter, setFilter] = useState<FilterType>("day")
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch activities based on the selected filter
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user || !user.id) return

      setLoading(true)
      setError(null)

      try {
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, "0")
        const day = String(today.getDate()).padStart(2, "0")

        const API_URL = "https://amoro-backend-3gsl.onrender.com"

        // Different API endpoints based on filter
        let endpoint = ""

        switch (filter) {
          case "day":
            endpoint = `${API_URL}/tasks/${user.id}/${year}/${month}/${day}`
            break
          case "week":
            // For week, we'll use the same endpoint but filter the results client-side
            endpoint = `${API_URL}/tasks/${user.id}/${year}/${month}`
            break
          case "month":
            endpoint = `${API_URL}/tasks/${user.id}/${year}/${month}`
            break
          default:
            endpoint = `${API_URL}/tasks/${user.id}/${year}/${month}/${day}`
        }

        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        // Transform the data to match the ActivityItem component's expected format
        const formattedActivities = []

        // Check if data is not empty
        if (data && Object.keys(data).length > 0) {
          // Iterate through each taskId
          Object.entries(data).forEach(([taskId, taskData]) => {
            // Check if taskData is an array
            if (Array.isArray(taskData)) {
              taskData.forEach((task) => {
                // Get emoji based on tag
                let emoji = "📝" // Default emoji
                switch (task.Tag) {
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

                const taskDate = new Date(task.date)

                // For week filter, check if the date is within the current week
                if (filter === "week") {
                  const startOfWeek = new Date(today)
                  startOfWeek.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)

                  const endOfWeek = new Date(startOfWeek)
                  endOfWeek.setDate(startOfWeek.getDate() + 6) // End of week (Saturday)

                  // Skip if not in current week
                  if (taskDate < startOfWeek || taskDate > endOfWeek) {
                    return
                  }
                }

                formattedActivities.push({
                  id: taskId,
                  title: task.title,
                  startTime: task.startTime || "00:00",
                  endTime: task.endTime || "23:59",
                  date: task.date,
                  type: task.withPartner ? "couple" : "personal",
                  tag: task.Tag,
                  emoji: emoji,
                  description: task.description,
                  location: task.location,
                  notification: task.Notification,
                  complete: task.Complete,
                  mood: task.Mood,
                  // Include the original task data for passing to other screens
                  originalData: task,
                })
              })
            }
          })
        }

        // Sort activities by date and time
        formattedActivities.sort((a, b) => {
          // First sort by date
          const dateA = new Date(a.date)
          const dateB = new Date(b.date)

          if (dateA < dateB) return -1
          if (dateA > dateB) return 1

          // If same date, sort by start time
          return a.startTime.localeCompare(b.startTime)
        })

        setActivities(formattedActivities)
      } catch (err) {
        console.error("Error fetching activities:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [filter, user])

  const handleAddActivity = () => {
    navigation.navigate("AddTask" as never)
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
      ) : activities.length > 0 ? (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActivityItem activity={item} onPress={() => handleActivityPress(item)} />}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
})

export default ToDoListScreen

