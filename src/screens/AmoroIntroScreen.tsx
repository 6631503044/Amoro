"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext"
import Button from "../components/Button"

const { width, height } = Dimensions.get("window")

const introSlides = [
  {
    id: "1",
    title: "Welcome to Amoro",
    description: "The perfect calendar app for couples to plan and share activities together.",
    image: { uri: "/placeholder.svg?height=300&width=300" },
  },
  {
    id: "2",
    title: "Plan Together",
    description: "Create and manage activities with your partner. Stay in sync with each other's schedules.",
    image: { uri: "/placeholder.svg?height=300&width=300" },
  },
  {
    id: "3",
    title: "Share Memories",
    description: "Rate and review your activities together. Create lasting memories of your time together.",
    image: { uri: "/placeholder.svg?height=300&width=300" },
  },
  {
    id: "4",
    title: "Get Started",
    description: "Sign up now and invite your partner to join you on this journey!",
    image: { uri: "/placeholder.svg?height=300&width=300" },
  },
]

const AmoroIntroScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: theme.colors.secondaryText }]}>{item.description}</Text>
      </View>
    )
  }

  const handleNext = () => {
    if (currentIndex < introSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true })
      setCurrentIndex(currentIndex + 1)
    } else {
      navigation.navigate("Auth" as never)
    }
  }

  const handleSkip = () => {
    navigation.navigate("Auth" as never)
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: theme.colors.primary }]}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={introSlides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width)
          setCurrentIndex(index)
        }}
      />

      <View style={styles.pagination}>
        {introSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: index === currentIndex ? theme.colors.primary : theme.colors.border },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={currentIndex === introSlides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          style={{ width: "80%" }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  slide: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 40,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
})

export default AmoroIntroScreen