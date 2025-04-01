import type React from "react"
import { TouchableOpacity, Text, StyleSheet, type ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface SocialButtonProps {
  title: string
  onPress: () => void
  icon: string
  backgroundColor: string
  textColor: string
  borderColor?: string
  style?: ViewStyle
}

const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  onPress,
  icon,
  backgroundColor,
  textColor,
  borderColor,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor: borderColor || "transparent",
          borderWidth: borderColor ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={20} color={textColor} style={styles.icon} />
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
})

export default SocialButton

