import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Switch, TouchableOpacity } from "react-native";

const demoicon = require('../../assets/img/demoicon.png'); // อ้างอิงไฟล์รูปภาพ

const ProfileScreen: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isNotificationOn, setIsNotificationOn] = React.useState(false);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={demoicon} style={styles.profileImage} />
        <Text style={styles.username}>AndrewDice1929</Text>
        <Text style={styles.fullname}>Andrew Dicesare</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Your Partner Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Partner</Text>
        <TouchableOpacity style={styles.row}>
          <Image source={demoicon} style={styles.partnerImage} />
          <Text style={styles.partnerName}>SeaTheDestroyer99</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.icon}>✏️</Text>
          <Text style={styles.optionText}>Edit profile</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.optionText}>Reset Password</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.row}>
          <Text style={styles.icon}>🌙</Text>
          <Text style={styles.optionText}>Dark mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={(value) => setIsDarkMode(value)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.icon}>🔔</Text>
          <Text style={styles.optionText}>Notification</Text>
          <Switch
            value={isNotificationOn}
            onValueChange={(value) => setIsNotificationOn(value)}
          />
        </View>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.icon}>🌐</Text>
          <Text style={styles.optionText}>Language</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.icon}>⚙️</Text>
          <Text style={styles.optionText}>Permission</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.icon}>🚪</Text>
          <Text style={styles.optionText}>Logout</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1, // ทำให้ ScrollView ขยายได้
    paddingBottom: 20, // เพิ่ม padding ด้านล่างเพื่อเลื่อนถึง Logout
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  fullname: {
    fontSize: 14,
    color: "#888",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  partnerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  partnerName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  arrow: {
    fontSize: 16,
    color: "#888",
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
});

export default ProfileScreen;