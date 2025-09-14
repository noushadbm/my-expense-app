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
import { createEntry, deleteEntry, getAllEntries } from "../db/init";

export default function ExpenseListScreen() {

    const db = useSQLiteContext();

    useEffect(() => {
        console.log('Database is ready and available');
        // You could even run a simple query to verify tables exist
        // db.getAllAsync('SELECT * FROM expenses')
        //   .then(result => console.log('Tables verified:', result));
        // Load initial expenses from DB
        console.log("activeTab:", activeTab, ", selectedDate:", selectedDate);
        getAllEntries(selectedDate, activeTab).then((entries) => {
            console.log("Loaded entries from DB:", entries);
            // Map entries to match the state structure
            const formattedEntries = entries.map(entry => ({
                id: entry.id?.toString() || '',
                name: entry.title,
                amount: entry.amount
            }));
            setExpenses(formattedEntries);
        });
    }, [db]);

    //const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState("Daily");
    const [expenses, setExpenses] = useState([
        { id: "100", name: "Viva Supermarket", amount: 28.0 },
    ]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    //const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const setTabSelection = (tab: string) => {
        console.log("Setting tab to:", tab);
        //setExpenses([]); // Clear the array
        setActiveTab(tab);
        getAllEntries(selectedDate, tab).then((entries) => {
            console.log("Loaded entries from DB for tab", tab, ":", entries);
            // Map entries to match the state structure
            const formattedEntries = entries.map(entry => ({
                id: entry.id?.toString() || '',
                name: entry.title,
                amount: entry.amount
            }));
            setExpenses(formattedEntries);
        })
        
    }

    const removeEntry = (id: string) => {
        deleteEntry(id).then(() => {
            var updatedExpenses = expenses.filter(expense => expense.id !== id);
            setExpenses(updatedExpenses);
        }); 
    }

    const addExpense = (expense: Expense) => {
        createEntry(expense, selectedDate).then((newExpense: any) => {
            console.log("New expense added:", newExpense);
            var updatedExpenses = [...expenses];
            updatedExpenses.push({ id: newExpense.id, name: newExpense.title, amount: newExpense.amount });
            //console.log("Expense saved to DB:",updatedExpenses);
            setExpenses(updatedExpenses);
        }); // Save to DB
    }

    const onDateChange = (newDate: Date) => {
        console.log("Date changed to:", newDate);
        setSelectedDate(newDate);
        getAllEntries(newDate, activeTab).then((entries) => {
            console.log("Loaded entries from DB:", entries);
            // Map entries to match the state structure
            const formattedEntries = entries.map(entry => ({
                id: entry.id?.toString() || '',
                name: entry.title,
                amount: entry.amount
            }));
            setExpenses(formattedEntries);
        });
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

            <ExpenseListPanel activeTab={activeTab} expenses={expenses} removeEntry={removeEntry}
            selectedDate={selectedDate} onDateChange={onDateChange} />

            {/* Floating Button */}
            {activeTab === "Daily" && <FloatingActionButton addExpense={addExpense} />}
            
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

