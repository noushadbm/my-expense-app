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
import { formatDateAndDay } from "../../utils/TimeUtils";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    EditExpenseScreen: { id: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ExpenseListPanel({ activeTab, expenses, removeEntry, selectedDate, onDateChange }: { activeTab: string, expenses: { id: string; name: string; amount: number }[], removeEntry?: (id: string) => void, selectedDate: Date, onDateChange?: (newDate: Date) => void }) {
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp>();

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const {formattedDate, dayName} = formatDateAndDay(activeTab, selectedDate);

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
        (navigation as any).navigate('EditExpense', {id: id} );
    };

    const cancelOperation = (id: string) => {
        console.log("Cancel item with ID:", id);
        setSelectedItemId(null);
    };

    const gotoPrevDayMonthYear = () => {
        console.log("Previous day clicked:", activeTab);
        // your logic here
        const prevDate = new Date(selectedDate);
        if (activeTab === "Daily") {
            prevDate.setDate(selectedDate.getDate() - 1);
            onDateChange && onDateChange(prevDate);
        }

        if (activeTab === "Monthly") {
            prevDate.setMonth(selectedDate.getMonth() - 1);
            onDateChange && onDateChange(prevDate);
            return;

        }
        if (activeTab === "Yearly") {
            prevDate.setFullYear(selectedDate.getFullYear() - 1);
            onDateChange && onDateChange(prevDate);
            return;
        }
    }

    const changeDate = (direction: 1 | -1) => {
        const newDate = new Date(selectedDate);
        if (activeTab === "Daily") newDate.setDate(newDate.getDate() + direction);
        if (activeTab === "Monthly") newDate.setMonth(newDate.getMonth() + direction);
        if (activeTab === "Yearly") newDate.setFullYear(newDate.getFullYear() + direction);
        onDateChange?.(newDate);
    };

    return (
        <>

            {/* Date + Total */}
            <View style={styles.dateCard}>
                <TouchableOpacity onPress={() => changeDate(-1)}>
                    <Ionicons name="chevron-back" size={22} color="white" />
                </TouchableOpacity>

                <View>
                    <Text
                        style={[
                            styles.dateText,
                            activeTab === "Monthly" && { fontSize: 20 },
                            activeTab === "Yearly" && { fontSize: 22 },
                        ]}
                    >
                        {formattedDate}
                    </Text>
                    {dayName !== "" && <Text style={styles.dayText}>{dayName}</Text>}
                </View>

                <Text style={styles.totalText}>{total.toFixed(2)}</Text>

                <TouchableOpacity onPress={() => changeDate(1)}>
                    <Ionicons name="chevron-forward" size={22} color="white" />
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
                            {selectedItemId === item.id && activeTab === "Daily" && (
                                <View style={styles.iconCancelContainer}>
                                    <TouchableOpacity onPress={() => cancelOperation(item.id)}>
                                        <Ionicons name="close-circle-outline" size={20} color="gray" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <Text style={styles.expenseName}>{item.name}</Text>
                            <Text style={styles.expenseAmount}>{item.amount.toFixed(2)}</Text>
                            {/* Conditionally render icons for the selected item */}
                            {selectedItemId === item.id && activeTab === "Daily" && (
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
                ListEmptyComponent={() => (
                    <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
                        No expenses found
                    </Text>
                )}
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