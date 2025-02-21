import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import MoodBoxSingle from './components/MoodBox/MoodBoxSingle';
import MoodBoxCouple from './components/MoodBox/MoodBoxCouple';
import TaskBoxSingle from './components/TaskBox/TaskBoxSingle';
import NotificationBoxCouple from './components/NotificationBox/NotificationBoxCouple';
import ReviewBoxSingle from './components/ReviewBox/ReviewBox';

const { width, height } = Dimensions.get('window');
import { primarycolor } from './assets/img/styles';

const App = () => {
  return (
    
    <View style={styles.container}>
            <ReviewBoxSingle 
        reviewText="The movie in that scene was too big. I want to ride a big dragon. 🐉🔥🔥🔥"
      />
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
    color: primarycolor,
    zIndex: 1,
  },
});

export default App;
