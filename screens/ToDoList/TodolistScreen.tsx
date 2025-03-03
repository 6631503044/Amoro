import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PlusCircle } from "lucide-react-native";

const TodolistScreen = () => {
    const navigation = useNavigation();
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
            tasks: [
                { startTime: "1:00 PM", endTime: "3:00 PM", title: "Wash my clothes", icon: "🧂", color: "#C4C8F2" },
            ],
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: "#FDF6F0", padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>To Do List</Text>

            {/* Filter Selection */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 15 }}>
                {["Day", "Week", "Month"].map((option) => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => setFilter(option)}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                            backgroundColor: filter === option ? "#5063BF" : "#D3D4E2",
                        }}
                    >
                        <Text style={{ color: filter === option ? "white" : "black", fontWeight: "bold" }}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Task List */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
                {tasks.map((section, index) => (
                    <View key={index}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginVertical: 10 }}>{section.date}</Text>
                        {section.tasks.map((task, i) => (
                            <View key={i} style={{
                                backgroundColor: task.color,
                                padding: 15,
                                borderRadius: 15,
                                marginBottom: 10,
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                                <View style={{ alignItems: "center", marginRight: 10 }}>
                                    <Text style={{ fontSize: 14 }}>{task.startTime}</Text>
                                    <View style={{ width: 5, height: 20, backgroundColor: "#4A4A4A", borderRadius: 5, marginVertical: 2 }} />
                                    <Text style={{ fontSize: 14 }}>{task.endTime}</Text>
                                </View>
                                <Text style={{ fontSize: 16, flex: 1 }}>{task.title}</Text>
                                <Text style={{ fontSize: 18 }}>{task.icon}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>

            {/* Add Task Button */}
            <TouchableOpacity
                style={{
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
                }}
            >
                <PlusCircle size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default TodolistScreen;
