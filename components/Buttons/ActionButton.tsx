import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Change to desired icon set

type ActionButtonProps = {
  text: string;
  iconName?: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({ text, iconName }) => {
  return (
    <TouchableOpacity style={styles.button}>
      {iconName && (
        <Icon name={iconName} size={24} color="#003366" style={styles.icon} />
      )}
      <View style={[styles.textBox, !iconName && styles.fullWidthTextBox]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 130,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#003366',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  textBox: {
    width: 78,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthTextBox: {
    width: 114, // Adjust when no icon is present
  },
  text: {
    fontSize: 16,
    color: '#003366',
  },
});

export default ActionButton;
