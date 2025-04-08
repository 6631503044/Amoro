"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList, ImageBackground } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext"
import Button from "../components/Button"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../navigation/RootNavigator"

const { width, height } = Dimensions.get("window")

type IntroSlide = {
  id: string
  title: string
  description: string
  backgroundImage: any
}

const introSlides: IntroSlide[] = [
  {
    id: "1",
    title: "Welcome to Amoro",
    description: "The perfect calendar app for couples to plan and share activities together.",
    backgroundImage: require("../../assets/img/1.png"),
  },
  {
    id: "2",
    title: "Plan Together",
    description: "Create and manage activities with your partner. Stay in sync with each other's schedules.",
    backgroundImage: require("../../assets/img/2.png"),
  },
  {
    id: "3",
    title: "Share Memories",
    description: "Rate and review your activities together. Create lasting memories of your time together.",
    backgroundImage: require("../../assets/img/3.png"),
  },
  {
    id: "4",
    title: "Get Started",
    description: "Sign up now and invite your partner to join you on this journey!",
    backgroundImage: require("../../assets/img/2.png"),
  },
]

type NavigationProp = StackNavigationProp<RootStackParamList>

const AmoroIntroScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const { theme } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList<IntroSlide>>(null)

  const renderItem = ({ item }: { item: IntroSlide }) => {
    return (
      <ImageBackground 
        source={item.backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.slide}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={[styles.description, { color: theme.colors.secondaryText }]}>{item.description}</Text>
          </View>
        </View>
      </ImageBackground>
    )
  }

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    })
  }

  const handleNext = () => {
    if (currentIndex < introSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true })
      setCurrentIndex(currentIndex + 1)
    } else {
      // Navigate to Auth screen and reset navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      })
    }
  }

  return (
    <View style={styles.container}>
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
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000000",
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 40,
    color: "#333333",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
    position: "absolute",
    bottom: 100,
    width: "100%",
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    width: "100%",
  },
})

export default AmoroIntroScreen

