import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const AppSettingsScreen = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme, setThemeMode } = useTheme();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activityReminders, setActivityReminders] = useState(true);
  const [partnerUpdates, setPartnerUpdates] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const languages = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Spanish' },
    { id: 'fr', name: 'French' },
    { id: 'de', name: 'German' },
  ];
  
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguages, setShowLanguages] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          App Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Appearance
        </Text>
        
        <View style={[styles.settingsCard, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setThemeMode('light')}
          >
            <View style={styles.settingsItemLeft}>
              <Ionicons name="sunny-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Light Mode
              </Text>
            </View>
            {theme.mode === 'light' && (
              <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setThemeMode('dark')}
          >
            <View style={styles.settingsItemLeft}>
              <Ionicons name="moon-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Dark Mode
              </Text>
            </View>
            {theme.mode === 'dark' && (
              <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setThemeMode('system')}
          >
            <View style={styles.settingsItemLeft}>
              <Ionicons name="phone-portrait-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                System Default
              </Text>
            </View>
            {theme.mode === 'system' && (
              <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>
          Notifications
        </Text>
        
        <View style={[styles.settingsCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.settingsItemSwitch}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Enable Notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: `${theme.colors.primary}80` }}
              thumbColor={notificationsEnabled ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingsItemSwitch}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="alarm-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Activity Reminders
              </Text>
            </View>
            <Switch
              value={activityReminders}
              onValueChange={setActivityReminders}
              trackColor={{ false: '#767577', true: `${theme.colors.primary}80` }}
              thumbColor={activityReminders ? theme.colors.primary : '#f4f3f4'}
              disabled={!notificationsEnabled}
            />
          </View>
          
          <View style={styles.settingsItemSwitch}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Partner Updates
              </Text>
            </View>
            <Switch
              value={partnerUpdates}
              onValueChange={setPartnerUpdates}
              trackColor={{ false: '#767577', true: `${theme.colors.primary}80` }}
              thumbColor={partnerUpdates ? theme.colors.primary : '#f4f3f4'}
              disabled={!notificationsEnabled}
            />
          </View>
          
          <View style={styles.settingsItemSwitch}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="volume-high-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Sound
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#767577', true: `${theme.colors.primary}80` }}
              thumbColor={soundEnabled ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>
          Language
        </Text>
        
        <View style={[styles.settingsCard, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setShowLanguages(!showLanguages)}
          >
            <View style={styles.settingsItemLeft}>
              <Ionicons name="language-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Language
              </Text>
            </View>
            <View style={styles.languageSelector}>
              <Text style={[styles.selectedLanguage, { color: theme.colors.secondaryText }]}>
                {languages.find(lang => lang.id === selectedLanguage)?.name}
              </Text>
              <Ionicons 
                name={showLanguages ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={theme.colors.secondaryText} 
              />
            </View>
          </TouchableOpacity>
          
          {showLanguages && (
            <View style={styles.languageOptions}>
              {languages.map(lang => (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.languageOption,
                    selectedLanguage === lang.id && {
                      backgroundColor: `${theme.colors.primary}20`,
                    },
                  ]}
                  onPress={() => {
                    setSelectedLanguage(lang.id);
                    setShowLanguages(false);
                  }}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      { color: theme.colors.text },
                      selectedLanguage === lang.id && {
                        color: theme.colors.primary,
                        fontFamily: 'Poppins-SemiBold',
                      },
                    ]}
                  >
                    {lang.name}
                  </Text>
                  {selectedLanguage === lang.id && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>
          About
        </Text>
        
        <View style={[styles.settingsCard, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Version
              </Text>
            </View>
            <Text style={[styles.versionText, { color: theme.colors.secondaryText }]}>
              1.0.0
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Terms of Service
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="shield-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                Privacy Policy
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondaryText} />
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 15,
  },
  settingsCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
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
  settingsItemSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedLanguage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginRight: 5,
  },
  languageOptions: {
    padding: 10,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
  },
  languageOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});

export default AppSettingsScreen;