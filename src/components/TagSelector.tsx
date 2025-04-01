import React, { useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from "react-native"
import { useTheme } from "../context/ThemeContext"

interface Tag {
  id: string
  name: string
  emoji: string
}

interface TagSelectorProps {
  tags: Tag[]
  selectedTagId: string | null
  onSelectTag: (tagId: string | null) => void
}

const TagSelector: React.FC<TagSelectorProps> = ({ tags, selectedTagId, onSelectTag }) => {
  const { theme } = useTheme()
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollX = useRef(new Animated.Value(0)).current

  // Calculate indicator position based on scroll
  const indicatorWidth = 100 / (Math.ceil(tags.length / 3))
  const indicatorPosition = scrollX.interpolate({
    inputRange: [0, 300],
    outputRange: ["0%", `${indicatorWidth}%`],
    extrapolate: "clamp",
  })

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            style={[
              styles.tag,
              { borderColor: theme.colors.border },
              selectedTagId === tag.id && { backgroundColor: `${theme.colors.primary}20` },
            ]}
            onPress={() => onSelectTag(selectedTagId === tag.id ? null : tag.id)}
          >
            <Text style={styles.tagEmoji}>{tag.emoji}</Text>
            <Text
              style={[
                styles.tagName,
                { color: theme.colors.text },
                selectedTagId === tag.id && { color: theme.colors.primary },
              ]}
            >
              {tag.name}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
      
      {/* Scroll indicator */}
      <View style={[styles.scrollIndicatorContainer, { backgroundColor: theme.colors.border }]}>
        <Animated.View 
          style={[
            styles.scrollIndicator, 
            { 
              backgroundColor: theme.colors.primary,
              width: `${indicatorWidth}%`,
              transform: [{ translateX: Animated.multiply(scrollX, indicatorWidth / 300) }]
            }
          ]} 
        />
      </View>
      
      {/* Fade gradient to indicate more content */}
      {tags.length > 3 && (
        <View style={styles.fadeGradient} pointerEvents="none">
          <View style={[styles.fadeEffect, { backgroundColor: `${theme.colors.background}00` }]} />
          <View style={[styles.fadeEffect, { backgroundColor: theme.colors.background }]} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    position: "relative",
  },
  tagsContainer: {
    paddingRight: 40, // Extra padding to show partial visibility of next items
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  tagEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  tagName: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  scrollIndicatorContainer: {
    height: 4,
    borderRadius: 2,
    marginTop: 5,
    marginBottom: 15,
    width: "100%",
    position: "relative",
    opacity: 0.3,
  },
  scrollIndicator: {
    height: 4,
    borderRadius: 2,
    position: "absolute",
  },
  fadeGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 20,
    width: 40,
    flexDirection: "row",
    pointerEvents: "none",
  },
  fadeEffect: {
    flex: 1,
  },
})

export default TagSelector
