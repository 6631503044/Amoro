"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

interface CalendarPickerProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  onClose?: () => void
  yearRange?: "birthday" | "activity" // "birthday" shows 100 years back, "activity" shows ±5 years
  visible?: boolean
  title?: string
}

const CalendarPicker = ({
  selectedDate,
  onDateChange,
  onClose,
  yearRange = "activity",
  visible = true,
  title = "Select Date",
}: CalendarPickerProps) => {
  const { theme } = useTheme()

  // Days of the week for calendar
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Months for calendar
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth())
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear())
  const [selectedDay, setSelectedDay] = useState(selectedDate.getDate())
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

    const days = []

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: "", isCurrentMonth: false })
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true })
    }

    return days
  }

  // Generate years for picker
  const generateYears = () => {
    const years = []
    const currentYearValue = new Date().getFullYear()

    if (yearRange === "birthday") {
      // For birthdays, show 100 years back
      for (let i = 0; i < 100; i++) {
        years.push(currentYearValue - i)
      }
    } else {
      // For activities, show ±5 years
      for (let i = -5; i <= 5; i++) {
        years.push(currentYearValue + i)
      }
    }

    return years
  }

  // Handle date selection
  const handleDateSelection = (day: number) => {
    if (day) {
      const newDate = new Date(selectedDate)
      newDate.setFullYear(currentYear)
      newDate.setMonth(currentMonth)
      newDate.setDate(day)

      setSelectedDay(day)
      onDateChange(newDate)
    }
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Handle done button press
  const handleDone = () => {
    if (onClose) onClose()
  }

  return (
    <View style={styles.container}>
      <View style={[styles.calendarContent, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.calendarTitle, { color: theme.colors.text }]}>{title}</Text>

        {/* Calendar header with month/year selection */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          <View style={styles.monthYearSelectors}>
            <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
              <Text style={[styles.calendarMonthYear, { color: theme.colors.text }]}>{MONTHS[currentMonth]}</Text>
            </TouchableOpacity>
            <Text style={[styles.calendarMonthYearSeparator, { color: theme.colors.text }]}> </Text>
            <TouchableOpacity onPress={() => setShowYearPicker(true)}>
              <Text style={[styles.calendarMonthYear, { color: theme.colors.text }]}>{currentYear}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Days of week */}
        <View style={styles.calendarDaysOfWeek}>
          {DAYS.map((day, index) => (
            <Text key={index} style={[styles.calendarDayOfWeek, { color: theme.colors.secondaryText }]}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar days */}
        <View style={styles.calendarDays}>
          {generateCalendarDays().map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarDay,
                item.isCurrentMonth &&
                  item.day === selectedDay &&
                  currentMonth === selectedDate.getMonth() &&
                  currentYear === selectedDate.getFullYear() && {
                    backgroundColor: theme.colors.primary,
                    borderRadius: 20,
                  },
              ]}
              onPress={() => item.isCurrentMonth && handleDateSelection(item.day)}
              disabled={!item.isCurrentMonth}
            >
              <Text
                style={[
                  styles.calendarDayText,
                  { color: item.isCurrentMonth ? theme.colors.text : "transparent" },
                  item.isCurrentMonth &&
                    item.day === selectedDay &&
                    currentMonth === selectedDate.getMonth() &&
                    currentYear === selectedDate.getFullYear() && {
                      color: "#FFFFFF",
                    },
                ]}
              >
                {item.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.calendarButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleDone}
        >
          <Text style={styles.calendarButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.pickerContainer}>
          <TouchableOpacity style={styles.pickerBackdrop} onPress={() => setShowMonthPicker(false)} />
          <View style={[styles.pickerContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, { color: theme.colors.text }]}>Select Month</Text>
              <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerScrollView}>
              {MONTHS.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.pickerItem,
                    currentMonth === index && {
                      backgroundColor: `${theme.colors.primary}20`,
                    },
                  ]}
                  onPress={() => {
                    setCurrentMonth(index)
                    setShowMonthPicker(false)
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      { color: theme.colors.text },
                      currentMonth === index && {
                        color: theme.colors.primary,
                        fontFamily: "Poppins-SemiBold",
                      },
                    ]}
                  >
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.pickerContainer}>
          <TouchableOpacity style={styles.pickerBackdrop} onPress={() => setShowYearPicker(false)} />
          <View style={[styles.pickerContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, { color: theme.colors.text }]}>Select Year</Text>
              <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerScrollView}>
              {generateYears().map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.pickerItem,
                    currentYear === year && {
                      backgroundColor: `${theme.colors.primary}20`,
                    },
                  ]}
                  onPress={() => {
                    setCurrentYear(year)
                    setShowYearPicker(false)
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      { color: theme.colors.text },
                      currentYear === year && {
                        color: theme.colors.primary,
                        fontFamily: "Poppins-SemiBold",
                      },
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  calendarContent: {
    padding: 20,
    borderRadius: 12,
  },
  calendarTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
    textAlign: "center",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  monthYearSelectors: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarMonthYear: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  calendarMonthYearSeparator: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  calendarDaysOfWeek: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calendarDayOfWeek: {
    width: 35,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  calendarDays: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  calendarDay: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  calendarDayText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  calendarButton: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  calendarButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  pickerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  pickerBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContent: {
    width: "80%",
    maxHeight: "60%",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  pickerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  pickerScrollView: {
    maxHeight: 300,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
})

export default CalendarPicker

