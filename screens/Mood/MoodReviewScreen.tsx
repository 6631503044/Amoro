import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define navigation type
type RootStackParamList = {
  MoodBoardScreen: undefined;
};

const emojiMap = [
  "😢", // 1 heart
  "😞", // 2 hearts
  "😐", // 3 hearts
  "😊", // 4 hearts
  "😍", // 5 hearts
];

const MoodReviewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "MoodBoardScreen">>();
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Choose Your Mood</Text>
      <Text style={styles.subtitle}>"House of the Dragon"</Text>

      {/* Emoji */}
      <Text style={styles.emoji}>{emojiMap[rating - 1] || "😐"}</Text>
      <Text style={styles.prompt}>Please rate your experience!</Text>

      {/* Heart Rating */}
      <View style={styles.heartContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setRating(num)}>
            <Ionicons name="heart" size={32} color={num <= rating ? "#E91E63" : "#ddd"} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes Section */}
      <Text style={styles.notesLabel}>Share your thoughts</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Write a short note about your experience..."
        multiline
        value={note}
        onChangeText={setNote}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate("MoodBoardScreen")}>
        <Ionicons name="save" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0", padding: 20, alignItems: "center" },
  backButton: { position: "absolute", top: 50, left: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginTop: 60 },
  subtitle: { fontSize: 18, color: "#666", marginBottom: 20 },
  emoji: { fontSize: 50, marginVertical: 10 },
  prompt: { fontSize: 16, color: "#555" },
  heartContainer: { flexDirection: "row", marginVertical: 15 },
  notesLabel: { fontSize: 16, color: "#444", marginTop: 20 },
  notesInput: {
    width: "100%",
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
    elevation: 2,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#E91E63",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 16, marginLeft: 8 },
});

export default MoodReviewScreen;
