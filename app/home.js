import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet } from "react-native";
let CalendarComponent;

try {
  CalendarComponent = require("react-native-calendars").Calendar;
} catch (error) {
  console.error("Failed to load react-native-calendars. Make sure it is installed.");
}

const PlannerHome = () => {
  const [selectedDate, setSelectedDate] = useState("2025-02-06");
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2025);

  const tasks = {
    "2025-02-06": [
      { time: "1:00 PM", task: "Wash my clothes", color: "#a3c4f3", type: "individual" },
      { time: "4:00 PM", task: "Clean my room", color: "#a3c4f3", type: "individual" },
      { time: "7:00 PM", task: "Playing video games and watching movies with Nut", color: "#f4a3a3", type: "partner" }
    ]
  };

  const fullMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <View style={styles.container}>
      {CalendarComponent ? (
        <CalendarComponent
          current={`${selectedYear}-${(selectedMonthIndex + 1).toString().padStart(2, "0")}-01`}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          onMonthChange={(month) => {
            setSelectedMonthIndex(month.month - 1);
            setSelectedYear(month.year);
          }}
          markedDates={{
            [selectedDate]: {
              selected: true,
              customStyles: {
                container: { backgroundColor: "rgba(255, 107, 107, 0.2)", borderRadius: 20 },
                text: { color: "#ff6b6b", fontWeight: "bold" }
              }
            }
          }}
          markingType={"custom"}
          dayComponent={({ date, state }) => {
            const dateStr = date.dateString;
            const hasIndividualTask = tasks[dateStr]?.some(task => task.type === "individual");
            const hasPartnerTask = tasks[dateStr]?.some(task => task.type === "partner");
            const isSelected = selectedDate === dateStr;

            return (
              <TouchableOpacity onPress={() => setSelectedDate(dateStr)} style={[styles.dayContainer, isSelected && styles.selectedDay]}>
                <Text style={[styles.dayText, state === "disabled" && styles.disabledDay]}>{date.day}</Text>
                <View style={styles.barContainer}>
                  {hasIndividualTask && <View style={[styles.taskBar, { backgroundColor: "#3498db" }]} />}
                  {hasPartnerTask && <View style={[styles.taskBar, { backgroundColor: "#ff6b6b" }]} />}
                </View>
              </TouchableOpacity>
            );
          }}
          renderHeader={() => (
            <TouchableOpacity onPress={() => setMonthPickerVisible(true)}>
              <Text style={styles.header}>
                {fullMonths[selectedMonthIndex]} {selectedYear}
              </Text>
            </TouchableOpacity>
          )}
          theme={{
            todayTextColor: "#00adf5",
            arrowColor: "#ff6b6b",
          }}
          style={{ borderRadius: 10 }}
        />
      ) : (
        <Text style={styles.errorText}>Calendar failed to load. Ensure 'react-native-calendars' is installed.</Text>
      )}

      <Text style={styles.fullDate}>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>

      <FlatList
        data={tasks[selectedDate] || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, { backgroundColor: item.color }]}> 
            <Text style={styles.taskTime}>{item.time}</Text>
            <Text style={styles.taskText}>{item.task}</Text>
          </View>
        )}
      />
      
      <Modal visible={isMonthPickerVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.yearSelector}>
              <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)}><Text style={styles.arrow}>⬆</Text></TouchableOpacity>
              <Text style={styles.yearText}>{selectedYear}</Text>
              <TouchableOpacity onPress={() => setSelectedYear(selectedYear + 1)}><Text style={styles.arrow}>⬇</Text></TouchableOpacity>
            </View>
            <View style={styles.monthGrid}>
              {fullMonths.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => { 
                  setSelectedMonthIndex(index);
                  setMonthPickerVisible(false);
                }} style={styles.monthItem}>
                  <Text style={styles.monthText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setMonthPickerVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fdf1ec" },
  header: { fontSize: 20, textAlign: "center", marginVertical: 10, fontWeight: "bold" },
  fullDate: { fontSize: 18, textAlign: "center", marginVertical: 10, fontWeight: "bold" },
  taskItem: { padding: 10, borderRadius: 10, marginVertical: 5 },
  taskTime: { fontWeight: "bold" },
  taskText: { fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#333", padding: 20, borderRadius: 10, width: 250 },
  closeText: { fontSize: 18, color: "white", textAlign: "center" },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },

  // Date customization
  dayContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 5 },
  dayText: { fontSize: 16 },
  disabledDay: { color: "#d3d3d3" },
  barContainer: { flexDirection: "row", marginTop: 2, justifyContent: "center" },
  taskBar: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2 },
  selectedDay: { backgroundColor: "rgba(255, 107, 107, 0.2)", borderRadius: 20, padding: 8 },
  yearSelector: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  yearText: { fontSize: 20, color: "white" },
  arrow: { fontSize: 20, color: "white", paddingHorizontal: 10 },
  monthGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "100%" },
  monthItem: { width: "30%", alignItems: "center", paddingVertical: 5 },
  monthText: { fontSize: 18, color: "white", textAlign: "center" }
});

export default PlannerHome;
