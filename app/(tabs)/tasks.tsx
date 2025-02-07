import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Tasks() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Tasks page!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf1ec",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
