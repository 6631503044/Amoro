import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../Backend/firebaseConfig';

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      if (auth.currentUser && selectedDate) {
        const q = query(
          collection(db, 'tasks', auth.currentUser.uid, 'dates'),
          where('date', '==', selectedDate)
        );
        const querySnapshot = await getDocs(q);
        const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksData);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.timeText}>{item.startTime} - {item.endTime}</Text>
      <Text style={styles.taskText}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#ADD8E6' },
        }}
      />
      <Text style={styles.dateTitle}>{selectedDate}</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDECE4',
    padding: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  taskContainer: {
    backgroundColor: '#ADD8E6',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#000',
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
