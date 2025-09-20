import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Platform,
    Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { formatDateAndDay } from "../../utils/TimeUtils";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Expense } from "../../context/ExpensesContext";
import GlobalHandler from "../../utils/GlobalHandler";

type RootStackParamList = {
    EditExpenseScreen: { id: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ExpenseListPanel({ activeTab, expenses, removeEntry, selectedDate, onDateChange, updateExpense }: { activeTab: string, expenses: Expense[], removeEntry?: (id: string) => void, selectedDate: Date, onDateChange?: (newDate: Date) => void, updateExpense?: (expense: Expense) => void }) {
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const {monthAndYear, dayName, dayOfMonth} = formatDateAndDay(activeTab, selectedDate);

    const handleLongPress = (item: Expense) => {
        setSelectedItemId(item.id);
    };

    const handleDelete = (id: string) => {
        console.log("Delete item with ID:", id);
        removeEntry && removeEntry(id);
        setSelectedItemId(null);
    };

    const handleEdit = (id: string) => {
        const expense = expenses.find(e => e.id === id);
        console.log("Edit item :", expense);
        setSelectedItemId(null);
        GlobalHandler.updateExpense = updateExpense;
        (navigation as any).navigate('EditExpense', {expense} );
    };

    const cancelOperation = (id: string) => {
        console.log("Cancel item with ID:", id);
        setSelectedItemId(null);
    };

    const changeDate = (direction: 1 | -1) => {
        const newDate = new Date(selectedDate);
        if (activeTab === "Daily") newDate.setDate(newDate.getDate() + direction);
        if (activeTab === "Monthly") newDate.setMonth(newDate.getMonth() + direction);
        if (activeTab === "Yearly") newDate.setFullYear(newDate.getFullYear() + direction);
        onDateChange?.(newDate);
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        console.log("Date picker event:", event.type, selectedDate);
        
        setShowDatePicker(false);
        
        if (selectedDate && onDateChange && event.type !== 'dismissed') {
            onDateChange(selectedDate);
        }
    };

    const [tempDate, setTempDate] = useState(selectedDate);

    // Generate calendar days for current month
    const generateCalendarDays = () => {
        const currentDate = new Date(tempDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        
        const days = [];
        
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const calendarDays = generateCalendarDays();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[tempDate.getMonth()];
    const currentYear = tempDate.getFullYear();

    const changeMonth = (direction: number) => {
        const newDate = new Date(tempDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setTempDate(newDate);
    };

    const openCalendar = () => {
        console.log("Opening calendar...");
        setTempDate(selectedDate);
        setShowDatePicker(true);
    };

    const selectCalendarDate = (date: Date) => {
        setTempDate(date);
    };

    const confirmDate = () => {
        handleDateChange({type: 'set'}, tempDate);
    };

    return (
        <>
            {/* Date + Total */}
            <View style={styles.dateCard}>
                <TouchableOpacity onPress={() => changeDate(-1)}>
                    <Ionicons name="chevron-back" size={22} color="white" />
                </TouchableOpacity>

                <View style={styles.dateContainer}>
                    <View style={styles.dateContentWrapper}>
                        {activeTab === "Daily" && <TouchableOpacity onPress={openCalendar} style={styles.dayBox}>
                            <Text style={styles.dayBoxText}>{dayOfMonth}</Text>
                        </TouchableOpacity>}
                        <View style={styles.monthYearContainer}>
                            <Text
                                style={[
                                    styles.dateText,
                                    activeTab === "Monthly" && { fontSize: 20 },
                                    activeTab === "Yearly" && { fontSize: 22 },
                                ]}
                            >
                                {monthAndYear}
                            </Text>
                            {dayName !== "" && <Text style={styles.dayText}>{dayName}</Text>}
                        </View>
                    </View>
                </View>

                <Text style={styles.totalText}>{total.toFixed(2)}</Text>

                <TouchableOpacity onPress={() => changeDate(1)}>
                    <Ionicons name="chevron-forward" size={22} color="white" />
                </TouchableOpacity>
            </View>

            {/* Custom Calendar Modal */}
            {showDatePicker && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showDatePicker}
                    onRequestClose={() => setShowDatePicker(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.pickerHeader}>
                                <TouchableOpacity 
                                    onPress={() => setShowDatePicker(false)}
                                    style={styles.headerButton}
                                >
                                    <Text style={styles.headerButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <View style={styles.monthNavigation}>
                                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                                        <Ionicons name="chevron-back" size={20} color="#007AFF" />
                                    </TouchableOpacity>
                                    <Text style={styles.monthTitle}>{currentMonth} {currentYear}</Text>
                                    <TouchableOpacity onPress={() => changeMonth(1)}>
                                        <Ionicons name="chevron-forward" size={20} color="#007AFF" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity 
                                    onPress={confirmDate}
                                    style={styles.headerButton}
                                >
                                    <Text style={[styles.headerButtonText, {color: '#007AFF'}]}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Calendar Grid */}
                            <View style={styles.calendarContainer}>
                                {/* Day labels */}
                                <View style={styles.dayLabelsRow}>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <Text key={day} style={styles.dayLabel}>{day}</Text>
                                    ))}
                                </View>
                                
                                {/* Calendar days */}
                                <View style={styles.calendarGrid}>
                                    {calendarDays.map((day, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.calendarDay,
                                                day && day.toDateString() === tempDate.toDateString() && styles.selectedDay
                                            ]}
                                            onPress={() => day && selectCalendarDate(day)}
                                            disabled={!day}
                                        >
                                            <Text style={[
                                                styles.calendarDayText,
                                                day && day.toDateString() === tempDate.toDateString() && styles.selectedDayText
                                            ]}>
                                                {day ? day.getDate() : ''}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

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
                            <Text style={styles.expenseName}>{item.title}</Text>
                            <Text style={styles.expenseAmount}>{item.amount.toFixed(2)}</Text>
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
    dateContainer: {
        flex: 1,
        alignItems: "center",
    },
    dateContentWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    dayBox: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1.5,
        borderColor: "white",
        borderRadius: 8,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    dayBoxText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    monthYearContainer: {
        alignItems: "flex-start",
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
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    headerButton: {
        padding: 5,
    },
    headerButtonText: {
        fontSize: 17,
        color: '#007AFF',
    },
    iosDatePicker: {
        height: 200,
        backgroundColor: 'white',
    },
    fallbackPicker: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: 'white',
        minHeight: 200,
        justifyContent: 'center',
    },
    fallbackText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    fallbackInfo: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    fallbackButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    fallbackButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    monthNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        minWidth: 140,
        textAlign: 'center',
    },
    calendarContainer: {
        padding: 20,
    },
    dayLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    dayLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
        width: 40,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    calendarDay: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        borderRadius: 20,
    },
    selectedDay: {
        backgroundColor: '#007AFF',
    },
    calendarDayText: {
        fontSize: 16,
        color: '#333',
    },
    selectedDayText: {
        color: 'white',
        fontWeight: 'bold',
    },
});