import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import SVG Icons
import HeartIcon from "../../assets/icon.svg/heart";
import NotiIcon from "../../assets/icon.svg/noti";
import HomeIcon from "../../assets/icon.svg/home";
import CorrectIcon from "../../assets/icon.svg/correct";
import ProfileIcon from "../../assets/icon.svg/profile";

// Import Screens
import HomeScreen from "../../screens/Home/HomeScreen";
import ProfileScreen from "../../screens/Profile/ProfileScreen";

// Notifications
import NotificationsScreen from "../../screens/Notifications/NotificationsScreen";
import ViewDetailScreen from "../../screens/Notifications/ViewDetailScreen";

// Mood Screens
import MoodBoardScreen from "../../screens/Mood/MoodBoardScreen";
import MoodDetail from "../../screens/Mood/MoodDetail";
import MoodReviewScreen from "../../screens/Mood/MoodReviewScreen";

// To-Do List Screens
import AddTaskScreen from "../../screens/ToDoList/AddTaskScreen";
import EditableDetailScreen from "../../screens/ToDoList/EditableDetailScreen";
import EditTaskScreen from "../../screens/ToDoList/EditTaskScreen";
import TodolistScreen from "../../screens/ToDoList/TodolistScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ✅ Stack Navigator for Notifications
const NotificationsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
    <Stack.Screen name="ViewDetailScreen" component={ViewDetailScreen} />
  </Stack.Navigator>
);

// ✅ Stack Navigator for Mood
const MoodNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MoodBoardScreen" component={MoodBoardScreen} />
    <Stack.Screen name="MoodDetail" component={MoodDetail} />
    <Stack.Screen name="MoodReviewScreen" component={MoodReviewScreen} />
  </Stack.Navigator>
);

// ✅ Stack Navigator for To-Do List
const ToDoNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AddTaskScreen" component={AddTaskScreen} />
    <Stack.Screen name="EditableDetailScreen" component={EditableDetailScreen} />
    <Stack.Screen name="EditTaskScreen" component={EditTaskScreen} />
    <Stack.Screen name="TodolistScreen" component={TodolistScreen} />
  </Stack.Navigator>
);

// ✅ Bottom Navigation
const BottomNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: false, // ❌ Hide text labels
          tabBarIcon: ({ color, focused }) => {
            let IconComponent: React.ElementType = HomeIcon; // Default icon

            if (route.name === "Notifications") IconComponent = NotiIcon;
            else if (route.name === "Mood") IconComponent = HeartIcon;
            else if (route.name === "To-Do") IconComponent = CorrectIcon;
            else if (route.name === "Profile") IconComponent = ProfileIcon;

            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                {focused && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: -10,
                      width: 65,
                      height: 48,
                      backgroundColor: "#FF969A",
                      borderRadius: 20,
                      zIndex: -1,
                    }}
                  />
                )}
                <IconComponent width={30} height={30} fill={color} />
              </View>
            );
          },
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "#B0B3C1",
          tabBarStyle: {
            height: 69.54,
            backgroundColor: "#666B7E",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            position: "absolute",
            paddingBottom: 5,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Notifications" component={NotificationsNavigator} />
        <Tab.Screen name="Mood" component={MoodNavigator} />
        <Tab.Screen name="To-Do" component={ToDoNavigator} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomNavigation;
