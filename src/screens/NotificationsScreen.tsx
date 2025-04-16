"use client"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState, useCallback } from "react"
import * as Notifications from "expo-notifications"
import { Alert, Platform } from "react-native"
import { useNotifications, getAllScheduledNotifications, testNotification } from "../context/expoNotification"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Mock data for notifications
const NOTIFICATIONS = [
]

const NotificationsScreen = () => {
  const { theme } = useTheme()
  const { t, formatDate, getNotificationTitle, getNotificationMessage } = useLanguage()
  const navigation = useNavigation()
  const { scheduledNotifications, refreshScheduledNotifications } = useNotifications()

  const [receivedNotifications, setReceivedNotifications] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("received") // 'received' or 'upcoming'
  const [upcomingNotifications, setUpcomingNotifications] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  // Load scheduled notifications
  const loadScheduledNotifications = useCallback(async () => {
    try {
      setRefreshing(true)
      const notifications = await getAllScheduledNotifications()

      // Sort notifications by trigger date
      const sortedNotifications = notifications.sort((a, b) => {
        const dateA = new Date(a.trigger.date).getTime()
        const dateB = new Date(b.trigger.date).getTime()
        return dateA - dateB
      })

      setUpcomingNotifications(sortedNotifications)
    } catch (error) {
      console.error("Error loading scheduled notifications:", error)
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadScheduledNotifications()

    // Check for refresh flag
    const checkRefreshFlag = async () => {
      const shouldRefresh = await AsyncStorage.getItem("refreshNotifications")
      if (shouldRefresh === "true") {
        loadScheduledNotifications()
        await AsyncStorage.setItem("refreshNotifications", "false")
      }
    }

    const unsubscribe = navigation.addListener("focus", () => {
      checkRefreshFlag()
      loadScheduledNotifications()
    })

    return unsubscribe
  }, [navigation, loadScheduledNotifications])

  useEffect(() => {
    // Initialize with mock data
    //setReceivedNotifications([...NOTIFICATIONS])

    const createNotification = (notification: Notifications.Notification) => {
      const { title, body, data } = notification.request.content

      // If this is an upcoming notification that was triggered, don't add it to received
      if (data?.isUpcoming) {
        // This notification was scheduled by our app and has now triggered
        // We'll refresh the scheduled notifications list instead
        loadScheduledNotifications()
        return null
      }

      return {
        id: `${Date.now()}`,
        title: title || "New Notification",
        message: body || "",
        time: new Date().toISOString(),
        read: false,
        type: data?.type || null,
        activityId: data?.matchId || data?.taskId || null,
        sender: data?.senderemail,
        receiverEmail: data?.receiveremail,
      }
    }

    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      const newNotification = createNotification(notification)
      if (newNotification) {
        setReceivedNotifications((prev) => [newNotification, ...prev])
      }
      loadScheduledNotifications() // Refresh upcoming notifications
    })

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const newNotification = createNotification(response.notification)
      if (newNotification) {
        setReceivedNotifications((prev) => [newNotification, ...prev])
      }
      loadScheduledNotifications() // Refresh upcoming notifications
    })

    return () => {
      receivedSub.remove()
      responseSub.remove()
    }
  }, [loadScheduledNotifications])

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
      case "task-reminder":
        return "checkmark-circle-outline"
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

  const getTimeUntil = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60))

    if (diffInMinutes < 0) {
      return "Overdue"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days > 1 ? "s" : ""}`
    }
  }

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes.toString().padStart(2, "0")

    return `${formattedHours}:${formattedMinutes} ${ampm}, ${date.toLocaleDateString()}`
  }

  const showMatchPopup = (sender: string, receiverEmail: string) => {
    Alert.alert(
      "Matched!",
      "You've been matched with someone. Do you accept?",
      [
        {
          text: "Reject",
          onPress: async () => {
            try {
              const response = await fetch(`https://amoro-backend-3gsl.onrender.com/notification/respond`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  senderemail: sender,
                  receiveremail: receiverEmail,
                  Isaccept: false,
                }),
              })

              if (!response.ok) throw new Error("Failed to send response")
              Alert.alert("Success", "Match declined")
            } catch (error) {
              console.error("Rejection error:", error)
              Alert.alert("Error", "Failed to send response")
            }
          },
          style: "destructive",
        },
        {
          text: "Accept",
          onPress: async () => {
            try {
              const response = await fetch(`https://amoro-backend-3gsl.onrender.com/notification/respond`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  senderemail: sender,
                  receiveremail: receiverEmail,
                  Isaccept: true,
                }),
              })

              if (!response.ok) throw new Error("Failed to send response")
              Alert.alert("Success", "Match accepted!")
            } catch (error) {
              console.error("Acceptance error:", error)
              Alert.alert("Error", "Failed to send response")
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  const handleNotificationPress = (notification) => {
    console.log(notification.type)
    if (notification.type === "match") {
      showMatchPopup(notification.sender, notification.receiverEmail)
    } else if (notification.activityId) {
      // @ts-ignore - Ignoring type error for navigation
      navigation.navigate("ShowTask", { activityId: notification.activityId })
    }
  }

  const cancelNotification = async (identifier) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier)
      Alert.alert("Success", "Notification cancelled")
      loadScheduledNotifications() // Refresh the list
    } catch (error) {
      console.error("Error cancelling notification:", error)
      Alert.alert("Error", "Failed to cancel notification")
    }
  }

  const handleTestNotification = async () => {
    try {
      await testNotification()
      Alert.alert("Test Notification", "A test notification has been scheduled for 5 seconds from now.")
    } catch (error) {
      console.error("Error testing notification:", error)
      Alert.alert("Error", "Failed to schedule test notification")
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

  const renderUpcomingNotificationItem = ({ item }) => {
    // Use the actual task time from data if available, otherwise use trigger date
    const notificationDate = item.content.data?.scheduledFor
      ? new Date(item.content.data.scheduledFor)
      : new Date(item.trigger.date)

    const timeUntil = getTimeUntil(notificationDate)

    return (
      <View style={[styles.notificationItem, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
          <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
        </View>

        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>{item.content.title}</Text>
          <Text style={[styles.notificationMessage, { color: theme.colors.secondaryText }]}>{item.content.body}</Text>
          <Text style={[styles.notificationTime, { color: theme.colors.secondaryText }]}>
            {formatScheduledTime(notificationDate)}
          </Text>
          <View style={styles.timeUntilContainer}>
            <Text style={[styles.timeUntilText, { color: theme.colors.primary }]}>{timeUntil} remaining</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={() => cancelNotification(item.identifier)}>
          <Ionicons name="close-circle" size={22} color={theme.colors.error || "red"} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <Ionicons
          name={activeTab === "received" ? "notifications-off-outline" : "calendar-outline"}
          size={60}
          color={theme.colors.secondaryText}
        />
        <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
          {activeTab === "received" ? t("noNotifications") : "No Upcoming Notifications"}
        </Text>
        <Text style={[styles.emptyStateText, { color: theme.colors.secondaryText }]}>
          {activeTab === "received"
            ? t("noNotificationsMessage")
            : "You don't have any scheduled notifications. Create a task to set up notifications."}
        </Text>

        {Platform.OS === "android" && (
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleTestNotification}
          >
            <Text style={styles.testButtonText}>Test Notifications</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("notifications")}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "received" && [styles.activeTab, { borderBottomColor: theme.colors.primary }],
          ]}
          onPress={() => setActiveTab("received")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.colors.secondaryText },
              activeTab === "received" && { color: theme.colors.primary, fontFamily: "Poppins-SemiBold" },
            ]}
          >
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "upcoming" && [styles.activeTab, { borderBottomColor: theme.colors.primary }],
          ]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.colors.secondaryText },
              activeTab === "upcoming" && { color: theme.colors.primary, fontFamily: "Poppins-SemiBold" },
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "received" ? (
        receivedNotifications.length > 0 ? (
          <FlatList
            data={receivedNotifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotificationItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadScheduledNotifications} />}
          />
        ) : (
          renderEmptyState()
        )
      ) : upcomingNotifications.length > 0 ? (
        <FlatList
          data={upcomingNotifications}
          keyExtractor={(item) => item.identifier}
          renderItem={renderUpcomingNotificationItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadScheduledNotifications} />}
        />
      ) : (
        renderEmptyState()
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
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
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
  timeUntilContainer: {
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  timeUntilText: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  cancelButton: {
    padding: 5,
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
    marginBottom: 20,
  },
  testButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
  },
  testButtonText: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
})

export default NotificationsScreen
