import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();

  const tabs = [
    { name: "home", label: "Home", icon: "home-outline", activeIcon: "home" },
    { name: "tasks", label: "Tasks", icon: "checkmark-circle-outline", activeIcon: "checkmark-circle" },
    { name: "favorites", label: "Mood", icon: "heart-outline", activeIcon: "heart" },
    { name: "notifications", label: "Notifications", icon: "notifications-outline", activeIcon: "notifications" },
    { name: "profile", label: "Profile", icon: "person-outline", activeIcon: "person" },
  ];

  if (!loaded) {
    return null;
  }

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);

    // Push to the exact path for each tab
    if (tab === "home") {
      router.push("/");
    } else if (tab === "tasks") {
      router.push("/tasks");
    } else if (tab === "favorites") {
      router.push("/favorites");
    } else if (tab === "Moods") {
      router.push("/notifications");
    } else if (tab === "profile") {
      router.push("/profile");
    }
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>

      {/* Custom Bottom Navigation Bar */}
      <View style={styles.navBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, activeTab === tab.name && styles.activeTab]}
            onPress={() => handleTabPress(tab.name)}
          >
            <Ionicons
              name={activeTab === tab.name ? (tab.activeIcon as any) : (tab.icon as any)}
              size={24}
              color={activeTab === tab.name ? "white" : "#888"}
            />
            <Text style={[styles.label, activeTab === tab.name && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    backgroundColor: "#2c2f48",
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  activeTab: {
    backgroundColor: "#ff6b6b",
    borderRadius: 20,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  activeLabel: {
    color: "white",
  },
});
