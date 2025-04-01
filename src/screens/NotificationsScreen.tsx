"use client"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"
import { useNavigation } from "@react-navigation/native"

// Mock data for notifications
const NOTIFICATIONS = [
  {
    id: "1",
    title: "Dinner Date",
    message: "Reminder: You have a dinner date in 30 minutes",
    time: "2023-06-15T18:30:00",
    read: false,
    type: "reminder",
    activityId: "1",
  },
  {
    id: "2",
    title: "Partner Request",
    message: "Jane Doe has sent you a partner request",
    time: "2023-06-15T14:20:00",
    read: true,
    type: "request",
  },
  {
    id: "3",
    title: "Movie Night",
    message: "Reminder: Movie night starts in 1 hour",
    time: "2023-06-14T20:30:00",
    read: true,
    type: "reminder",
    activityId: "3",
  },
  {
    id: "4",
    title: "Activity Added",
    message: 'Your partner added "Shopping Trip" to your calendar',
    time: "2023-06-14T10:15:00",
    read: true,
    type: "activity",
    activityId: "5",
  },
  {
    id: "5",
    title: "Review Request",
    message: "How was your Beach Day? Add a review now!",
    time: "2023-06-13T09:00:00",
    read: true,
    type: "review",
    activityId: "3",
  },
]

const NotificationsScreen = () => {
  const { theme } = useTheme()
  const { t, formatDate, getNotificationTitle, getNotificationMessage } = useLanguage()
  const navigation = useNavigation()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return "alarm-outline"
      case "request":
        return "person-add-outline"
      case "activity":
        return "calendar-outline"
      case "review":
        return "star-outline"
      default:
        return "notifications-outline"
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${t("minAgo")}`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} ${t("hoursAgo")}`
    } else {
      return formatDate(date, "shortDateFormat")
    }
  }

  const handleNotificationPress = (notification) => {
    if (notification.activityId) {
      // @ts-ignore - Ignoring type error for navigation
      navigation.navigate("ShowTask", { activityId: notification.activityId })
    }
  }

  const renderNotificationItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          { backgroundColor: theme.colors.card },
          !item.read && { borderLeftColor: theme.colors.primary, borderLeftWidth: 3 },
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
          <Ionicons name={getNotificationIcon(item.type)} size={24} color={theme.colors.primary} />
        </View>

        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>
            {getNotificationTitle(item.type, item.title)}
          </Text>
          <Text style={[styles.notificationMessage, { color: theme.colors.secondaryText }]}>
            {getNotificationMessage(item.type, item.message)}
          </Text>
          <Text style={[styles.notificationTime, { color: theme.colors.secondaryText }]}>{getTimeAgo(item.time)}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("notifications")}</Text>
      </View>

      {NOTIFICATIONS.length > 0 ? (
        <FlatList
          data={NOTIFICATIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={60} color={theme.colors.secondaryText} />
          <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>{t("noNotifications")}</Text>
          <Text style={[styles.emptyStateText, { color: theme.colors.secondaryText }]}>
            {t("noNotificationsMessage")}
          </Text>
        </View>
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
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
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
  },
})

export default NotificationsScreen

