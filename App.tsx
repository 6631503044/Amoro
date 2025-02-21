import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import Action from './components/Buttons/ActionButton';
import ActionButton from './components/Buttons/ActionButton';
import BackButton from './components/Buttons/BackButton';
import SlideSwitch from './components/Buttons/SlideSwitch';

const { width, height } = Dimensions.get('window');

const App = () => {
  return (
  
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
      <SlideSwitch />
    </View>

     
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', 
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
    zIndex: 1,
  },
  backgroundGif: {
    position: 'absolute',
    width: width,
    height: height, 
    opacity: 0.5,
  },
});

export default App;
