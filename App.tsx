import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>สวัสดีครับพี่ชายฟร้อนเอนทั้งหลาย เวลคัมๆ !</Text>
      <Text style={styles.text}>สุ้ๆ นะ ทำเป็น tsx ให้ละ เลิฟยู </Text>
      {/* Background Heart GIF */}
      
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
