import React from "react";
import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute, useNavigationState } from "@react-navigation/native";

const BackButton: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routesLength = useNavigationState(state => state.routes.length);

  // Show the button only if there's a previous screen
  if (routesLength <= 1) return null;

  // Define different button labels for different screens
  const buttonTextMap: Record<string, string> = {
    Home: "Home",
    Details: "Details",
    Profile: "Profile",
    Settings: "Settings",
  };

  const buttonText = buttonTextMap[route.name] || "Back";

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
      <Image source={require("../assets/back-icon.png")} style={styles.icon} />
      <Text style={styles.text}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 250,
    height: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  text: {
    fontSize: 24,
    fontFamily: "Jomolhari",
    color: "#000",
  },
});

export default BackButton;
