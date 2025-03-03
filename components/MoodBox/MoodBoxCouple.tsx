import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface MoodBoxCoupleProps {
  text: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconContainerStyle?: ViewStyle;
  emoji?: string;
}

const MoodBoxCouple: React.FC<MoodBoxCoupleProps> = ({
  text,
  containerStyle,
  textStyle,
  iconContainerStyle,
  emoji = '😍',
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.iconContainer, iconContainerStyle]}>{/* Add your icon here */}</View>
      <View style={styles.textContainer}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </View>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 90,
    backgroundColor: 'rgba(255, 150, 154, 0.5)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 150, 153, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  emoji: {
    fontSize: 28,
    marginLeft: 10,
  },
});

export default MoodBoxCouple;

// Usage Example:
// <MoodBoxSingle text="สู้ๆ นะ ทำเป็น tsx ให้ละ เลิฟยู" />
