import React from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Sample Data
const moods = [
  { id: "1", title: "Go to gym", location: "MFU gym", time: "January 20th at 9:00 AM", emoji: "😍", color: "#FFCDD2" },
  { id: "2", title: "EATTT Shabu", location: "OKShabu", time: "January 20th at 12:00 PM", emoji: "😊", color: "#FFEBEE" },
  { id: "3", title: "House of the Dragon", location: "At My Room 🏠", time: "January 20th at 2:00 AM", emoji: "😑", color: "#E3F2FD" },
  { id: "4", title: "Study", location: "MFU Library 📚", time: "January 20th at 4:00 AM", emoji: "📖", color: "#C5CAE9" },
  { id: "5", title: "Exercise", location: "Singha Park ❤️", time: "January 20th at 5:00 AM", emoji: "💪", color: "#FFCDD2" },
];

const MoodBoardScreen = () => {
  return (
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Review Dashboard</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#999" />
          <Ionicons name="search" size={20} color="#333" style={styles.searchIcon} />
          <Ionicons name="person-circle" size={24} color="#333" style={styles.profileIcon} />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}><Text style={styles.filterText}>Day</Text></TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Week</Text></TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Month</Text></TouchableOpacity>
        </View>

        {/* Mood List */}
        <FlatList
            data={moods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={[styles.moodCard, { backgroundColor: item.color }]}>
                  <Text style={styles.moodEmoji}>{item.emoji}</Text>
                  <View style={styles.moodDetails}>
                    <Text style={styles.moodTitle}>{item.title}</Text>
                    <Text style={styles.moodLocation}>{item.location}</Text>
                    <Text style={styles.moodTime}>{item.time}</Text>
                  </View>
                </View>
            )}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF6F0", paddingHorizontal: 20, paddingTop: 50 },
  header: { fontSize: 22, fontWeight: "bold", color: "#333" },
  searchContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 10, elevation: 3 },
  searchInput: { flex: 1, padding: 8, fontSize: 16 },
  searchIcon: { marginRight: 10 },
  profileIcon: { marginLeft: 5 },
  filterTabs: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10, backgroundColor: "#ddd" },
  activeFilter: { backgroundColor: "#6787E7" },
  filterText: { fontSize: 14, color: "#fff" },
  moodCard: { flexDirection: "row", padding: 15, borderRadius: 15, marginVertical: 8, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  moodEmoji: { fontSize: 30, marginRight: 15 },
  moodDetails: { flex: 1 },
  moodTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  moodLocation: { fontSize: 14, color: "#666" },
  moodTime: { fontSize: 12, color: "#999" },
});

export default MoodBoardScreen;
