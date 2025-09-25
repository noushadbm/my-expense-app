import * as XLSX from 'xlsx';
import * as DocumentPicker from 'expo-document-picker';
import { Expense } from '../context/ExpensesContext';
import {toEpochMillis} from './TimeUtils';
//import { Expense } from '../types/expense';
//import { deleteAllExpenses, addExpense } from '../services/expenseService';

interface ExcelRowData {
    Title: string;
    Amount: string | number;
    Category: string;
    Description: string;
    'Entry Time': string | number; // Excel dates can be strings or numbers
}

interface RestoreResult {
    success: boolean;
    data: Expense[] | null;
}

export const restoreFromExcel = async () : Promise<RestoreResult> => {
    console.log("Starting restore from Excel");
    try {
        // Pick Excel file
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        if (result.canceled) {
            return { success: false, data: null };
        }

        // Read file
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = async (e: ProgressEvent<FileReader>) => {
                try {
                    console.log("File read successfully");
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[1];
                    console.log("Sheet Name:", sheetName);
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json<ExcelRowData>(worksheet);

                    // Delete existing expenses
                    // await deleteAllExpenses();

                    // // Insert new expenses
                    // for (const row of jsonData) {
                    //     console.log("Processing row:", row);
                    //     const expense: Expense = {
                    //         id: null,
                    //         title: row.Title,
                    //         amount: parseFloat(row.Amount.toString()),
                    //         category: row['Category'],
                    //         description: row['Description'],
                    //         date: new Date(row['Entry Time'])
                    //     };
                    //     //await addExpense(expense);
                    //     console.log("Restored Expense:", expense);
                    // }
                    
                    const expenses : Expense[] = jsonData.map((row) => {
                        //entry.id = entry.id?.toString() || '';
                        const dateString : string = row['Entry Time'].toString();
                        const epoc = toEpochMillis(dateString);
                        return { id: null, title: row.Title, amount: parseFloat(row.Amount.toString()), category: row.Category, description: row.Description, date: epoc };
                    });
                    //const expenses : Expense[] = jsonData.map(row => ({ id: null, title: row.Title, amount: parseFloat(row.Amount.toString()), category: row.Category, description: row.Description, date: new Date(row['Entry Time']) }));
                    console.log("All expenses restored successfully, total:", expenses.length);
                    resolve({ success: true, data:  expenses});
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsArrayBuffer(blob);
        });
    } catch (error) {
        console.error('Error restoring from Excel:', error);
        throw error;
    }
};