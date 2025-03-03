import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import TaskBoxCouple from "../../components/Taskbox/TaskBoxCouple";
import TaskBoxSingle from "../../components/Taskbox/TaskBoxSingle";

//icon
import MeetIcon from "../../assets/icon/meet";
import WalkIcon from "../../assets/icon/walk";
import WorkIcon from "../../assets/icon/work";

type TodolistScreenNavigationProp = NavigationProp<any>; // Update with your navigation stack type

interface Props {
  navigation: TodolistScreenNavigationProp;
}

const TodolistScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState("Day"); // Default to 'Day'
  const [tasks, setTasks] = useState([
    { id: 1, date: "Monday 3 February 2025", taskText: "Morning Jog", type: "Exercise", isSingle: true, startTime: "7:00 AM", endTime: "8:00 AM" },
    { id: 2, date: "Monday 3 February 2025", taskText: "Team Meeting", type: "Meeting", isSingle: false, startTime: "9:00 AM", endTime: "10:00 AM" },
    { id: 3, date: "Tuesday 4 February 2025", taskText: "Lunch with Client", type: "Meeting", isSingle: true, startTime: "12:00 PM", endTime: "1:00 PM" },
    { id: 4, date: "Wednesday 5 February 2025", taskText: "Project Review", type: "Work", isSingle: false, startTime: "2:00 PM", endTime: "3:00 PM" },
  ]);

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
  };

  // Helper function to choose the correct icon based on task type
  const getTaskIcon = (type: string) => {
    switch (type) {
      case "Exercise":
        return <WalkIcon />; // Use the ExerciseIcon component
      case "Meeting":
        return <MeetIcon />; // Use the MeetingIcon component
      case "Work":
        return <WorkIcon />; // Use the WorkIcon component
      default:
        return <Text>❓</Text>; // Default icon
    }
  };

  const renderTaskBox = (task: any) => {
    const taskIcon = getTaskIcon(task.type); // Get the appropriate icon

    if (task.isSingle) {
      return (
        <TaskBoxSingle
          key={task.id}
          startTime={task.startTime}
          endTime={task.endTime}
          taskText={task.taskText}
          iconSource={taskIcon}
        />
      );
    } else {
      return (
        <TaskBoxCouple
          key={task.id}
          startTime={task.startTime}
          endTime={task.endTime}
          taskText={task.taskText}
          iconSource={taskIcon}
        />
      );
    }
  };

  const renderNoTasksMessage = () => {
    return <Text style={styles.noTasksText}>You don't have any tasks today!</Text>;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Todolist</Text>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {["Day", "Week", "Month"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterBox,
              selectedFilter === filter && { backgroundColor: "lightblue" },
            ]}
            onPress={() => handleFilterClick(filter)}
          >
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      {tasks.length === 0 ? renderNoTasksMessage() : tasks.map(renderTaskBox)}

      {/* Add Task Button */}
      <TouchableOpacity
        style={styles.addTaskButton}
        onPress={() => navigation.navigate("AddTaskScreen")}
      >
        <Text style={styles.addIcon}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFBF00", // Amber color
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: "Jomolhari",
    color: "#000",
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  filterBox: {
    width: 100,
    height: 30,
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  filterText: {
    fontSize: 16,
    fontFamily: "Jomolhari",
    color: "#000",
  },
  noTasksText: {
    fontSize: 16,
    fontFamily: "Jomolhari",
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  addTaskButton: {
    position: "absolute",
    bottom: 45,
    left: "50%",
    transform: [{ translateX: -21 }],
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#4CAF50", // Green color for the button
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    fontSize: 30,
    color: "#fff",
  },
});

export default TodolistScreen;
