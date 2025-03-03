import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface NotificationBoxSingleProps {
  startTime?: string;
  endTime?: string;
  title?: string;
  location?: string;
  description?: string;
  iconSource?: any;
}

const NotificationBoxSingle: React.FC<NotificationBoxSingleProps> = ({
  startTime = "1:00 PM",
  endTime = "3:00 PM",
  title = "Meeting with the Sathu",
  location = "Location",
  description = "Description...",
  iconSource,
}) => {
  return (
    <View style={styles.container}>
      {/* Left Time Section */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{startTime}</Text>
        <View style={styles.separator} />
        <Text style={styles.timeText}>{endTime}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Icon on the Right */}
      {iconSource && <Image source={iconSource} style={styles.icon} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 355,
    height: 118,
    backgroundColor: "rgba(150, 179, 255, 0.5)", // Light pink with opacity
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  timeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  timeText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  separator: {
    width: 5,
    height: 25,
    backgroundColor: "#666",
    borderRadius: 2,
    marginVertical: 5,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  location: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginLeft: 10,
  },
});

export default NotificationBoxSingle;
