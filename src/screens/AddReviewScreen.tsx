"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuth } from "../context/AuthContext"

// Mood options
const MOODS = [
  { id: "1", name: "Happy", emoji: "😊" },
  { id: "2", name: "Relaxed", emoji: "😌" },
  { id: "3", name: "Excited", emoji: "🤩" },
  { id: "4", name: "Romantic", emoji: "❤️" },
  { id: "5", name: "Tired", emoji: "😴" },
  { id: "6", name: "Bored", emoji: "😒" },
]

const AddReviewScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { theme } = useTheme()
  const { t, formatDate } = useLanguage()
  const { user } = useAuth()

  // Get the activity data from the route params
  const { activityId, activityData } = route.params || {}

  // Log the received data for debugging
  console.log("AddReview received:", { activityId, activityData })
  console.log("Route params:", route.params)

  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Handle saving the review
  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert("Missing Information", "Please select your mood")
      return
    }

    if (rating === 0) {
      Alert.alert("Missing Information", "Please rate your experience")
      return
    }

    if (!user || !user.id) {
      Alert.alert("Error", "User not authenticated")
      return
    }

    try {
      setLoading(true)

      // Get the selected mood name
      const selectedMoodObj = MOODS.find((mood) => mood.id === selectedMood)
      const moodName = selectedMoodObj ? selectedMoodObj.name : ""

      // Create the updated task data
      const updatedTaskData = {
        date: activityData.date,
        olddate: activityData.date, // Adding olddate field with the original date
        title: activityData.title,
        description: activityData.description || "",
        withPartner:
          activityData.withPartner ||
          (activityData.type === "couple" ? user?.partnerId || "partner-placeholder-id" : null),
        startTime: activityData.startTime,
        endTime: activityData.endTime,
        location: activityData.location || "",
        Mood: {
          Description: moodName,
          Score: rating.toString(),
          Review: review,
        },
        Tag: {
          name: typeof activityData.tag === "string" ? activityData.tag : "",
        },
        Notification: activityData.notification || "",
        Complete: true,
      }

      console.log("Sending review data:", updatedTaskData)

      // Send PUT request to update the task
      const API_URL = "https://amoro-backend-3gsl.onrender.com"
      const response = await fetch(`${API_URL}/tasks/${user.id}/${activityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskData),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      // Set flags to refresh data on other screens
      await AsyncStorage.setItem("refreshHomeData", "true")
      await AsyncStorage.setItem("refreshMoodsData", "true")

      Alert.alert("Success", "Your review has been saved successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Error saving review:", error)
      Alert.alert("Error", "Failed to save review. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderRatingSelector = () => {
    return (
      <View style={styles.ratingSelector}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "heart" : "heart-outline"}
              size={40}
              color={theme.colors.primary}
              style={styles.ratingStar}
            />
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  // Add error handling if activityData is missing
  // If we don't have activity data, show an error
  if (!activityData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t("addReview")}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.secondaryText }]}>
            Activity data not found. Please try again.
          </Text>
          <Text style={[styles.errorText, { color: theme.colors.secondaryText, marginTop: 10 }]}>
            Debug info: ID: {JSON.stringify(activityId)}, Data received: {JSON.stringify(route.params)}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("addReview")}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.activityCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{activityData.emoji}</Text>
          </View>
          <Text style={[styles.activityTitle, { color: theme.colors.text }]}>{activityData.title}</Text>

          {/* Date and time information */}
          <Text style={[styles.activityDateTime, { color: theme.colors.secondaryText }]}>
            {formatDate(new Date(activityData.date), "dateFormat")} • {activityData.startTime}
          </Text>

          {/* Location information */}
          {activityData.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color={theme.colors.secondaryText} />
              <Text style={[styles.locationText, { color: theme.colors.secondaryText }]}>{activityData.location}</Text>
            </View>
          )}

          {/* Partner information for couple activities */}
          {activityData.type === "couple" && (
            <View style={[styles.partnerBadge, { backgroundColor: `${theme.colors.primary}15` }]}>
              <Ionicons name="people-outline" size={14} color={theme.colors.primary} />
              <Text style={[styles.partnerText, { color: theme.colors.primary }]}>{t("with")} Partner</Text>
            </View>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t("howWasYourMood")}</Text>

        <View style={styles.moodSelector}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodItem,
                { borderColor: theme.colors.border },
                selectedMood === mood.id && {
                  backgroundColor: `${theme.colors.primary}20`,
                  borderColor: theme.colors.primary,
                },
              ]}
              onPress={() => setSelectedMood(mood.id === selectedMood ? null : mood.id)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodName,
                  { color: theme.colors.text },
                  selectedMood === mood.id && { color: theme.colors.primary },
                ]}
              >
                {t(`mood_${mood.name.toLowerCase()}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t("howWasYourExperience")}</Text>

        {renderRatingSelector()}

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t("addNoteOptional")}</Text>

        <TextInput
          style={[
            styles.reviewInput,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          value={review}
          onChangeText={setReview}
          placeholder={t("shareYourThoughts")}
          placeholderTextColor={theme.colors.secondaryText}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.saveButtonLarge, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>{t("saveReview")}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  activityCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  emojiContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  emoji: {
    fontSize: 36,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginBottom: 8,
  },
  activityDateTime: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginLeft: 4,
  },
  partnerBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  partnerText: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
  },
  moodSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  moodItem: {
    width: "30%",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  moodName: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  ratingSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  ratingStar: {
    marginHorizontal: 8,
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 30,
    minHeight: 150,
  },
  saveButtonLarge: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
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

export default AddReviewScreen
