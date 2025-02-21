import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import SignupScreen from './screens/Authentication/SignupScreen';
import LoginScreen from './screens/Authentication/LoginScreen';
import AddTaskScreen from './screens/ToDoList/AddTaskScreen';
import MoodReviewScreen from './screens/Mood/MoodReviewScreen';
import NotificationsScreen from './screens/Notifications/NotificationsScreen';
import MoodBoardScreen from './screens/Mood/MoodBoardScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/Home/HomeScreen';
import ToDoListScreen from './screens/ToDoList/TodolistScreen';
import ProfileScreen from './screens/Profile/ProfileScreen';
import EditTaskScreen from './screens/ToDoList/EditTaskScreen';
import EditableDetailScreen from './screens/ToDoList/EditableDetailScreen';

const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="ToDoList" component={ToDoListScreen} />
    <Tab.Screen name="MoodBoard" component={MoodBoardScreen} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        <Stack.Screen name="Review" component={MoodReviewScreen} />
        <Stack.Screen name="EditTaskScreen" component={EditTaskScreen} />
        <Stack.Screen name="EditableDetailScreen" component={EditableDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
