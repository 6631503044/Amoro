import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";

const SlideSwitch: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  const translateX = new Animated.Value(isOn ? 17 : 2); // Start position

  // Sync animation with state changes
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOn ? 17 : 2, // Move knob left or right
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const toggleSwitch = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <TouchableOpacity onPress={toggleSwitch} style={[styles.switch, { backgroundColor: isOn ? "#00008B" : "#7B7B7B" }]}>
      <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 42,
    height: 25,
    borderRadius: 12.5, // Makes it rounded
    borderWidth: 1,
    borderColor: "#999",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  knob: {
    width: 21,
    height: 21,
    backgroundColor: "#FFF",
    borderRadius: 10.5, // Circular knob
  },
});

export default SlideSwitch;
