import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const MoodReviewScreen = () => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');

  const handleRating = (value: number) => {
    setRating(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Mood</Text>
      <Text style={styles.subtitle}>"Go to gym"</Text>

      <View style={styles.moodContainer}>
        <Image source={{ uri: 'https://example.com/mood-icon.png' }} style={styles.moodIcon} />
        <Text style={styles.rateText}>Please rate your partner today!</Text>
        <View style={styles.heartContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity key={value} onPress={() => handleRating(value)}>
              <Text style={[styles.heart, rating >= value ? styles.filledHeart : styles.emptyHeart]}>
                {rating >= value ? '❤️' : '♡'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.shareText}>Share your feelings with your love.</Text>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  moodContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  moodIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  rateText: {
    fontSize: 16,
    marginBottom: 10,
  },
  heartContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heart: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  filledHeart: {
    color: 'red',
  },
  emptyHeart: {
    color: 'gray',
  },
  shareText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MoodReviewScreen;
