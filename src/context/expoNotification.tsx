"use client"

import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"
import { useState, useEffect, useRef } from "react"
import Constants from "expo-constants"

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// Create notification channels for Android
export async function setupNotificationChannels() {
  if (Platform.OS === "android") {
    // Main notification channel
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })

    // Task reminder channel
    await Notifications.setNotificationChannelAsync("task-reminders", {
      name: "Task Reminders",
      description: "Notifications for upcoming tasks and activities",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      enableLights: true,
      lightColor: "#FF231F7C",
      enableVibrate: true,
      showBadge: true,
    })
  }
}

export async function registerForPushNotificationsAsync() {
  let token

  // Set up notification channels for Android
  await setupNotificationChannels()

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!")
      return null
    }

    try {
      // Get project ID from app.json or app.config.js
      const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.manifest?.extra?.eas?.projectId

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        })
      ).data
      console.log("Expo Push Token:", token)
    } catch (error) {
      console.error("Error getting push token:", error)
    }
  } else {
    console.log("Must use physical device for Push Notifications")
  }

  return token
}

// Schedule a local notification
export async function scheduleTaskNotification(task, notificationTime) {
  try {
    // Cancel any existing notifications for this task if it's being edited
    if (task.id) {
      await cancelTaskNotification(task.id)
    }

    // Parse the task date and time
    const taskDate = new Date(task.date)
    const [hours, minutes] = task.startTime.split(":").map(Number)

    taskDate.setHours(hours, minutes, 0, 0)

    // Calculate notification time based on the selected option
    const notificationDate = new Date(taskDate)

    // Subtract minutes based on notification preference
    if (notificationTime > 0) {
      notificationDate.setMinutes(notificationDate.getMinutes() - notificationTime)
    }

    // Only schedule if the notification time is in the future
    if (notificationDate > new Date()) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: task.title,
          body: task.description || "You have an upcoming task",
          data: {
            taskId: task.id || `new-${Date.now()}`,
            type: "task-reminder",
            isUpcoming: true, // Flag to identify this as an upcoming notification
            scheduledFor: taskDate.toISOString(), // Store the actual task time
          },
          // Android specific
          channelId: "task-reminders",
          color: "#FF231F7C",
          priority: "high",
        },
        trigger: {
          date: notificationDate,
          channelId: "task-reminders",
        },
      })

      console.log(`Notification scheduled with ID: ${identifier} for ${notificationDate.toString()}`)
      return identifier
    } else {
      console.log("Notification time is in the past, not scheduling")
      return null
    }
  } catch (error) {
    console.error("Error scheduling notification:", error)
    return null
  }
}

// Cancel a specific notification
export async function cancelTaskNotification(taskId) {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()

    for (const notification of scheduledNotifications) {
      if (notification.content.data?.taskId === taskId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier)
        console.log(`Cancelled notification for task ID: ${taskId}`)
      }
    }
  } catch (error) {
    console.error("Error cancelling notification:", error)
  }
}

// Get all scheduled notifications
export async function getAllScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync()
  } catch (error) {
    console.error("Error getting scheduled notifications:", error)
    return []
  }
}

// Hook to use notifications in components
export function useNotifications() {
  const [notification, setNotification] = useState(null)
  const [scheduledNotifications, setScheduledNotifications] = useState([])
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    // Register for push notifications and set up channels
    const setup = async () => {
      await setupNotificationChannels()
      await registerForPushNotificationsAsync()
    }
    setup()

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })

    // Listen for user interaction with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response)
    })

    // Load scheduled notifications
    loadScheduledNotifications()

    // Cleanup
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  // Function to refresh the list of scheduled notifications
  const loadScheduledNotifications = async () => {
    const notifications = await getAllScheduledNotifications()
    setScheduledNotifications(notifications)
  }

  return {
    notification,
    scheduledNotifications,
    refreshScheduledNotifications: loadScheduledNotifications,
  }
}

// Test if notifications are working properly
export async function testNotification() {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test notification to verify the system is working",
        data: { type: "test" },
        channelId: Platform.OS === "android" ? "default" : undefined,
      },
      trigger: { seconds: 5 },
    })
    console.log(`Test notification scheduled with ID: ${identifier}`)
    return identifier
  } catch (error) {
    console.error("Error scheduling test notification:", error)
    return null
  }
}
