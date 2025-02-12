import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { collection, doc, addDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../Backend/firebaseConfig';
import { Savetask , Deletetask } from '../../Backend/controller/dataController';

const AddTaskScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [withPartner, setWithPartner] = useState(false);



   

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      
      <Text>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <Text>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <View style={styles.column}>
          <Text>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text>Start time</Text>
          <TextInput
            style={styles.input}
            placeholder="00:00 AM"
            value={startTime}
            onChangeText={setStartTime}
          />
        </View>
        <View style={styles.column}>
          <Text>End time</Text>
          <TextInput
            style={styles.input}
            placeholder="00:00 AM"
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>
      </View>

      <View style={styles.row}>
        <Text>Add Tag</Text>
        {/* Add tag selection logic here */}
      </View>

      <View style={styles.row}>
        <Text>With Partner</Text>
        <Switch
          value={withPartner}
          onValueChange={setWithPartner}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={async () => { await Savetask({
          title,
          description,
          date,
          location,
          startTime,
          endTime,
          withPartner
        });
      }}>
        <Text style={styles.saveButtonText}>Save</Text>
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  textArea: {
    height: 80,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#A0C4FF',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddTaskScreen;
