import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const PartnerSettingsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const handleRemovePartner = () => {
    Alert.alert(
      'Remove Partner',
      'Are you sure you want to remove your partner? This will unlink your accounts.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // Handle partner removal logic here
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Partner Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.partnerSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.partnerImage}
          />
          <Text style={[styles.partnerName, { color: theme.colors.text }]}>
            Jane Doe
          </Text>
          <Text style={[styles.partnerEmail, { color: theme.colors.secondaryText }]}>
            jane@example.com
          </Text>
        </View>
        
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={[styles.settingsItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.settingsItemLeft}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Activity Notifications
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.settingsItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.settingsItemLeft}>
              <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Calendar Sharing
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.settingsItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.settingsItemLeft}>
              <Ionicons name="heart-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Relationship Anniversary
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.removeButton, { backgroundColor: theme.colors.card }]}
            onPress={handleRemovePartner}
          >
            <Ionicons name="person-remove-outline" size={24} color="red" />
            <Text style={styles.removeText}>Remove Partner</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  partnerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  partnerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  partnerName: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 5,
  },
  partnerEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  settingsSection: {
    marginBottom: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginLeft: 15,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  removeText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: 'red',
    marginLeft: 10,
  },
});

export default PartnerSettingsScreen;