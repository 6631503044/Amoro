"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

const PermissionsScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [contactsEnabled, setContactsEnabled] = useState(false)
  const [calendarEnabled, setCalendarEnabled] = useState(true)

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
          Manage app permissions to enhance your experience
        </Text>

        <View style={[styles.permissionsCard, { backgroundColor: theme.colors.card }]}>
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
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: `${theme.colors.primary}80` }}
              thumbColor={notificationsEnabled ? theme.colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={styles.divider} />

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
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: "#767577", true: `${theme.colors.primary}80` }}
              thumbColor={locationEnabled ? theme.colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={styles.divider} />

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
            <Switch
              value={cameraEnabled}
              onValueChange={setCameraEnabled}
              trackColor={{ false: "#767577", true: `${theme.colors.primary}80` }}
              thumbColor={cameraEnabled ? theme.colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={styles.divider} />

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
            <Switch
              value={contactsEnabled}
              onValueChange={setContactsEnabled}
              trackColor={{ false: "#767577", true: `${theme.colors.primary}80` }}
              thumbColor={contactsEnabled ? theme.colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={styles.divider} />

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
            <Switch
              value={calendarEnabled}
              onValueChange={setCalendarEnabled}
              trackColor={{ false: "#767577", true: `${theme.colors.primary}80` }}
              thumbColor={calendarEnabled ? theme.colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <Text style={[styles.privacyNote, { color: theme.colors.secondaryText }]}>
          You can change these permissions at any time in your device settings
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
    textAlign: "center",
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
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginHorizontal: 15,
  },
  privacyNote: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 10,
  },
})

export default PermissionsScreen

