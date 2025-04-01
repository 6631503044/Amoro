"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { format } from "date-fns"

// Mock data for a specific activity review
const ACTIVITY_REVIEW = {
  id: "1",
  title: "Dinner at Italian Restaurant",
  date: "2023-06-10",
  startTime: "19:00",
  endTime: "21:30",
  type: "couple",
  tag: "date",
  emoji: "🍝",
  rating: 5,
  review:
    "Had an amazing time! The food was delicious and the atmosphere was perfect for our date night. We should definitely come back here again soon.",
  partnerRating: 4,
  partnerReview: "Great food and service. I enjoyed the pasta and wine selection. Would recommend to friends.",
  mood: "Happy",
  partnerMood: "Relaxed",
}

const ActivityReviewScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { theme } = useTheme()

  // In a real app, you would fetch the activity based on the ID from the route
  // const { activityId } = route.params;
  const activity = ACTIVITY_REVIEW

  const renderRatingStars = (rating: number) => {
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
    navigation.navigate("AddReview" as never, { activityId: activity.id } as never)
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
            <Text style={styles.emoji}>{activity.emoji}</Text>
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

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Mood</Text>
          <Text style={[styles.moodText, { color: theme.colors.text }]}>{activity.mood}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Rating</Text>
          {renderRatingStars(activity.rating)}
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Review</Text>
          <Text style={[styles.sectionContent, { color: theme.colors.text }]}>{activity.review}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Partner's Mood</Text>
          <Text style={[styles.moodText, { color: theme.colors.text }]}>{activity.partnerMood}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Partner's Rating</Text>
          {renderRatingStars(activity.partnerRating)}
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Partner's Review</Text>
          <Text style={[styles.sectionContent, { color: theme.colors.text }]}>{activity.partnerReview}</Text>
        </View>
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
})

export default ActivityReviewScreen

