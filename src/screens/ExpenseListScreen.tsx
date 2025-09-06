import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
} from "react-native";
import { ExpensesContext, Expense } from "../context/ExpensesContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"
import ExpenseListPanel from "./components/ExpenseListPanel";
import FloatingActionButton from "./components/FloatingActionButton";
import { useSQLiteContext } from 'expo-sqlite';

export default function ExpenseListScreen() {

    const db = useSQLiteContext();

    useEffect(() => {
        console.log('Database is ready and available');
        // You could even run a simple query to verify tables exist
        db.getAllAsync('SELECT name FROM sqlite_master WHERE type="table"')
          .then(result => console.log('Tables verified:', result));
    }, [db]);

    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState("Daily");
    const [expenses, setExpenses] = useState([
        { id: "1", name: "Viva Supermarket", amount: 28.0 },
        { id: "2", name: "Lulu Express", amount: 28.0 },
        { id: "3", name: "Nits House", amount: 90.0 },
        { id: "4", name: "Shawarma", amount: 7.0 },
    ]);

    //const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const setTabSelection = (tab: string) => {
        console.log("Setting tab to:", tab);
        //setExpenses([]); // Clear the array
        setActiveTab(tab);
    }

    const removeEntry = (id: string) => {
        var updatedExpenses = expenses.filter(expense => expense.id !== id);
        setExpenses(updatedExpenses);
    }

    const addExpense = (expense: Expense) => {
        var updatedExpenses = [...expenses];
        updatedExpenses.push({ id: expense.id, name: expense.title, amount: expense.amount });
        setExpenses(updatedExpenses);
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Expense view.</Text>
                <Ionicons name="settings-outline" size={22} color="white" />
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {["Daily", "Monthly", "Yearly"].map((tab) => (
                    <TouchableOpacity key={tab} onPress={() => setTabSelection(tab)}>
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ExpenseListPanel activeTab={activeTab} expenses={expenses} removeEntry={removeEntry} />

            {/* Floating Button */}
            <FloatingActionButton addExpense={addExpense} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    header: {
        backgroundColor: "#2196F3",
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    tabRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#2196F3",
        paddingVertical: 8,
    },
    tabText: {
        color: "white",
        fontSize: 16,
        opacity: 0.7,
    },
    activeTabText: {
        fontWeight: "bold",
        opacity: 1,
        textDecorationLine: "underline",
    },
    dateCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2196F3",
        margin: 12,
        borderRadius: 10,
        padding: 16,
        justifyContent: "space-between",
    },
    dateText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    dayText: {
        color: "white",
        fontSize: 14,
    },
    totalText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    expenseItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 16,
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 8,
        elevation: 2,
    },
    expenseName: {
        fontSize: 16,
        color: "#333",
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: "bold",
    },
    fab: {
        backgroundColor: "#2196F3",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 20,
        bottom: 20,
        elevation: 4,
    },
});

