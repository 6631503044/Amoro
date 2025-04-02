"use client"

import { View, StyleSheet, TouchableOpacity, Modal } from "react-native"
import { useTheme } from "../context/ThemeContext"
import CalendarPicker from "./CalendarPicker"

interface CalendarPickerModalProps {
  visible: boolean
  onClose: () => void
  selectedDate: Date
  onDateChange: (date: Date) => void
  yearRange?: "birthday" | "activity"
  title?: string
}

const CalendarPickerModal = ({
  visible,
  onClose,
  selectedDate,
  onDateChange,
  yearRange = "activity",
  title = "Select Date",
}: CalendarPickerModalProps) => {
  const { theme } = useTheme()

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <CalendarPicker
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            onClose={onClose}
            yearRange={yearRange}
            title={title}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 0,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
  },
})

export default CalendarPickerModal

