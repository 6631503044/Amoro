import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Import Screens
import HomeScreen from "../../screens/Home/HomeScreen";
import ProfileScreen from "../../screens/Profile/ProfileScreen";
import NotificationsScreen from "../../screens/Notifications/NotificationsScreen";
import MoodBoardScreen from "../../screens/Mood/MoodBoardScreen";
import TodolistScreen from "../../screens/ToDoList/TodolistScreen";

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    return (
        <View style={styles.navBar}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel ?? route.name;
                const isFocused = state.index === index;

                // Define icon names based on route
                const iconMap: any = {
                    Home: { active: "home", inactive: "home-outline" },
                    "To-Do": { active: "checkmark-circle", inactive: "checkmark-circle-outline" },
                    Mood: { active: "heart", inactive: "heart-outline" },
                    Notifications: { active: "notifications", inactive: "notifications-outline" },
                    Profile: { active: "person", inactive: "person-outline" },
                };

                const iconName = isFocused ? iconMap[route.name].active : iconMap[route.name].inactive;

                return (
                    <TouchableOpacity
                        key={route.name}
                        style={[styles.tab, isFocused && styles.activeTab]}
                        onPress={() => navigation.navigate(route.name)}
                    >
                        <Ionicons name={iconName} size={24} color={isFocused ? "white" : "#B0B3C1"} />
                        <Text style={[styles.label, isFocused && styles.activeLabel]}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const BottomNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="To-Do" component={TodolistScreen} />
                <Tab.Screen name="Mood" component={MoodBoardScreen} />
                <Tab.Screen name="Notifications" component={NotificationsScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default BottomNavigation;

const styles = StyleSheet.create({
    navBar: {
        flexDirection: "row",
        backgroundColor: "#373D57", // Blue background
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
        paddingVertical: 8,
    },
    activeTab: {
        backgroundColor: "#FF969A", // Pink highlight for active tab
        borderRadius: 20,
        paddingHorizontal: 0, // Reduced width
        paddingVertical: 5, // Reduced height
    },
    label: {
        fontSize: 12,
        color: "#B0B3C1", // Gray for inactive
        marginTop: 2,
    },
    activeLabel: {
        color: "white", // White for active label
    },
});
``
