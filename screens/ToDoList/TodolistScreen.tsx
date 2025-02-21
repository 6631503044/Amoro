import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { StackNavigationProp } from '@react-navigation/stack';
import { FetchtaskforDate } from '../../Backend/controller/dataController';

// Define your navigation param types
type RootStackParamList = {
  EditableDetailScreen: { 
    taskId: string;
    date: string;
    taskDetails: any;
  };
  // ... other screen definitions
};

const ToDoListScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    React.useCallback(() => {
      const fetchTasks = async () => {
        const currentDate = selectedDate.toISOString().split('T')[0];
        console.log('Fetching tasks for:', currentDate);
        const tasksForDate = await FetchtaskforDate({date: currentDate});
        setTasks(tasksForDate);
      };
      
      fetchTasks();
      
      // Optional: return cleanup function if needed
      return () => console.log('Screen focus lost');
    }, [selectedDate])
  );

  const renderTask = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.taskContainer}
      onPress={() => navigation.navigate('EditableDetailScreen', { 
        taskId: item.id,
        date: selectedDate.toISOString().split('T')[0],
        taskDetails: item.taskDetail
      })}
    >
      <Text style={styles.taskTitle}>{item.taskDetail.title}</Text>
      <Text style={styles.taskDetails}>Start Time: {item.taskDetail.startTime}</Text>
      <Text style={styles.taskDetails}>End Time: {item.taskDetail.endTime}</Text>
      <Text style={styles.taskDetails}>Description: {item.taskDetail.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To Do List</Text>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
      />
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderTask}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTask')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDECE4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskContainer: {
    backgroundColor: '#ADD8E6',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDetails: {
    fontSize: 14,
    color: '#555',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F28B82',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default ToDoListScreen;
