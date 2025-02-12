import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const TaskListScreen = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Mock data fetching
    const fetchTasks = async () => {
      const currentDate = new Date().toISOString().split('T')[0];
      const mockData = [
        { id: '1', title: 'Go to gym', location: 'MFUgym', time: '9:00 AM', date: '2023-10-10', emoji: '😍' },
        { id: '2', title: 'EATTTT Shabu', location: 'OKShabu', time: '12:00 PM', date: '2023-10-10', emoji: '😋' },
        { id: '3', title: 'House of the Dragon', location: 'At My room', time: '14:00 PM', date: '2023-10-10', emoji: '😐' },
        { id: '4', title: 'Study', location: 'MFU Library', time: '16:00 PM', date: '2023-10-10', emoji: '😅' },
        { id: '5', title: 'Exercise', location: 'Singha Park', time: '17:00 PM', date: '2023-10-10', emoji: '😶' },
      ];
      const todayTasks = mockData.filter(task => task.date === currentDate);
      setTasks(todayTasks);
    };

    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Review Dashboard</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{item.title} {item.emoji}</Text>
            <Text style={styles.taskDetails}>{item.location}</Text>
            <Text style={styles.taskDetails}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f4f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskContainer: {
    backgroundColor: '#f0e5e5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDetails: {
    fontSize: 14,
    color: '#555',
  },
});

export default TaskListScreen;
