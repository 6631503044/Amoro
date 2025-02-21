import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Expo's built-in icons

const InputField = ({ icon }: { icon?: any }) => {
  return (
    <View style={styles.container}>
      {icon && <MaterialIcons name="arrow-back" size={24} color="#000" style={styles.icon} />}
      <TextInput style={styles.input} placeholder="Enter text..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 340,
    height: 42,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});

export default InputField;
