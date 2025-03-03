import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ArrowLeft, Edit, CheckCircle } from "lucide-react-native";

type RootStackParamList = {
  EditTaskScreen: { task: any };
  EditableDetailScreen: { task: any };
  MoodReviewScreen: { task: any };
};

type EditTaskScreenRouteProp = RouteProp<RootStackParamList, "EditTaskScreen">;
type NavigationProp = StackNavigationProp<RootStackParamList, "EditTaskScreen">;

const EditTaskScreen = () => {
  const route = useRoute<EditTaskScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { task } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{task.title}</Text>
      </View>

      {/* Task Info */}
      <View style={styles.taskContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.taskIcon}>{task.icon}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.text}>
            {task.description || "No description available"}
          </Text>

          <Text style={styles.label}>Start Time:</Text>
          <Text style={styles.text}>{task.startTime}</Text>

          <Text style={styles.label}>End Time:</Text>
          <Text style={styles.text}>{task.endTime}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditableDetailScreen", { task })
          }
        >
          <Edit size={20} color="white" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.doneButton}
  onPress={() => {
    const parent = navigation.getParent();
    parent?.navigate("Mood", {
      screen: "MoodReviewScreen",
      params: { task },
    });
  }}
>
  <CheckCircle size={20} color="white" />
  <Text style={styles.buttonText}>Mark as Done</Text>
</TouchableOpacity>

      </View>
    </View>
  );
};

export default EditTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6F0",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginRight: 15,
  },
  taskIcon: {
    fontSize: 40,
  },
  detailsContainer: {
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5063BF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  doneButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
});
