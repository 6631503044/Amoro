import React from "react";
import { StatusBar } from "react-native";
import BottomNavigation from "./components/Navigation/BottomTabNavigator"; // Adjust path if needed

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <BottomNavigation />
    </>
  );
};

export default App;
