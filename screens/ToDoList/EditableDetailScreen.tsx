import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getTaskById } from '../../Backend/controller/dataController'; // Importing getTaskById

const EditableDetailScreen = ({ route }) => {
  const { taskId } = route.params; // Get the task ID from navigation params
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTaskById(taskId); // Fetch task data
        setTask(fetchedTask);
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading indicator
  }

  if (!task) {
    return <Text>No task found.</Text>; // Handle case where task is not found
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.date}>{task.date}</Text>
      <Text style={styles.time}>{task.startTime} - {task.endTime}</Text>
      <Text style={styles.label}>Description</Text>
      <Text>{task.description}</Text>
      <Text style={styles.label}>Location</Text>
      <Text>{task.location}</Text>
      {/* Add Edit and Complete buttons here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDECE4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    color: '#555',
  },
  time: {
    fontSize: 16,
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default EditableDetailScreen;
