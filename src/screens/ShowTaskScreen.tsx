"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"
import Button from "../components/Button"

// Mock activity data
const MOCK_ACTIVITY = {
  id: "1",
  title: "Morning Jog",
  description: "Morning jog in the park to start the day fresh",
  startTime: "07:00",
  endTime: "08:00",
  date: "2023-06-15",
  type: "personal",
  tag: "exercise",
  emoji: "🏃‍♂️",
  location: "Central Park",
  withPartner: false,
  notification: 15, // minutes before
}

const ShowTaskScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { theme } = useTheme()
  const { t, formatDate } = useLanguage()

  // In a real app, you would fetch the activity based on the ID from the route
  // const { activityId } = route.params;
  const activity = MOCK_ACTIVITY

  const handleEdit = () => {
    navigation.navigate("EditTask" as never, { activityId: activity.id } as never)
  }

  const handleComplete = () => {
    navigation.navigate("AddReview" as never, { activityId: activity.id } as never)
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
            <Text style={styles.emoji}>{activity.emoji}</Text>
          </View>
          <Text style={[styles.activityTitle, { color: theme.colors.text }]}>{activity.title}</Text>
          <Text style={[styles.activityDate, { color: theme.colors.secondaryText }]}>
            {formatDate(new Date(activity.date), "dateFormat")}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionRow}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>{t("time")}</Text>
            <Text style={[styles.sectionContent, { color: theme.colors.text }]}>
              {activity.startTime} - {activity.endTime}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionRow}>
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>{t("location")}</Text>
            <Text style={[styles.sectionContent, { color: theme.colors.text }]}>{activity.location}</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionRow}>
            <Ionicons name="people-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>{t("withPartner")}</Text>
            <Text style={[styles.sectionContent, { color: theme.colors.text }]}>
              {activity.withPartner ? t("yes") : t("no")}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionRow}>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionLabel, { color: theme.colors.secondaryText }]}>{t("notification")}</Text>
            <Text style={[styles.sectionContent, { color: theme.colors.text }]}>
              {activity.notification === 0 ? t("atTimeOfEvent") : `${activity.notification} ${t("minutesBefore")}`}
            </Text>
          </View>
        </View>

        <View style={[styles.descriptionSection, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>{t("description")}</Text>
          <Text style={[styles.descriptionContent, { color: theme.colors.text }]}>{activity.description}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title={t("edit")} onPress={handleEdit} variant="outline" style={{ flex: 1, marginRight: 10 }} />
          <Button title={t("complete")} onPress={handleComplete} style={{ flex: 1 }} />
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
})

export default ShowTaskScreen

