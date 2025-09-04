import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import GlobalHandler from "../../utils/GlobalHandler";

export default function FloatingActionButton({addExpense}: {addExpense?: (expense: any) => void}) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.fab}
            onPress={() => {
                console.log("Add button Pressed");
                GlobalHandler.addExpense = addExpense;
                navigation.navigate("AddExpense" as never); // Pass addExpense as a parameter
            }}
        >
            <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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