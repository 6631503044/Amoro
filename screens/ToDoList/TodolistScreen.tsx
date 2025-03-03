import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlusCircle } from "lucide-react-native";

// Define navigation types
type RootStackParamList = {
    TodolistScreen: undefined;
    AddTaskScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "TodolistScreen">;

const TodolistScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [filter, setFilter] = useState("Week");

    // Sample upcoming tasks
    const tasks = [
        {
            date: "Monday 3 February 2025",
            tasks: [
                { startTime: "1:00 PM", endTime: "3:00 PM", title: "Wash my clothes", icon: "🧂", color: "#C4C8F2" },
                { startTime: "4:00 PM", endTime: "5:00 PM", title: "Clean my room", icon: "🧹", color: "#C4C8F2" },
                { startTime: "7:00 PM", endTime: "8:00 PM", title: "Playing video games and watching movies with Nut", icon: "🎮", color: "#FFCDD2" },
            ],
        },
        {
            date: "Tuesday 4 February 2025",
            tasks: [
                { startTime: "1:00 PM", endTime: "3:00 PM", title: "Wash my clothes", icon: "🧂", color: "#C4C8F2" },
                { startTime: "7:00 PM", endTime: "8:00 PM", title: "Playing video games and watching movies with Nut", icon: "🎮", color: "#FFCDD2" },
            ],
        },
        {
            date: "Friday 6 February 2025",
            tasks: [{ startTime: "1:00 PM", endTime: "3:00 PM", title: "Wash my clothes", icon: "🧂", color: "#C4C8F2" }],
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>To Do List</Text>

            {/* Filter Selection */}
            <View style={styles.filterContainer}>
                {["Day", "Week", "Month"].map((option) => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => setFilter(option)}
                        style={[
                            styles.filterButton,
                            { backgroundColor: filter === option ? "#5063BF" : "#D3D4E2" },
                        ]}
                    >
                        <Text style={{ color: filter === option ? "white" : "black", fontWeight: "bold" }}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Task List */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {tasks.map((section, index) => (
                    <View key={index}>
                        <Text style={styles.sectionTitle}>{section.date}</Text>
                        {section.tasks.map((task, i) => (
                            <View key={i} style={[styles.taskContainer, { backgroundColor: task.color }]}>
                                <View style={styles.taskTimeContainer}>
                                    <Text style={styles.taskTime}>{task.startTime}</Text>
                                    <View style={styles.separator} />
                                    <Text style={styles.taskTime}>{task.endTime}</Text>
                                </View>
                                <Text style={styles.taskTitle}>{task.title}</Text>
                                <Text style={styles.taskIcon}>{task.icon}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>

            {/* Add Task Button */}
            <TouchableOpacity
                onPress={() => navigation.navigate("AddTaskScreen")}
                style={styles.addButton}
            >
                <PlusCircle size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default TodolistScreen;

// ✅ Extracted Styles for Clean Code
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDF6F0",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 15,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 10,
    },
    taskContainer: {
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    taskTimeContainer: {
        alignItems: "center",
        marginRight: 10,
    },
    taskTime: {
        fontSize: 14,
    },
    separator: {
        width: 5,
        height: 20,
        backgroundColor: "#4A4A4A",
        borderRadius: 5,
        marginVertical: 2,
    },
    taskTitle: {
        fontSize: 16,
        flex: 1,
    },
    taskIcon: {
        fontSize: 18,
    },
    addButton: {
        position: "absolute",
        bottom: 100,
        right: 20,
        backgroundColor: "#5063BF",
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
