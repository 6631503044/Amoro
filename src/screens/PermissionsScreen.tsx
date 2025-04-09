"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
  Switch,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import * as Notifications from "expo-notifications"
import * as Location from "expo-location"
import * as ImagePicker from "expo-image-picker"
import * as Contacts from "expo-contacts"
import * as Calendar from "expo-calendar"

// Permission types
type PermissionType = "notifications" | "location" | "camera" | "contacts" | "calendar"
type PermissionStatus = "granted" | "denied" | "undetermined" | "loading"

const PermissionsScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()

  // Permission states
  const [notificationStatus, setNotificationStatus] = useState<PermissionStatus>("loading")
  const [locationStatus, setLocationStatus] = useState<PermissionStatus>("loading")
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>("loading")
  const [contactsStatus, setContactsStatus] = useState<PermissionStatus>("loading")
  const [calendarStatus, setCalendarStatus] = useState<PermissionStatus>("loading")

  // Check all permissions on component mount
  useEffect(() => {
    checkPermissions()
  }, [])

  // Function to check all permissions
  const checkPermissions = async () => {
    checkNotificationPermission()
    checkLocationPermission()
    checkCameraPermission()
    checkContactsPermission()
    checkCalendarPermission()
  }

  // Check notification permission
  const checkNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync()
      setNotificationStatus(status as PermissionStatus)
    } catch (error) {
      console.error("Error checking notification permission:", error)
      setNotificationStatus("undetermined")
    }
  }

  // Check location permission
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync()
      setLocationStatus(status as PermissionStatus)
    } catch (error) {
      console.error("Error checking location permission:", error)
      setLocationStatus("undetermined")
    }
  }

  // Check camera permission
  const checkCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.getCameraPermissionsAsync()
      setCameraStatus(status as PermissionStatus)
    } catch (error) {
      console.error("Error checking camera permission:", error)
      setCameraStatus("undetermined")
    }
  }

  // Check contacts permission
  const checkContactsPermission = async () => {
    try {
      const { status } = await Contacts.getPermissionsAsync()
      setContactsStatus(status as PermissionStatus)
    } catch (error) {
      console.error("Error checking contacts permission:", error)
      setContactsStatus("undetermined")
    }
  }

  // Check calendar permission
  const checkCalendarPermission = async () => {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync()
      setCalendarStatus(status as PermissionStatus)
    } catch (error) {
      console.error("Error checking calendar permission:", error)
      setCalendarStatus("undetermined")
    }
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      setNotificationStatus("loading")
      const { status } = await Notifications.requestPermissionsAsync()
      setNotificationStatus(status as PermissionStatus)

      if (status === "denied") {
        showPermissionDeniedAlert("notification")
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      setNotificationStatus("undetermined")
    }
  }

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      setLocationStatus("loading")
      const { status } = await Location.requestForegroundPermissionsAsync()
      setLocationStatus(status as PermissionStatus)

      if (status === "denied") {
        showPermissionDeniedAlert("location")
      }
    } catch (error) {
      console.error("Error requesting location permission:", error)
      setLocationStatus("undetermined")
    }
  }

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      setCameraStatus("loading")
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      setCameraStatus(status as PermissionStatus)

      if (status === "denied") {
        showPermissionDeniedAlert("camera")
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error)
      setCameraStatus("undetermined")
    }
  }

  // Request contacts permission
  const requestContactsPermission = async () => {
    try {
      setContactsStatus("loading")
      const { status } = await Contacts.requestPermissionsAsync()
      setContactsStatus(status as PermissionStatus)

      if (status === "denied") {
        showPermissionDeniedAlert("contacts")
      }
    } catch (error) {
      console.error("Error requesting contacts permission:", error)
      setContactsStatus("undetermined")
    }
  }

  // Request calendar permission
  const requestCalendarPermission = async () => {
    try {
      setCalendarStatus("loading")
      const { status } = await Calendar.requestCalendarPermissionsAsync()
      setCalendarStatus(status as PermissionStatus)

      if (status === "denied") {
        showPermissionDeniedAlert("calendar")
      }
    } catch (error) {
      console.error("Error requesting calendar permission:", error)
      setCalendarStatus("undetermined")
    }
  }

  // Show alert when permission is denied
  const showPermissionDeniedAlert = (permissionType: PermissionType) => {
    const permissionNames = {
      notifications: "Notifications",
      location: "Location",
      camera: "Camera",
      contacts: "Contacts",
      calendar: "Calendar",
    }

    Alert.alert(
      `${permissionNames[permissionType]} Permission Required`,
      `To use this feature, please enable ${permissionNames[permissionType]} permission in your device settings.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openSettings },
      ],
    )
  }

  // Open device settings
  const openSettings = () => {
    Linking.openSettings()
  }

  // Get permission status text and color
  const getPermissionStatusInfo = (status: PermissionStatus) => {
    switch (status) {
      case "granted":
        return { text: "Granted", color: "#4CAF50" }
      case "denied":
        return { text: "Denied", color: "#F44336" }
      case "undetermined":
        return { text: "Not Requested", color: theme.colors.secondaryText }
      case "loading":
        return { text: "Checking...", color: theme.colors.primary }
      default:
        return { text: "Unknown", color: theme.colors.secondaryText }
    }
  }

  // Render permission button based on status
  const renderPermissionSwitch = (
    status: PermissionStatus,
    togglePermission: () => Promise<void>,
    permissionType: PermissionType,
  ) => {
    if (status === "loading") {
      return <ActivityIndicator size="small" color={theme.colors.primary} />
    }

    return (
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: "#767577", true: `${theme.colors.primary}80` }}
          thumbColor={status === "granted" ? theme.colors.primary : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => togglePermission()}
          value={status === "granted"}
        />
        <Text style={[styles.switchText, { color: status === "granted" ? "#4CAF50" : theme.colors.secondaryText }]}>
          {status === "granted" ? "On" : "Off"}
        </Text>
      </View>
    )
  }

  // Update the toggle permission functions to handle both enabling and disabling
  const toggleNotificationPermission = async () => {
    if (notificationStatus === "granted") {
      // Can't programmatically revoke permissions, so show settings
      Alert.alert("Disable Notifications", "To disable notifications, you need to go to your device settings.", [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openSettings },
      ])
    } else {
      // Request permission
      try {
        setNotificationStatus("loading")
        const { status } = await Notifications.requestPermissionsAsync()
        setNotificationStatus(status as PermissionStatus)

        if (status === "denied") {
          showPermissionDeniedAlert("notifications")
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error)
        setNotificationStatus("undetermined")
      }
    }
  }

  const toggleLocationPermission = async () => {
    if (locationStatus === "granted") {
      // Can't programmatically revoke permissions, so show settings
      Alert.alert("Disable Location Access", "To disable location access, you need to go to your device settings.", [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openSettings },
      ])
    } else {
      // Request permission
      try {
        setLocationStatus("loading")
        const { status } = await Location.requestForegroundPermissionsAsync()
        setLocationStatus(status as PermissionStatus)

        if (status === "denied") {
          showPermissionDeniedAlert("location")
        }
      } catch (error) {
        console.error("Error requesting location permission:", error)
        setLocationStatus("undetermined")
      }
    }
  }

  const toggleCameraPermission = async () => {
    if (cameraStatus === "granted") {
      // Can't programmatically revoke permissions, so show settings
      Alert.alert("Disable Camera Access", "To disable camera access, you need to go to your device settings.", [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openSettings },
      ])
    } else {
      // Request permission
      try {
        setCameraStatus("loading")
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        setCameraStatus(status as PermissionStatus)

        if (status === "denied") {
          showPermissionDeniedAlert("camera")
        }
      } catch (error) {
        console.error("Error requesting camera permission:", error)
        setCameraStatus("undetermined")
      }
    }
  }

  const toggleContactsPermission = async () => {
    if (contactsStatus === "granted") {
      // Can't programmatically revoke permissions, so show settings
      Alert.alert("Disable Contacts Access", "To disable contacts access, you need to go to your device settings.", [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openSettings },
      ])
    } else {
      // Request permission
      try {
        setContactsStatus("loading")
        const { status } = await Contacts.requestPermissionsAsync()
        setContactsStatus(status as PermissionStatus)

        if (status === "denied") {
          showPermissionDeniedAlert("contacts")
        }
      } catch (error) {
        console.error("Error requesting contacts permission:", error)
        setContactsStatus("undetermined")
      }
    }
  }

  const toggleCalendarPermission = async () => {
    if (calendarStatus === "granted") {
      // Can't programmatically revoke permissions, so show settings
      Alert.alert("Disable Calendar Access", "To disable calendar access, you need to go to your device settings.", [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openSettings },
      ])
    } else {
      // Request permission
      try {
        setCalendarStatus("loading")
        const { status } = await Calendar.requestCalendarPermissionsAsync()
        setCalendarStatus(status as PermissionStatus)

        if (status === "denied") {
          showPermissionDeniedAlert("calendar")
        }
      } catch (error) {
        console.error("Error requesting calendar permission:", error)
        setCalendarStatus("undetermined")
      }
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Permissions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
          Amoro needs certain permissions to provide you with the best experience. You can grant or deny these
          permissions at any time.
        </Text>

        <View style={[styles.permissionsCard, { backgroundColor: theme.colors.card }]}>
          {/* Notifications Permission */}
          <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.permissionTextContainer}>
                <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>Notifications</Text>
                <Text style={[styles.permissionDescription, { color: theme.colors.secondaryText }]}>
                  Receive alerts about activities and updates
                </Text>
              </View>
            </View>
            {renderPermissionSwitch(notificationStatus, toggleNotificationPermission, "notifications")}
          </View>

          <View style={styles.divider} />

          {/* Location Permission */}
          <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.permissionTextContainer}>
                <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>Location</Text>
                <Text style={[styles.permissionDescription, { color: theme.colors.secondaryText }]}>
                  Access your location for activity suggestions
                </Text>
              </View>
            </View>
            {renderPermissionSwitch(locationStatus, toggleLocationPermission, "location")}
          </View>

          <View style={styles.divider} />

          {/* Camera Permission */}
          <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="camera-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.permissionTextContainer}>
                <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>Camera</Text>
                <Text style={[styles.permissionDescription, { color: theme.colors.secondaryText }]}>
                  Take photos for your profile and activities
                </Text>
              </View>
            </View>
            {renderPermissionSwitch(cameraStatus, toggleCameraPermission, "camera")}
          </View>

          <View style={styles.divider} />

          {/* Contacts Permission */}
          <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.permissionTextContainer}>
                <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>Contacts</Text>
                <Text style={[styles.permissionDescription, { color: theme.colors.secondaryText }]}>
                  Find friends and partners from your contacts
                </Text>
              </View>
            </View>
            {renderPermissionSwitch(contactsStatus, toggleContactsPermission, "contacts")}
          </View>

          <View style={styles.divider} />

          {/* Calendar Permission */}
          <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.permissionTextContainer}>
                <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>Calendar</Text>
                <Text style={[styles.permissionDescription, { color: theme.colors.secondaryText }]}>
                  Sync activities with your calendar
                </Text>
              </View>
            </View>
            {renderPermissionSwitch(calendarStatus, toggleCalendarPermission, "calendar")}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.refreshButton, { backgroundColor: theme.colors.card }]}
          onPress={checkPermissions}
        >
          <Ionicons name="refresh" size={20} color={theme.colors.primary} />
          <Text style={[styles.refreshButtonText, { color: theme.colors.primary }]}>Refresh Permissions</Text>
        </TouchableOpacity>

        <Text style={[styles.privacyNote, { color: theme.colors.secondaryText }]}>
          You can change these permissions at any time in your device settings. Denying permissions may limit some app
          features.
        </Text>
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
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 20,
    lineHeight: 20,
  },
  permissionsCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  permissionInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginHorizontal: 15,
  },
  requestButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  requestButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  permissionGranted: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 100,
    justifyContent: "center",
  },
  permissionGrantedText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    marginLeft: 4,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  refreshButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
  },
  privacyNote: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 100,
    justifyContent: "flex-end",
  },
  switchText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
  },
})

export default PermissionsScreen
