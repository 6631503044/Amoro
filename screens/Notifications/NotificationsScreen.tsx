import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import NotificationBoxCouple from '../../components/NotificationBox/NotificationBoxCouple';
import MeetIcon from '../../assets/icon/meet';
import PartyIcon from '../../assets/icon/party';
import WalkIcon from '../../assets/icon/walk';

const notifications = [
  {
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    title: 'Meeting with the Sathu',
    location: 'Location',
    description: 'description..ww.',
    iconSource: MeetIcon, // SVG Component
    color: '#FF969A',
  },
  {
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    title: 'Meeting with the black one',
    location: 'Location',
    description: 'description...',
    iconSource: PartyIcon, // SVG Component
    color: '#FF969A',
  },
  {
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    title: 'Meeting with the black one',
    location: 'Location',
    description: 'description...',
    iconSource: WalkIcon, // SVG Component
    color: '#96B3FF',
  },
  {
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    title: 'Meeting with the black one',
    location: 'Location',
    description: 'description...',
    iconSource: PartyIcon, // SVG Component
    color: '#FF969A',
  },
];

const NotificationsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Today's Activities!</Text>
      <Text style={styles.subHeader}>Upcoming</Text>
      {notifications.map((notification, index) => (
        <TouchableOpacity key={index} style={[styles.notificationBox, { backgroundColor: notification.color }]}>
          <View style={styles.content}>
            <Text style={styles.time}>{notification.startTime}</Text>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.text}>{notification.location}</Text>
            <Text style={styles.text}>{notification.description}</Text>
          </View>
          {typeof notification.iconSource === 'string' ? (
            <Image source={notification.iconSource} style={styles.icon} />
          ) : (
            <notification.iconSource width={40} height={40} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF4E9',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationBox: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Jomolhari',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Jomolhari',
  },
  icon: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
});

export default NotificationsScreen;
