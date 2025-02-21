import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ReviewBoxSingleProps {
  reviewText?: string;
}

const ReviewBoxSingle: React.FC<ReviewBoxSingleProps> = ({
  reviewText = "This movie was amazing! I want to ride a big dragon. 🐉🔥🔥🔥",
}) => {
  return (
    <View style={styles.container}>
      {/* User Icon Placeholder */}
      <View style={styles.userIconPlaceholder} />

      {/* Review Text */}
      <View style={styles.textContainer}>
        <Text style={styles.reviewText}>{reviewText}</Text>
      </View>

      {/* Emoji Placeholder */}
      <View style={styles.emojiPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 314,
    height: 175,
    backgroundColor: "rgba(255, 235, 205, 0.8)", // Light peach color with opacity
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
    paddingHorizontal: 10,
    position: "relative",
  },
  userIconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc", // Gray placeholder
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    height: 72,
    justifyContent: "center",
  },
  reviewText: {
    fontSize: 16,
    color: "#000",
  },
  emojiPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc", // Gray placeholder
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default ReviewBoxSingle;
