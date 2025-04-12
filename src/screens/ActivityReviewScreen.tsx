"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { format, getYear, getMonth, getDate } from "date-fns"
import { useState, useEffect } from "react"

const API_URL = "https://amoro-backend-3gsl.onrender.com"

const ActivityReviewScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { theme } = useTheme()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [partnerLoading, setPartnerLoading] = useState(false)
  const [activity, setActivity] = useState(null)
  const [partnerReview, setPartnerReview] = useState(null)
  const [error, setError] = useState(null)

  // Get the activity data and/or activityId from route params
  const { activityData, activityId } = route.params || {}

  useEffect(() => {
    // If we received activity data directly from the mood page, use it
    if (activityData) {
      console.log("Using activity data from mood page:", activityData)
      setActivity(activityData)

      // If it's a couple activity with a partnerId, fetch partner's review
      if (activityData.type === "couple" && activityData.partnerId) {
        fetchPartnerReview(activityData)
      }
    }
    // Otherwise, fetch the activity data using the activityId
    else if (activityId) {
      fetchActivityData(activityId)
    }
    // No data or ID provided
    else {
      setError("No activity information provided")
    }
  }, [activityData, activityId])

  const fetchActivityData = async (id) => {
    setLoading(true)
    try {
      console.log("Fetching activity data for ID:", id)
      const response = await fetch(`${API_URL}/activities/${id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch activity: ${response.status}`)
      }

      const data = await response.json()
      console.log("Activity data fetched:", data)
      setActivity(data)

      // If it's a couple activity with a partnerId, fetch partner's review
      if (data.type === "couple" && data.partnerId) {
        fetchPartnerReview(data)
      }
    } catch (err) {
      console.error("Error fetching activity:", err)
      setError(err.message || "Failed to load activity data")
    } finally {
      setLoading(false)
    }
  }

  const fetchPartnerReview = async (activityData) => {
    if (!activityData.partnerId || !activityData.date || !activityData.id) {
      console.log("Missing partnerId, date, or taskId, cannot fetch partner review")
      return
    }

    setPartnerLoading(true)
    try {
      // Extract date components from the activity date
      const activityDate = new Date(activityData.date)
      const year = getYear(activityDate)
      const month = getMonth(activityDate) + 1 // getMonth is 0-indexed, API expects 1-indexed
      const day = getDate(activityDate)
      const taskId = activityData.id

      console.log(
        `Fetching partner review for task: ${taskId}, date: ${year}/${month}/${day}, partner: ${activityData.partnerId}`,
      )

      // Use the specific task API endpoint to fetch partner's review
      const partnerResponse = await fetch(
        `${API_URL}/tasks/${activityData.partnerId}/${year}/${month}/${day}/${taskId}`,
      )

      if (!partnerResponse.ok) {
        console.log(`Partner has no review for task ${taskId}`)
        setPartnerReview(null)
        return
      }

      const partnerTask = await partnerResponse.json()
      console.log("Partner task fetched:", partnerTask)

      // Extract review data from the partner task
      const partnerReviewData = {
        mood: partnerTask.mood || null,
        rating: partnerTask.rating || null,
        review: partnerTask.review || null,
      }

      setPartnerReview(partnerReviewData)
    } catch (partnerErr) {
      console.error("Error fetching partner review:", partnerErr)
      // Not setting error state here as this is not a critical error
    } finally {
      setPartnerLoading(false)
    }
  }

  const renderRatingStars = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "heart" : "heart-outline"}
            size={24}
            color={theme.colors.primary}
            style={styles.ratingStar}
          />
        ))}
      </View>
    )
  }

  const handleEditReview = () => {
    navigation.navigate("AddReview", { activityId: activity?.id || activityId })
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading activity...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle-outline" size={50} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!activity) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>Activity not found</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Activity Review</Text>
        <TouchableOpacity onPress={handleEditReview}>
          <Ionicons name="create-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.activityHeader, { backgroundColor: theme.colors.card }]}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{activity.emoji || "🎯"}</Text>
          </View>
          <View style={styles.activityDetails}>
            <Text style={[styles.activityTitle, { color: theme.colors.text }]}>{activity.title}</Text>
            <Text style={[styles.activityDate, { color: theme.colors.secondaryText }]}>
              {format(new Date(activity.date), "MMMM d, yyyy")}
            </Text>
            <Text style={[styles.activityTime, { color: theme.colors.secondaryText }]}>
              {activity.startTime} - {activity.endTime}
            </Text>
          </View>
        </View>

        {/* User's review section */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Mood</Text>
          <Text style={[styles.moodText, { color: theme.colors.text }]}>{activity.mood || "Not specified"}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Rating</Text>
          {activity.rating ? (
            renderRatingStars(activity.rating)
          ) : (
            <Text style={[styles.noReviewText, { color: theme.colors.secondaryText }]}>
              You haven't rated this activity yet
            </Text>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Review</Text>
          {activity.review ? (
            <Text style={[styles.sectionContent, { color: theme.colors.text }]}>{activity.review}</Text>
          ) : (
            <Text style={[styles.noReviewText, { color: theme.colors.secondaryText }]}>
              You haven't reviewed this activity yet
            </Text>
          )}
        </View>

        {/* Partner's review section - only show for couple activities */}
        {activity.type === "couple" && activity.partnerId && (
          <>
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.secondaryText }]}>PARTNER'S REVIEW</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            {partnerLoading ? (
              <View style={[styles.section, { backgroundColor: theme.colors.card, alignItems: "center" }]}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.secondaryText, marginTop: 10 }]}>
                  Loading partner's review...
                </Text>
              </View>
            ) : partnerReview ? (
              <>
                <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Partner's Mood</Text>
                  <Text style={[styles.moodText, { color: theme.colors.text }]}>
                    {partnerReview.mood || "Not specified"}
                  </Text>
                </View>

                <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Partner's Rating</Text>
                  {partnerReview.rating ? (
                    renderRatingStars(partnerReview.rating)
                  ) : (
                    <Text style={[styles.noReviewText, { color: theme.colors.secondaryText }]}>No rating provided</Text>
                  )}
                </View>

                <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Partner's Review</Text>
                  {partnerReview.review ? (
                    <Text style={[styles.sectionContent, { color: theme.colors.text }]}>{partnerReview.review}</Text>
                  ) : (
                    <Text style={[styles.noReviewText, { color: theme.colors.secondaryText }]}>No review provided</Text>
                  )}
                </View>
              </>
            ) : (
              <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.noPartnerReview, { color: theme.colors.secondaryText }]}>
                  Your partner hasn't reviewed this activity yet
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  activityHeader: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  emoji: {
    fontSize: 30,
  },
  activityDetails: {
    flex: 1,
    justifyContent: "center",
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 5,
  },
  activityDate: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  activityTime: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  section: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    marginRight: 5,
  },
  moodText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  noReviewText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    fontStyle: "italic",
  },
  noPartnerReview: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    textAlign: "center",
    padding: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
})

export default ActivityReviewScreen
