import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpenseListScreen from './src/screens/ExpenseListScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import { ExpensesProvider } from './src/context/ExpensesContext';
import { NavigationContainer } from '@react-navigation/native';
import { SQLiteProvider } from "expo-sqlite";
import { initCreateTables } from './src/db/init';

export type RootStackParamList = {
  ExpenseList: undefined;
  AddExpense: { dateISO?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SQLiteProvider
      databaseName="dbTesting.db"
      onInit={initCreateTables}
      useSuspense
    >
      <ExpensesProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExpenseList" component={ExpenseListScreen} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ExpensesProvider>
    </SQLiteProvider>

  );
}
