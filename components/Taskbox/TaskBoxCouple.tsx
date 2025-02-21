import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface TaskBoxSingleProps {
  startTime?: string; // Expected format: "1:00 PM"
  endTime?: string;   // Expected format: "3:00 PM"
  taskText?: string;
  iconSource?: any; // Image source for the icon
}

const TaskBoxSingle: React.FC<TaskBoxSingleProps> = ({
  startTime = "1:00 PM",
  endTime = "3:00 PM",
  taskText = "Hello bruh",
  iconSource
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{startTime}</Text>
        <View style={styles.separator} />
        <Text style={styles.timeText}>{endTime}</Text>
      </View>
      <Text style={styles.taskText}>{taskText}</Text>
      {iconSource && <Image source={iconSource} style={styles.icon} />}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      width: 370, // Slightly wider
      height: 75, // Increased height
      backgroundColor: "rgba(255, 150, 154, 0.5)", // 50% opacity
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15, // Increased padding inside the box
      paddingVertical: 10, // Added vertical padding
    },
    timeContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginRight: 15, // Slightly more space between time and text
    },
    timeText: {
      fontSize: 12,
      color: "#333",
    },
    separator: {
      width: 4,
      height: 20,
      backgroundColor: "#666",
      borderRadius: 2,
      marginVertical: 2,
    },
    taskText: {
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
      color: "#000",
      paddingHorizontal: 5, // Small padding inside text area
    },
    icon: {
      width: 36,
      height: 36,
      resizeMode: "contain",
    },
  });
  

export default TaskBoxSingle;
