import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import LoginScreen from './screens/Authentication/LoginScreen';
const { width, height } = Dimensions.get('window');
import { primarycolor } from './assets/img/styles';

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
    color: primarycolor,
    zIndex: 1,
  },
});

export default App;
