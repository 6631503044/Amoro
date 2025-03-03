import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define types for navigation and route props
type RootStackParamList = {
  MoodDetail: { title: string; location: string; time: string; emoji: string; color: string };
  MoodReviewScreen: { title: string; location: string; time: string; emoji: string; color: string };
};

type MoodDetailScreenRouteProp = RouteProp<RootStackParamList, "MoodDetail">;
type MoodDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, "MoodDetail">;

interface MoodDetailProps {
  route: MoodDetailScreenRouteProp;
  navigation: MoodDetailScreenNavigationProp;
}

const MoodDetail: React.FC<MoodDetailProps> = ({ route, navigation }) => {
  const { title, location, time, emoji, color } = route.params;
  const [comment, setComment] = useState("");

  return (
      <View style={[styles.container, { backgroundColor: color }]}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.header}>Mood Details</Text>
        </View>

        {/* Mood Info */}
        <View style={styles.moodBox}>
          <Text style={styles.moodEmoji}>{emoji}</Text>
          <View>
            <Text style={styles.moodTitle}>{title}</Text>
            <Text style={styles.moodLocation}>{location}</Text>
            <Text style={styles.moodTime}>{time}</Text>
          </View>
        </View>

        {/* No Reviews Yet */}
        <Text style={styles.noReviewText}>There are no reviews yet</Text>

        {/* Comment Box */}
        <View style={styles.commentBox}>
          <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#999"
              value={comment}
              onChangeText={setComment}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Add Comment Button */}
        <TouchableOpacity
          style={styles.addCommentButton}
          onPress={() => navigation.navigate("MoodReviewScreen", { title, location, time, emoji, color })}
        >
          <Text style={styles.addCommentText}>Add Comment</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FDF6F0" },
  headerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginLeft: 10, color: "#333" },
  moodBox: { flexDirection: "row", padding: 15, borderRadius: 15, backgroundColor: "#fff", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  moodEmoji: { fontSize: 30, marginRight: 15 },
  moodTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  moodLocation: { fontSize: 14, color: "#666" },
  moodTime: { fontSize: 12, color: "#999" },
  noReviewText: { textAlign: "center", fontSize: 16, color: "#999", marginVertical: 20 },
  commentBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, elevation: 3, position: "absolute", bottom: 20, left: 20, right: 20 },
  commentInput: { flex: 1, fontSize: 16 },
  sendButton: { backgroundColor: "#6787E7", padding: 10, borderRadius: 10 },
  addCommentButton: {
    position: "absolute",
    top: 690,
    left: 135,
    backgroundColor: "#6787E7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
  },
  addCommentText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default MoodDetail;
