"use client"
import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"

// Mock data for past activities
const PAST_ACTIVITIES = [
  {
    id: "1",
    title: "Dinner at Italian Restaurant",
    date: "2023-06-10",
    type: "couple",
    tag: "date",
    emoji: "🍝",
    reviewed: true,
    rating: 5,
  },
  {
    id: "2",
    title: "Movie Night",
    date: "2023-06-08",
    type: "couple",
    tag: "entertainment",
    emoji: "🎬",
    reviewed: true,
    rating: 4,
  },
  {
    id: "3",
    title: "Beach Day",
    date: "2023-06-05",
    type: "couple",
    tag: "travel",
    emoji: "🏖️",
    reviewed: false,
  },
  {
    id: "4",
    title: "Hiking Trip",
    date: "2023-06-01",
    type: "couple",
    tag: "exercise",
    emoji: "🥾",
    reviewed: true,
    rating: 5,
  },
  {
    id: "5",
    title: "Cooking Together",
    date: "2023-05-28",
    type: "couple",
    tag: "food",
    emoji: "👨‍🍳",
    reviewed: true,
    rating: 3,
  },
  {
    id: "6",
    title: "Meditation Session",
    date: "2023-05-25",
    type: "single",
    tag: "wellness",
    emoji: "🧘",
    reviewed: true,
    rating: 5,
  },
  {
    id: "7",
    title: "Reading a Book",
    date: "2023-05-22",
    type: "single",
    tag: "entertainment",
    emoji: "📚",
    reviewed: true,
    rating: 4,
  },
  {
    id: "8",
    title: "Solo Hike",
    date: "2023-05-20",
    type: "single",
    tag: "exercise",
    emoji: "🥾",
    reviewed: false,
  },
]

type FilterType = "day" | "week" | "month"
type ActivityType = "all" | "single" | "couple"

const MoodsScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { t, formatDate } = useLanguage()
  const [timeFilter, setTimeFilter] = useState<FilterType>("day")
  const [typeFilter, setTypeFilter] = useState<ActivityType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const filteredActivities = PAST_ACTIVITIES.filter((activity) => {
    // Filter by search query
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by activity type (single/couple)
    const matchesType = typeFilter === "all" || activity.type === typeFilter

    return matchesSearch && matchesType
  })

  const renderRatingStars = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "heart" : "heart-outline"}
            size={16}
            color={theme.colors.primary}
          />
        ))}
      </View>
    )
  }

  const renderActivityItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.activityItem, { backgroundColor: theme.colors.card }]}
        onPress={() => navigation.navigate("ActivityReview" as never, { activityId: item.id } as never)}
      >
        <View style={styles.activityHeader}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
          <View style={styles.activityDetails}>
            <Text style={[styles.activityTitle, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={[styles.activityDate, { color: theme.colors.secondaryText }]}>
              {formatDate(new Date(item.date), "dateFormat")}
            </Text>
            <View style={styles.tagContainer}>
              <Text style={[styles.tagText, { color: theme.colors.secondaryText }]}>
                {item.type === "single" ? t("single") : t("partner")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.activityFooter}>
          {item.reviewed ? (
            renderRatingStars(item.rating)
          ) : (
            <TouchableOpacity
              style={[styles.reviewButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate("AddReview" as never, { activityId: item.id } as never)}
            >
              <Text style={styles.reviewButtonText}>{t("addReview")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("moods")}</Text>
      </View>

      <View style={styles.searchAndFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder={t("searchActivities")}
            placeholderTextColor={theme.colors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={[styles.filterIconButton, typeFilter !== "all" && { backgroundColor: `${theme.colors.primary}20` }]}
          onPress={() => setDropdownVisible(true)}
        >
          <Ionicons name="funnel" size={20} color={typeFilter !== "all" ? theme.colors.primary : theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownVisible(false)}>
          <View
            style={[
              styles.dropdownMenu,
              {
                backgroundColor: theme.colors.card,
                top: 130, // Position below the filter icon
                right: 20,
              },
            ]}
          >
            <View style={styles.dropdownHeader}>
              <Text style={[styles.dropdownTitle, { color: theme.colors.text }]}>{t("filterActivities")}</Text>
            </View>

            <TouchableOpacity
              style={[styles.dropdownItem, typeFilter === "all" && { backgroundColor: `${theme.colors.primary}20` }]}
              onPress={() => {
                setTypeFilter("all")
                setDropdownVisible(false)
              }}
            >
              <Ionicons
                name="apps"
                size={18}
                color={typeFilter === "all" ? theme.colors.primary : theme.colors.text}
                style={styles.dropdownItemIcon}
              />
              <Text
                style={[
                  styles.dropdownItemText,
                  { color: typeFilter === "all" ? theme.colors.primary : theme.colors.text },
                ]}
              >
                {t("allActivities")}
              </Text>
              {typeFilter === "all" && (
                <Ionicons name="checkmark" size={18} color={theme.colors.primary} style={styles.dropdownItemCheck} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdownItem, typeFilter === "single" && { backgroundColor: `${theme.colors.primary}20` }]}
              onPress={() => {
                setTypeFilter("single")
                setDropdownVisible(false)
              }}
            >
              <Ionicons
                name="person"
                size={18}
                color={typeFilter === "single" ? theme.colors.primary : theme.colors.text}
                style={styles.dropdownItemIcon}
              />
              <Text
                style={[
                  styles.dropdownItemText,
                  { color: typeFilter === "single" ? theme.colors.primary : theme.colors.text },
                ]}
              >
                {t("singleActivities")}
              </Text>
              {typeFilter === "single" && (
                <Ionicons name="checkmark" size={18} color={theme.colors.primary} style={styles.dropdownItemCheck} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdownItem, typeFilter === "couple" && { backgroundColor: `${theme.colors.primary}20` }]}
              onPress={() => {
                setTypeFilter("couple")
                setDropdownVisible(false)
              }}
            >
              <Ionicons
                name="people"
                size={18}
                color={typeFilter === "couple" ? theme.colors.primary : theme.colors.text}
                style={styles.dropdownItemIcon}
              />
              <Text
                style={[
                  styles.dropdownItemText,
                  { color: typeFilter === "couple" ? theme.colors.primary : theme.colors.text },
                ]}
              >
                {t("partnerActivities")}
              </Text>
              {typeFilter === "couple" && (
                <Ionicons name="checkmark" size={18} color={theme.colors.primary} style={styles.dropdownItemCheck} />
              )}
            </TouchableOpacity>

            <View style={styles.dropdownFooter}>
              <TouchableOpacity
                style={[styles.clearButton, { borderColor: theme.colors.primary }]}
                onPress={() => {
                  setTypeFilter("all")
                  setDropdownVisible(false)
                }}
              >
                <Text style={[styles.clearButtonText, { color: theme.colors.primary }]}>{t("clearFilter")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>{t("reviewAndRate")}</Text>

      {/* Time filter (Day/Week/Month) */}
      <View style={styles.timeFilterContainer}>
        <TouchableOpacity
          style={[styles.timeFilterButton, timeFilter === "day" && { backgroundColor: theme.colors.primary }]}
          onPress={() => setTimeFilter("day")}
        >
          <Text style={[styles.filterButtonText, { color: timeFilter === "day" ? "#FFFFFF" : theme.colors.text }]}>
            {t("day")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timeFilterButton, timeFilter === "week" && { backgroundColor: theme.colors.primary }]}
          onPress={() => setTimeFilter("week")}
        >
          <Text style={[styles.filterButtonText, { color: timeFilter === "week" ? "#FFFFFF" : theme.colors.text }]}>
            {t("week")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timeFilterButton, timeFilter === "month" && { backgroundColor: theme.colors.primary }]}
          onPress={() => setTimeFilter("month")}
        >
          <Text style={[styles.filterButtonText, { color: timeFilter === "month" ? "#FFFFFF" : theme.colors.text }]}>
            {t("month")}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={renderActivityItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.secondaryText }]}>{t("noActivitiesFound")}</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  searchAndFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdownMenu: {
    position: "absolute",
    width: 250,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
  },
  dropdownHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  dropdownTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  dropdownItemIcon: {
    marginRight: 12,
  },
  dropdownItemText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    flex: 1,
  },
  dropdownItemCheck: {
    marginLeft: 8,
  },
  dropdownFooter: {
    padding: 12,
    alignItems: "center",
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  clearButtonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  timeFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    marginHorizontal: 5,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  activityItem: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  emoji: {
    fontSize: 24,
  },
  activityDetails: {
    flex: 1,
    justifyContent: "center",
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 5,
  },
  activityDate: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  tagContainer: {
    flexDirection: "row",
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  activityFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  reviewButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reviewButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
})

export default MoodsScreen

