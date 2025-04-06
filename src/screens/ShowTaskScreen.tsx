"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"
import Button from "../components/Button"
import AsyncStorage from "@react-native-async-storage/async-storage"

const ShowTaskScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { theme } = useTheme()
  const { t, formatDate } = useLanguage()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  // Get the activity data from the route params
  const { activityId, activityData } = route.params || {}

  // If we don't have the activity data, show a loading state or error
  if (!activityData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t("activityDetails")}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: theme.colors.secondaryText }]}>
            Activity data not found. Please try again.
          </Text>
        </View>
      </View>
    )
  }

  const handleEdit = () => {
    navigation.navigate(
      "EditTask" as never,
      {
        activityId: activityId,
        activityData: activityData,
      } as never,
    )
  }

  const handleComplete = async () => {
    if (!user || !user.id) {
      Alert.alert("Error", "User not authenticated")
      return
    }

    try {
      setLoading(true)

      // Extract date components for the API path
      const [year, month, day] = activityData.date.split("-")

      // Create updated task data with Complete set to true
      const updatedTaskData = {
        ...activityData.originalData,
        Complete: true,
      }

      // Send PUT request to update the task
      const API_URL = "https://amoro-backend-3gsl.onrender.com"
      const response = await fetch(`${API_URL}/tasks/${user.id}/${year}/${month}/${day}/${activityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskData),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      // Set flag to refresh home screen data
      await AsyncStorage.setItem("refreshHomeData", "true")

      // Navigate to AddReview screen after marking as complete
      navigation.navigate("AddReview" as never, { activityId: activityId, activityData: activityData } as never)
    } catch (error) {
      console.error("Error completing task:", error)
      Alert.alert("Error", "Failed to mark task as complete. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("activityDetails")}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.activityHeader, { backgroundColor: theme.colors.card }]}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{activityData.emoji}</Text>
          </View>
          <Text style={[styles.activityTitle, { color: theme.colors.text }]}>{activityData.title}</Text>
          <Text style={[styles.activityDate, { color: theme.colors.secondaryText }]}>
            {formatDate(new Date(activityData.date), "dateFormat")}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionRow}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>{t("time")}</Text>
            <Text style={[styles.sectionContent, { color: theme.colors.text }]}>
              {activityData.startTime} - {activityData.endTime}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionRow}>
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>{t("location")}</Text>
            <Text style={[styles.sectionContent, { color: theme.colors.text }]}>
              {activityData.location || "Not specified"}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionRow}>
            <Ionicons name="people-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>{t("withPartner")}</Text>
            <Text style={[styles.sectionContent, { color: theme.colors.text }]}>
              {activityData.type === "couple" ? t("yes") : t("no")}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionRow}>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>{t("notification")}</Text>
            <Text style={[styles.sectionContent, { color: theme.colors.text }]}>
              {activityData.notification || "At time of event"}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionRow}>
            <Ionicons name="pricetag-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>Tag</Text>
            <Text style={[styles.sectionContent, { color: theme.colors.text }]}>{activityData.tag || "None"}</Text>
          </View>
        </View>

        <View style={[styles.descriptionSection, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>{t("description")}</Text>
          <Text style={[styles.descriptionContent, { color: theme.colors.text }]}>
            {activityData.description || "No description provided."}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title={t("edit")} onPress={handleEdit} variant="outline" style={{ flex: 1, marginRight: 10 }} />
          <Button
            title={loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : t("complete")}
            onPress={handleComplete}
            style={{ flex: 1 }}
            disabled={loading || activityData.complete}
          />
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
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
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
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 5,
    textAlign: "center",
  },
  activityDate: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  section: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
    width: 100,
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    flex: 1,
    textAlign: "right",
  },
  descriptionSection: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  descriptionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  descriptionContent: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loadingContainer: {
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

export default ShowTaskScreen

