import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import GlobalHandler from "../utils/GlobalHandler";

export default function AddExpenseScreen() {

    const navigation = useNavigation();
    const [item, setItem] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Add expense</Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={{ margin: 20 }}>
                {/* Date */}
                <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>

                {/* Form */}
                <TextInput
                    style={styles.input}
                    placeholder="Expense Item"
                    value={item}
                    onChangeText={setItem}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />

                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={category}
                        onValueChange={(value) => setCategory(value)}
                    >
                        <Picker.Item label="Category" value="" />
                        <Picker.Item label="Food" value="Food" />
                        <Picker.Item label="Transport" value="Transport" />
                        <Picker.Item label="Shopping" value="Shopping" />
                        <Picker.Item label="Other" value="Other" />
                    </Picker>
                </View>

                <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Description"
                    multiline
                    value={description}
                    onChangeText={setDescription}
                />

                <TouchableOpacity style={styles.addBtn} onPress={() => {
                    var newExpense = {id: Math.random().toString(), title: "New Expense", amount: 10.0};
                    const addExpense = GlobalHandler.addExpense;
                    if (addExpense) {
                        addExpense(newExpense);
                    }
                    navigation.goBack()
                    }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Add entry</Text>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2196F3",
        padding: 16,
        justifyContent: "space-between",
    },
    headerText: { color: "white", fontSize: 18, fontWeight: "bold" },
    dateText: {
        textAlign: "center",
        marginVertical: 16,
        fontSize: 16,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginVertical: 8,
    },
    addBtn: {
        backgroundColor: "#2196F3",
        padding: 14,
        alignItems: "center",
        borderRadius: 8,
        marginTop: 20,
    },
});