"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import Input from "../components/Input"
import Button from "../components/Button"

const AccountSettingsScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { user, updateProfile } = useAuth()

  const [name, setName] = useState(user?.displayName || "")
  const [username, setUsername] = useState(user?.username || "@johndoe")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "+1 234 567 8900")
  const [birthday, setBirthday] = useState(user?.birthday || "1990-01-01")
  const [hobbies, setHobbies] = useState(user?.hobbies || "Reading, Hiking, Photography")
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(user?.photoURL || "/placeholder.svg?height=150&width=150")
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState(false)

  // Request permissions on component mount
  useEffect(() => {
    ;(async () => {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraPermission.status === "granted")

      // Request media library permissions
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermission(galleryPermission.status === "granted")
    })()
  }, [])

  // Mock images for demo
  const mockImages = [
    "/placeholder.svg?height=150&width=150&text=Photo1",
    "/placeholder.svg?height=150&width=150&text=Photo2",
    "/placeholder.svg?height=150&width=150&text=Photo3",
    "/placeholder.svg?height=150&width=150&text=Photo4",
    "/placeholder.svg?height=150&width=150&text=Photo5",
    "/placeholder.svg?height=150&width=150&text=Photo6",
  ]

  const handleSave = async () => {
    setLoading(true)
    try {
      // In a real app, you would update the user profile in your backend
      // Here we're just simulating the API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the user profile in the context
      if (updateProfile) {
        await updateProfile({
          displayName: name,
          username,
          phone,
          birthday,
          hobbies,
          photoURL: profileImage,
        })
      }

      Alert.alert("Success", "Profile updated successfully")
      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChangeProfilePicture = () => {
    setShowImagePicker(true)
  }

  const selectImage = (imageUri: string) => {
    setProfileImage(imageUri)
    setShowImagePicker(false)
  }

  const takePhoto = async () => {
    if (!hasCameraPermission) {
      Alert.alert("Permission Required", "Camera permission is required to take photos.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Settings",
          onPress: () => {
            // In a real app, this would open app settings
            // For Expo, you can use Linking.openSettings()
            Alert.alert("Open Settings", "This would open settings in a real app")
          },
        },
      ])
      return
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri)
        setShowImagePicker(false)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo")
    }
  }

  const pickImage = async () => {
    if (!hasGalleryPermission) {
      Alert.alert("Permission Required", "Photo library permission is required to select photos.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Settings",
          onPress: () => {
            // In a real app, this would open app settings
            // For Expo, you can use Linking.openSettings()
            Alert.alert("Open Settings", "This would open settings in a real app")
          },
        },
      ])
      return
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri)
        setShowImagePicker(false)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select photo")
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Account Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profilePictureSection}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <TouchableOpacity
            style={[styles.changePhotoButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleChangeProfilePicture}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.secondaryText} />}
          />

          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            leftIcon={<Ionicons name="at-outline" size={20} color={theme.colors.secondaryText} />}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.secondaryText} />}
            editable={false}
            style={{ opacity: 0.7 }}
          />

          <Input
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={20} color={theme.colors.secondaryText} />}
          />

          <Input
            label="Birthday"
            value={birthday}
            onChangeText={setBirthday}
            placeholder="YYYY-MM-DD"
            leftIcon={<Ionicons name="calendar-outline" size={20} color={theme.colors.secondaryText} />}
          />

          <Input
            label="Hobbies"
            value={hobbies}
            onChangeText={setHobbies}
            placeholder="Enter your hobbies"
            leftIcon={<Ionicons name="heart-outline" size={20} color={theme.colors.secondaryText} />}
            multiline
            numberOfLines={3}
          />

          <Button
            title={loading ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            disabled={loading}
            style={{ marginTop: 20 }}
          />
        </View>
      </ScrollView>

      {/* Enhanced Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Update Profile Picture</Text>
              <TouchableOpacity
                onPress={() => setShowImagePicker(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.photoOptionsContainer}>
              <TouchableOpacity
                style={[styles.photoOption, { backgroundColor: theme.colors.primary }]}
                onPress={takePhoto}
              >
                <View style={styles.photoOptionIconContainer}>
                  <Ionicons name="camera" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.photoOptionText}>Take Photo</Text>
                <Text style={styles.photoOptionSubtext}>Use your camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.photoOption, { backgroundColor: theme.colors.secondary || "#4CAF50" }]}
                onPress={pickImage}
              >
                <View style={styles.photoOptionIconContainer}>
                  <Ionicons name="images" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.photoOptionText}>Choose Photo</Text>
                <Text style={styles.photoOptionSubtext}>From your library</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.secondaryText }]}>Recent Photos</Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </View>

            <ScrollView contentContainerStyle={styles.imageGrid}>
              {mockImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageItem}
                  onPress={() => selectImage(image)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: image }} style={styles.galleryImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  formSection: {
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  photoOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  photoOption: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  photoOptionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  photoOptionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },
  photoOptionSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  imageItem: {
    width: "31%",
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  galleryImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
})

export default AccountSettingsScreen

