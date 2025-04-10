"use client"
import { useState, useCallback, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ActivityIndicator } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

type FilterType = "day" | "week" | "month"
type ActivityType = "all" | "single" | "couple"

const MoodsScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { t, formatDate } = useLanguage()
  const { user } = useAuth()
  const [timeFilter, setTimeFilter] = useState<FilterType>("day")
  const [typeFilter, setTypeFilter] = useState<ActivityType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dropdownVisible, setDropdownVisible] = useState(false)

  // Add state for activities, loading, and error
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialLoadDone, setInitialLoadDone] = useState(false)

  // Cache for storing fetched data
  const [dataCache, setDataCache] = useState({})

  const fetchActivities = async (forceRefresh = false) => {
    if (!user || !user.id) return

    setLoading(true)
    setError(null)

    try {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const cacheKey = `${year}-${month}`

      // Check if data is cached and not a forced refresh
      if (!forceRefresh && dataCache[cacheKey]) {
        console.log("Using cached data for", cacheKey)
        setActivities(dataCache[cacheKey])
        setLoading(false)
        setInitialLoadDone(true)
        return
      }

      // Construct the API URL based on the timeFilter
      const API_URL = "https://amoro-backend-3gsl.onrender.com"
      const endpoint = `${API_URL}/tasks/${user.id}/${year}/${month}`

      console.log("Fetching from endpoint:", endpoint)
      const response = await fetch(endpoint)

      if (!response.ok) {
        if (response.status === 404) {
          // No tasks found for this period
          setActivities([])
          setLoading(false)
          setInitialLoadDone(true)
          return
        }
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      console.log("API response:", data)

      const completedActivities = []

      // Process the data - handle array response format
      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (item && item.data) {
            const taskData = item.data
            const taskId = item.taskId || item.id

            // Only include completed tasks
            if (taskData.Complete === true || taskData.complete === true) {
              // Get emoji based on tag
              let emoji = "📝" // Default emoji
              const tag = taskData.Tag || taskData.tag || ""
              let tagName = ""

              if (typeof tag === "string") {
                tagName = tag
              } else if (tag && typeof tag === "object" && tag.name) {
                tagName = tag.name
              }

              switch (tagName) {
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

              completedActivities.push({
                id: taskId,
                title: taskData.title,
                startTime: taskData.startTime || "00:00",
                endTime: taskData.endTime || "23:59",
                date: taskData.date,
                type: taskData.withPartner ? "couple" : "personal", // This checks if withPartner is not null
                withPartner: taskData.withPartner, // Add this field
                tag: tagName,
                emoji: emoji,
                reviewed: taskData.Mood && (taskData.Mood.Score || taskData.Mood.Description),
                rating: taskData.Mood && taskData.Mood.Score ? Number.parseInt(taskData.Mood.Score) : 0,
                description: taskData.description,
                location: taskData.location,
              })
            }
          }
        })
      }

      // Cache the fetched data
      setDataCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: completedActivities,
      }))

      setActivities(completedActivities)
      setInitialLoadDone(true)

      console.log("Processed activities:", completedActivities.length)
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Update the handleTimeFilterChange function to properly filter by time period
  // The current implementation sets the filter but doesn't actually filter the data

  const handleTimeFilterChange = (newFilter: FilterType) => {
    setTimeFilter(newFilter)

    // Apply time-based filtering to the cached data
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const cacheKey = `${year}-${month}`

    // Get data from cache if available
    const cachedData = dataCache[cacheKey] || []

    if (cachedData.length > 0) {
      let filteredData = [...cachedData]

      if (newFilter === "day") {
        // Filter for today only
        const todayStr = today.toISOString().split("T")[0]
        filteredData = cachedData.filter((activity) => activity.date === todayStr)
      } else if (newFilter === "week") {
        // Filter for current week
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0)

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6) // End of week (Saturday)
        endOfWeek.setHours(23, 59, 59, 999)

        filteredData = cachedData.filter((activity) => {
          const activityDate = new Date(activity.date)
          return activityDate >= startOfWeek && activityDate <= endOfWeek
        })
      }
      // For "month", we use all data from the current month (already filtered by API)

      setActivities(filteredData)
    } else {
      // If no cached data, trigger a fetch
      fetchActivities(true)
    }
  }

  // Add a useEffect to apply time filter when activities change
  useEffect(() => {
    // Skip if no activities or initial load
    if (activities.length === 0 || !initialLoadDone) return

    handleTimeFilterChange(timeFilter)
  }, [initialLoadDone])

  // Update the useFocusEffect to include user?.id in dependencies
  useFocusEffect(
    useCallback(() => {
      const checkRefreshNeeded = async () => {
        try {
          const refreshFlag = await AsyncStorage.getItem("refreshMoodsData")
          if (refreshFlag === "true") {
            // Clear the flag
            await AsyncStorage.setItem("refreshMoodsData", "false")
            // Force refresh the current month's data
            fetchActivities(true)
          } else {
            // Normal fetch
            fetchActivities()
          }
        } catch (error) {
          console.error("Error checking refresh flag:", error)
        }
      }

      checkRefreshNeeded()

      // Return cleanup function
      return () => {
        // Any cleanup needed
      }
    }, [user?.id]), // Add user?.id as dependency
  )

  const filteredActivities = activities.filter((activity) => {
    // Filter by search query
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by activity type (single/couple)
    const matchesType = typeFilter === "all" || activity.type === typeFilter

    return matchesSearch && matchesType
  })

  // Update the renderActivityItem function to pass the full activity data
  const renderActivityItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.activityItem, { backgroundColor: theme.colors.card }]}
        onPress={() =>
          navigation.navigate("ActivityReview" as never, { activityId: item.id, activityData: item } as never)
        }
      >
        <View style={styles.activityHeader}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
          <View style={styles.activityDetails}>
            <Text style={[styles.activityTitle, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={[styles.activityDate, { color: theme.colors.secondaryText }]}>
              {formatDate(new Date(item.date), "dateFormat")}
            </Text>
            <View style={styles.tagContainer}>
              <Text style={[styles.tagText, { color: theme.colors.secondaryText }]}>
                {item.type === "single" ? t("single") : t("partner")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.activityFooter}>
          {item.reviewed ? (
            renderRatingStars(item.rating)
          ) : (
            <TouchableOpacity
              style={[styles.reviewButton, { backgroundColor: theme.colors.primary }]}
              onPress={() =>
                navigation.navigate("AddReview" as never, { activityId: item.id, activityData: item } as never)
              }
            >
              <Text style={styles.reviewButtonText}>{t("addReview")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const renderRatingStars = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "heart" : "heart-outline"}
            size={16}
            color={theme.colors.primary}
          />
        ))}
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("moods")}</Text>
      </View>

      <View style={styles.searchAndFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder={t("searchActivities")}
            placeholderTextColor={theme.colors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={[styles.filterIconButton, typeFilter !== "all" && { backgroundColor: `${theme.colors.primary}20` }]}
          onPress={() => setDropdownVisible(true)}
        >
          <Ionicons name="funnel" size={20} color={typeFilter !== "all" ? theme.colors.primary : theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownVisible(false)}>
          <View
            style={[
              styles.dropdownMenu,
              {
                backgroundColor: theme.colors.card,
                top: 130, // Position below the filter icon
                right: 20,
              },
            ]}
          >
            <View style={styles.dropdownHeader}>
              <Text style={[styles.dropdownTitle, { color: theme.colors.text }]}>{t("filterActivities")}</Text>
            </View>

            <TouchableOpacity
              style={[styles.dropdownItem, typeFilter === "all" && { backgroundColor: `${theme.colors.primary}20` }]}
              onPress={() => {
                setTypeFilter("all")
                setDropdownVisible(false)
              }}
            >
              <Ionicons
                name="apps"
                size={18}
                color={typeFilter === "all" ? theme.colors.primary : theme.colors.text}
                style={styles.dropdownItemIcon}
              />
              <Text
                style={[
                  styles.dropdownItemText,
                  { color: typeFilter === "all" ? theme.colors.primary : theme.colors.text },
                ]}
              >
                {t("allActivities")}
              </Text>
              {typeFilter === "all" && (
                <Ionicons name="checkmark" size={18} color={theme.colors.primary} style={styles.dropdownItemCheck} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdownItem, typeFilter === "single" && { backgroundColor: `${theme.colors.primary}20` }]}
              onPress={() => {
                setTypeFilter("single")
                setDropdownVisible(false)
              }}
            >
              <Ionicons
                name="person"
                size={18}
                color={typeFilter === "single" ? theme.colors.primary : theme.colors.text}
                style={styles.dropdownItemIcon}
              />
              <Text
                style={[
                  styles.dropdownItemText,
                  { color: typeFilter === "single" ? theme.colors.primary : theme.colors.text },
                ]}
              >
                {t("singleActivities")}
              </Text>
              {typeFilter === "single" && (
                <Ionicons name="checkmark" size={18} color={theme.colors.primary} style={styles.dropdownItemCheck} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdownItem, typeFilter === "couple" && { backgroundColor: `${theme.colors.primary}20` }]}
              onPress={() => {
                setTypeFilter("couple")
                setDropdownVisible(false)
              }}
            >
              <Ionicons
                name="people"
                size={18}
                color={typeFilter === "couple" ? theme.colors.primary : theme.colors.text}
                style={styles.dropdownItemIcon}
              />
              <Text
                style={[
                  styles.dropdownItemText,
                  { color: typeFilter === "couple" ? theme.colors.primary : theme.colors.text },
                ]}
              >
                {t("partnerActivities")}
              </Text>
              {typeFilter === "couple" && (
                <Ionicons name="checkmark" size={18} color={theme.colors.primary} style={styles.dropdownItemCheck} />
              )}
            </TouchableOpacity>

            <View style={styles.dropdownFooter}>
              <TouchableOpacity
                style={[styles.clearButton, { borderColor: theme.colors.primary }]}
                onPress={() => {
                  setTypeFilter("all")
                  setDropdownVisible(false)
                }}
              >
                <Text style={[styles.clearButtonText, { color: theme.colors.primary }]}>{t("clearFilter")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>{t("reviewAndRate")}</Text>

      {/* Time filter (Day/Week/Month) */}
      <View style={styles.timeFilterContainer}>
        <TouchableOpacity
          style={[styles.timeFilterButton, timeFilter === "day" && { backgroundColor: theme.colors.primary }]}
          onPress={() => handleTimeFilterChange("day")}
        >
          <Text style={[styles.filterButtonText, { color: timeFilter === "day" ? "#FFFFFF" : theme.colors.text }]}>
            {t("day")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timeFilterButton, timeFilter === "week" && { backgroundColor: theme.colors.primary }]}
          onPress={() => handleTimeFilterChange("week")}
        >
          <Text style={[styles.filterButtonText, { color: timeFilter === "week" ? "#FFFFFF" : theme.colors.text }]}>
            {t("week")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timeFilterButton, timeFilter === "month" && { backgroundColor: theme.colors.primary }]}
          onPress={() => handleTimeFilterChange("month")}
        >
          <Text style={[styles.filterButtonText, { color: timeFilter === "month" ? "#FFFFFF" : theme.colors.text }]}>
            {t("month")}
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
            Error loading activities: {error}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={renderActivityItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle-outline" size={60} color={theme.colors.secondaryText} />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.text, fontFamily: "Poppins-Medium", fontSize: 18, marginTop: 20 },
                ]}
              >
                No Tasks to Review
              </Text>
              <Text style={[styles.emptyText, { color: theme.colors.secondaryText }]}>
                Complete tasks will appear here for you to review and rate
              </Text>
            </View>
          }
        />
      )}
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
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  searchAndFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdownMenu: {
    position: "absolute",
    width: 250,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
  },
  dropdownHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  dropdownTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  dropdownItemIcon: {
    marginRight: 12,
  },
  dropdownItemText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    flex: 1,
  },
  dropdownItemCheck: {
    marginLeft: 8,
  },
  dropdownFooter: {
    padding: 12,
    alignItems: "center",
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  clearButtonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  timeFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    marginHorizontal: 5,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  activityItem: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  emoji: {
    fontSize: 24,
  },
  activityDetails: {
    flex: 1,
    justifyContent: "center",
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 5,
  },
  activityDate: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  tagContainer: {
    flexDirection: "row",
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  activityFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  reviewButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reviewButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
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

export default MoodsScreen
