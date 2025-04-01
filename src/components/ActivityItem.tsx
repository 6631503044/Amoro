"use client"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"

type ActivityItemProps = {
  activity: {
    id: string
    title: string
    startTime: string
    endTime: string
    date: string
    type: "personal" | "couple"
    tag: string
    emoji: string
  }
  onPress: () => void
}

const ActivityItem = ({ activity, onPress }: ActivityItemProps) => {
  const { theme } = useTheme()
  const { t } = useLanguage()

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderLeftColor: activity.type === "personal" ? theme.colors.personalActivity : theme.colors.coupleActivity,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{activity.emoji}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{activity.title}</Text>
        <Text style={[styles.time, { color: theme.colors.secondaryText }]}>
          {activity.startTime} - {activity.endTime}
        </Text>
      </View>
      <View style={styles.typeContainer}>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor:
                activity.type === "personal"
                  ? `${theme.colors.personalActivity}20`
                  : `${theme.colors.coupleActivity}20`,
            },
          ]}
        >
          <Text
            style={[
              styles.typeText,
              {
                color: activity.type === "personal" ? theme.colors.personalActivity : theme.colors.coupleActivity,
              },
            ]}
          >
            {activity.type === "personal" ? t("single") : t("partner")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  emoji: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  typeContainer: {
    marginLeft: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
})

export default ActivityItem

