import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>สวัสดีครับพี่ชายฟร้อนเอนทั้งหลาย เวลคัมๆ !</Text>
      <Text style={styles.text}>สุ้ๆ นะ ทำเป็น tsx ให้ละ เลิฟยู </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
