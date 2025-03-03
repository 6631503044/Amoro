import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [activity, setActivity] = useState('');
  const [withPartner, setWithPartner] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="black" />
        <Text style={styles.headerText}>Add Task</Text>
      </TouchableOpacity>
      
      {/* With Partner Switch */}
      <View style={styles.partnerContainer}>
        <Text style={styles.partnerText}>With Partner</Text>
        <Switch 
          value={withPartner}
          onValueChange={setWithPartner}
          thumbColor={withPartner ? "#5063BF" : "#D3D4E2"}
          trackColor={{ false: "#D3D4E2", true: "#E9D5FF" }}
        />
      </View>

      {/* Title Input */}
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} placeholder="Enter task title" />

      {/* Description Input */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter description"
        multiline
      />

      {/* Date Picker */}
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputRow}>
        <Text>{date.toDateString()}</Text>
        <FontAwesome name="calendar" size={16} color="black" />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker 
          value={date} 
          mode="date" 
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }} 
        />
      )}

      {/* Location Input */}
      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} placeholder="Enter location" />

      {/* Start Time Picker */}
      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.inputRow}>
        <Text>{startTime.toLocaleTimeString()}</Text>
        <FontAwesome name="clock-o" size={16} color="black" />
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker 
          value={startTime} 
          mode="time" 
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) setStartTime(selectedTime);
          }} 
        />
      )}

      {/* End Time Picker */}
      <Text style={styles.label}>End Time</Text>
      <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.inputRow}>
        <Text>{endTime.toLocaleTimeString()}</Text>
        <FontAwesome name="clock-o" size={16} color="black" />
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker 
          value={endTime} 
          mode="time" 
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) setEndTime(selectedTime);
          }} 
        />
      )}

      {/* Activity Picker (Add Tag) */}
      <Text style={styles.label}>Add Tag</Text>
      <View style={styles.tagContainer}>
        <Picker
          selectedValue={activity}
          onValueChange={(itemValue) => setActivity(itemValue)}
          style={styles.pickerStyle}
          itemStyle={styles.pickerItemStyle}
        >
          <Picker.Item label="Select activity" value="" />
          <Picker.Item label="Work" value="work" />
          <Picker.Item label="Personal" value="personal" />
        </Picker>
      </View>

      {/* Notification */}
      <Text style={styles.label}>Notification</Text>
      <TouchableOpacity style={styles.inputRow}>
        <Text>30 minutes before</Text>
        <FontAwesome name="bell" size={16} color="black" />
      </TouchableOpacity>

      {/* Save Button placed 19px below the Notification box */}
      <TouchableOpacity style={[styles.saveButton, { marginTop: 19 }]}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF1E6',
    padding: 16,
  },
  // Increase bottom padding so that the Save button is fully visible above BottomNavigation
  scrollContent: {
    paddingBottom: 200,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  partnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E9D5FF',
    padding: 8,
    borderRadius: 10,
    marginBottom: 16,
  },
  partnerText: {
    color: '#6B21A8',
    fontWeight: '600',
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  textArea: {
    height: 80,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  tagContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerStyle: {
    height: 40,
    width: '100%',
    textAlign: 'center',
  },
  pickerItemStyle: {
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4B5563',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AddTaskScreen;
