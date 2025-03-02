import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import NotificationsScreen from './screens/Notifications/NotificationsScreen';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './types'; // หากคุณมีไฟล์ types.ts

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 🔹 หน้า Home ที่มีปุ่มไป Notifications
interface HomeScreenProps {
  navigation: NavigationProp<RootStackParamList, 'HomeMain'>;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Text style={{ color: 'blue', marginTop: 10 }}>Go to Notifications</Text>
      </TouchableOpacity>
    </View>
  );
};

// 🔹 สร้าง Stack Navigator
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// 🔹 ใช้ Tab.Navigator รวม Stack เข้าไป
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
