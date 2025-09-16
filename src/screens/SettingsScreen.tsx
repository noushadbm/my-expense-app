import React, { useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthProvider";

export default function SettingsScreen() {
    const navigation = useNavigation();

    const goBack = () => {
        navigation.goBack();
    };

    const { loggedInUser, logout } = useContext(AuthContext);
    console.log("Logged in user in SettingsScreen:", loggedInUser);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Settings Content */}
            <View style={styles.content}>
                <View style={styles.settingsSection}>
                    <Text style={styles.sectionTitle}>General</Text>

                    <TouchableOpacity style={styles.settingsItem}>
                        <View style={styles.settingsItemLeft}>
                            <Ionicons name="cash-outline" size={20} color="#666" />
                            <View>
                                <Text style={styles.settingsItemText}>Currency</Text>
                                <Text style={styles.settingsItemBoldText}>AED</Text>
                            </View>

                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.settingsSection}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    {!loggedInUser && <TouchableOpacity style={styles.settingsItem} onPress={() => {
                        navigation.navigate("Login" as never);
                    }}>
                        <View style={styles.settingsItemLeft}>
                            <Ionicons name="person" size={20} color="#666" />
                            <Text style={styles.settingsItemText}>Login</Text>
                        </View>
                    </TouchableOpacity>}
                    
                    {loggedInUser && <>
                    <TouchableOpacity style={styles.settingsItem} onPress={() => logout("id")}>
                        <View style={styles.settingsItemLeft}>
                            <Ionicons name="person" size={20} color="#666" />
                            <Text style={styles.settingsItemText}>{loggedInUser.name}</Text>
                            <Text style={styles.settingsItemText}>(Logout)</Text>
                        </View>
                    </TouchableOpacity>
                        <TouchableOpacity style={styles.settingsItem}>
                            <View style={styles.settingsItemLeft}>
                                <Ionicons name="download-outline" size={20} color="#666" />
                                <Text style={styles.settingsItemText}>Export to cloud</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingsItem}>
                            <View style={styles.settingsItemLeft}>
                                <Ionicons name="cloud-upload-outline" size={20} color="#666" />
                                <Text style={styles.settingsItemText}>Restore from cloud</Text>
                            </View>
                        </TouchableOpacity></>}

                </View>

                <View style={styles.settingsSection}>
                    <Text style={styles.sectionTitle}>Data</Text>

                    <TouchableOpacity style={styles.settingsItem}>
                        <View style={styles.settingsItemLeft}>
                            <Ionicons name="newspaper" size={20} color="#666" />
                            <Text style={styles.settingsItemText}>Export to Excel</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsItem}>
                        <View style={styles.settingsItemLeft}>
                            <Ionicons name="arrow-redo-circle-outline" size={20} color="#666" />
                            <Text style={styles.settingsItemText}>Backup from Excel</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.settingsSection}>
                    <Text style={styles.sectionTitle}>About</Text>

                    <TouchableOpacity style={styles.settingsItem}>
                        <View style={styles.settingsItemLeft}>
                            <Ionicons name="information-circle-outline" size={20} color="#666" />
                            <Text style={styles.settingsItemText}>App Version</Text>
                        </View>
                        <Text style={styles.versionText}>1.0.0</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    content: {
        flex: 1,
        padding: 16,
    },
    settingsSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 12,
        marginLeft: 4,
    },
    settingsItem: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    settingsItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    settingsItemText: {
        fontSize: 16,
        color: "#333",
        marginLeft: 12,
    },
    settingsItemBoldText: {
        fontSize: 16,
        color: "#333",
        marginLeft: 12,
        fontWeight: "bold",
    },
    versionText: {
        fontSize: 14,
        color: "#666",
    },
});