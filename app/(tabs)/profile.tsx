import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never); // Type assertion for navigation.
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{ uri: "" }} />
        </View>
        <Text style={styles.username}>AndrewDice1929</Text>
        <Text style={styles.fullName}>Andrew Dicesare</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Partner</Text>
        <TouchableOpacity onPress={() => navigateTo("PartnerDetails")}>
          <View style={styles.partnerContainer}>
            <View style={styles.partnerAvatarPlaceholder}>
              <Image
                style={styles.partnerAvatar}
                source={{ uri: "" }} // Replace with dynamic partner image URL if available.
              />
            </View>
            <Text style={styles.partnerText}>SeaTheDestroyer99</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity onPress={() => navigateTo("EditProfile")}>
          <View style={styles.option}>
            <Text style={styles.optionText}>Edit Profile</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("ChangePassword")}>
          <View style={styles.option}>
            <Text style={styles.optionText}>Change Password</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity onPress={() => navigateTo("Themes")}>
          <View style={styles.option}>
            <Text style={styles.optionText}>Themes</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("Notifications")}>
          <View style={styles.option}>
            <Text style={styles.optionText}>Notification</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("Language")}>
          <View style={styles.option}>
            <Text style={styles.optionText}>Language</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <TouchableOpacity onPress={() => navigateTo("PrivacySettings")}>
          <View style={styles.option}>
            <Text style={styles.optionText}>Privacy Settings</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("Permission")}>
          <View style={styles.option}>
            <Text style={styles.optionText}>Permission</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  fullName: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  partnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  partnerAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  partnerAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  partnerText: {
    fontSize: 16,
    flex: 1,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingLeft:25,
  },
  optionText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    color: "#999",
  },
});

export default ProfileScreen;
