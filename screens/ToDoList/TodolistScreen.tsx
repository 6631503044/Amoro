import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../Backend/firebaseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const fetchTasksForDate = async (date: string) => {
  console.log('[DEBUG] Starting fetch for date:', date);
  const currentUser = auth.currentUser;
  console.log('[DEBUG] Current user UID:', currentUser.uid || 'No user');
  
  try {
    const tasksRef = collection(db, 'tasks', currentUser.uid, date);
    console.log('[DEBUG] Tasks collection path:', tasksRef.path);
    
    const querySnapshot = await getDocs(tasksRef);
    console.log('[DEBUG] Found tasks:', querySnapshot.docs.map(d => d.id));

    const tasks = await Promise.all(querySnapshot.docs.map(async docSnapshot => {
      const taskId = docSnapshot.id;
      const taskDetailCollectionRef = collection(db, 'tasks', currentUser.uid, date, taskId, 'taskDetail');
      console.log('Fetching task detail collection for:', taskDetailCollectionRef.path);
      const taskDetailSnapshot = await getDocs(taskDetailCollectionRef);
      
      // Combine all task detail documents
      const taskDetails = taskDetailSnapshot.docs.map(detailDoc => detailDoc.data());
      
      console.log('fetch success');
      
      return {
        id: taskId,
        ...docSnapshot.data(),
        taskDetail: taskDetails[0] || {}, // Take the first document if exists
      };
    }));

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

const ToDoListScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchTasks = async () => {
        const currentDate = selectedDate.toISOString().split('T')[0];
        console.log('Fetching tasks for:', currentDate);
        const tasksForDate = await fetchTasksForDate(currentDate);
        setTasks(tasksForDate);
      };
      
      fetchTasks();
      
      // Optional: return cleanup function if needed
      return () => console.log('Screen focus lost');
    }, [selectedDate])
  );

  const renderTask = ({ item }: { item: any }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskTitle}>{item.taskDetail.title}</Text>
      <Text style={styles.taskDetails}>Start Time: {item.taskDetail.startTime}</Text>
      <Text style={styles.taskDetails}>End Time: {item.taskDetail.endTime}</Text>
      <Text style={styles.taskDetails}>Description: {item.taskDetail.description}</Text>
    </View>
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
