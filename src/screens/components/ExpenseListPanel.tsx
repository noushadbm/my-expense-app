import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"

export default function ExpenseListPanel({activeTab, expenses, removeEntry, selectedDate, onDateChange}: {activeTab: string, expenses: { id: string; name: string; amount: number }[], removeEntry?: (id: string) => void, selectedDate : Date, onDateChange?: (newDate: Date) => void}) {
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(selectedDate);
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

    const handleLongPress = (item: { id: string; name: string; amount: number }) => {
        setSelectedItemId(item.id); // Set the selected item ID
    };

    const handleDelete = (id: string) => {
        console.log("Delete item with ID:", id);
        removeEntry && removeEntry(id);
        setSelectedItemId(null);
    };

    const handleEdit = (id: string) => {
        console.log("Edit item with ID:", id);
        // Add your edit logic here
    };

    const cancelOperation = (id: string) => {
        console.log("Cancel item with ID:", id);
        setSelectedItemId(null);
    };

    const gotoPrevDay = () => {
        console.log("Previous day clicked!");
        // your logic here
        const prevDate = new Date(selectedDate);
        prevDate.setDate(selectedDate.getDate() - 1);
        onDateChange && onDateChange(prevDate);
    }

    const gotoNextDay = () => {
        console.log("Next day clicked!");
        // your logic here
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + 1);
        onDateChange && onDateChange(nextDate);
    }

    return (
        <>

            {/* Date + Total */}
            <View style={styles.dateCard}>
                <TouchableOpacity>
                    <Ionicons name="chevron-back" size={22} color="white" onPress={gotoPrevDay}/>
                </TouchableOpacity>

                <View>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                    <Text style={styles.dayText}>{dayName}</Text>
                </View>

                <Text style={styles.totalText}>{total.toFixed(2)}</Text>

                <TouchableOpacity>
                    <Ionicons name="chevron-forward" size={22} color="white" onPress={gotoNextDay}/>
                </TouchableOpacity>
            </View>

            {/* Expense List */}
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.expenseItem}
                        onLongPress={() => handleLongPress(item)}
                    >
                        <View style={styles.expenseItemContent}>
                            {selectedItemId === item.id && (
                                <View style={styles.iconCancelContainer}>
                                    <TouchableOpacity onPress={() => cancelOperation(item.id)}>
                                        <Ionicons name="close-circle-outline" size={20} color="gray" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <Text style={styles.expenseName}>{item.name}</Text>
                            <Text style={styles.expenseAmount}>{item.amount.toFixed(2)}</Text>
                            {/* Conditionally render icons for the selected item */}
                            {selectedItemId === item.id && (
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity onPress={() => handleEdit(item.id)}>
                                        <Ionicons name="create-outline" size={20} color="gray" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                        <Ionicons name="trash-outline" size={20} color="red" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                style={{ marginTop: 10 }}
            />
        </>
    );

}

const styles = StyleSheet.create({
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
    expenseItemContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
    iconContainer: {
        flexDirection: "row",
        marginLeft: 10,
    },
    iconCancelContainer: {
        flexDirection: "row",
        marginRight: 10,
    },
    expenseName: {
        fontSize: 16,
        color: "#333",
        flex: 1,
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: "bold",
    },
});