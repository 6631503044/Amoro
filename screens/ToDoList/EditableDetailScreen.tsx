import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ArrowLeft, Save } from "lucide-react-native";

type RootStackParamList = {
    EditableDetailScreen: { task: any };
};

type EditableDetailScreenRouteProp = RouteProp<RootStackParamList, "EditableDetailScreen">;
type NavigationProp = StackNavigationProp<RootStackParamList, "EditableDetailScreen">;

const EditableDetailScreen = () => {
    const route = useRoute<EditableDetailScreenRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { task } = route.params;

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [startTime, setStartTime] = useState(task.startTime);
    const [endTime, setEndTime] = useState(task.endTime);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Edit Task</Text>
            </View>

            {/* Editable Fields */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} />

                <Text style={styles.label}>Description</Text>
                <TextInput style={styles.input} value={description} onChangeText={setDescription} />

                <Text style={styles.label}>Start Time</Text>
                <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} />

                <Text style={styles.label}>End Time</Text>
                <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
                <Save size={20} color="white" />
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EditableDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDF6F0",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 15,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#5063BF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        marginLeft: 8,
    },
});
