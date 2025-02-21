import React from 'react';
<<<<<<< Updated upstream
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import MoodBoxSingle from './components/MoodBox/MoodBoxSingle';
import MoodBoxCouple from './components/MoodBox/MoodBoxCouple';
import TaskBoxSingle from './components/TaskBox/TaskBoxSingle';
import NotificationBoxCouple from './components/NotificationBox/NotificationBoxCouple';
import ReviewBoxSingle from './components/ReviewBox/ReviewBox';
=======
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import InputField from './components/InputFields/InputField'; // Path to InputField component
>>>>>>> Stashed changes

const { width, height } = Dimensions.get('window');

const App = () => {
  return (
<<<<<<< Updated upstream
    
    <View style={styles.container}>
            <ReviewBoxSingle 
        reviewText="The movie in that scene was too big. I want to ride a big dragon. 🐉🔥🔥🔥"
      />
=======
    <View style={styles.container}>
      {/* InputField with an icon */}
      <InputField icon={require('./assets/icon/backicon.svg')} />

      {/* InputField without an icon */}
      <InputField />
>>>>>>> Stashed changes
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< Updated upstream
    position: 'relative', 
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
    zIndex: 1,
=======
    backgroundColor: '#f5f5f5',
>>>>>>> Stashed changes
  },
  backgroundGif: {
    position: 'absolute',
    width: width,
    height: height, 
    opacity: 0.5,
  },
});

export default App;
