import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    TouchableWithoutFeedback,
    TextInput,
    Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import { Expense } from '../context/ExpensesContext';
import GlobalHandler from '../utils/GlobalHandler';

export default function EditExpenseScreen() {
    const route = useRoute();
    const { expense } = route.params as {expense: Expense};
    console.log("EditExpenseScreen - id:", expense.id, ", title:", expense.title, ", amount:", expense.amount, ", category:", expense.category, ", description:", expense.description, ", date:", expense.date  );

    const navigation = useNavigation();
    const amt = expense.amount ? expense.amount.toString() : '';
    //const [id, setId] = useState(expense.id || "");
    const [item, setItem] = useState(expense.title || "");
    const [amount, setAmount] = useState(amt);
    const [category, setCategory] = useState(expense.category || "");
    const [description, setDescription] = useState(expense.description || "");

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit expense</Text>
                <View style={{ width: 22 }} />
            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={{ margin: 20 }}>
                    {/* Date */}
                    <Text style={styles.dateText}>{expense.date?.toLocaleDateString()}</Text>

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
                        const newExpense: Expense = { id: expense.id, title: item, amount: Number(amount) || 0, category: "Other", description: "Added via GlobalHandler", date: new Date() };
                        const updateExpense = GlobalHandler.updateExpense;
                        if (updateExpense) {
                            updateExpense(newExpense);
                        }
                        navigation.goBack()
                    }}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>Update entry</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
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