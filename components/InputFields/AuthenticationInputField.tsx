import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface AuthenticationInputFieldProps {
  icon?: string | React.ReactNode;  
  placeholder?: string;  
}

const AuthenticationInputField: React.FC<AuthenticationInputFieldProps> = ({ icon, placeholder = "Enter text..." }) => {
  return (
    <View style={styles.container}>
      {/* Icon Area */}
      <View style={styles.iconContainer}>
        {typeof icon === 'string' ? (
          <Icon name={icon} size={20} color="#000" />
        ) : (
          icon
        )}
      </View>

      {/* Input Field */}
      <TextInput 
        style={styles.input} 
        placeholder={placeholder} 
        placeholderTextColor="#888"
        underlineColorAndroid="transparent"  // ✅ Removes underline on Android
        selectionColor="transparent" // ✅ Removes focus highlight on iOS
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 322.67,
    height: 52.33,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },
  input: {
    flex: 1,
    height: 20, 
    fontSize: 16,
    color: '#000',
    borderWidth: 0,              // ✅ No border on focus
    backgroundColor: "transparent", // ✅ Transparent background
    padding: 0,                 // ✅ Remove extra padding
  
  },
});

export default AuthenticationInputField;
