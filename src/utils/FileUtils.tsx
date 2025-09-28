import * as XLSX from 'xlsx';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Expense } from '../context/ExpensesContext';
import {toEpochMillis, formatDateToDDMMYYYY} from './TimeUtils';

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

interface ExportResult {
    success: boolean;
    message: string;
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
                    
                    const expenses : Expense[] = jsonData.map((row) => {
                        //entry.id = entry.id?.toString() || '';
                        const dateString : string = row['Entry Time'].toString();
                        const date = toEpochMillis(dateString);
                        return { id: '', title: row.Title, amount: parseFloat(row.Amount.toString()), category: row.Category, description: row.Description, date: date };
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

export const exportToExcel = async (expenses: Expense[]): Promise<ExportResult> => {
    console.log("Starting export to Excel");
    try {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        
        // Create an empty first sheet
        const emptySheet = XLSX.utils.aoa_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, emptySheet, 'Info');
        
        // Convert expenses data to the format expected by Excel
        const excelData: ExcelRowData[] = expenses.map(expense => ({
            Title: expense.title,
            Amount: expense.amount,
            Category: expense.category,
            Description: expense.description,
            'Entry Time': formatDateToDDMMYYYY(new Date(expense.date)) // Format as YYYY-MM-DD
        }));
        
        // Create worksheet from expenses data
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // Add the expenses sheet as the second sheet
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
        
        // Generate Excel file buffer
        const excelBuffer = XLSX.write(workbook, { 
            type: 'array', 
            bookType: 'xlsx' 
        });
        
        // Create file path
        const fileName = `expenses_${new Date().toISOString().split('T')[0]}.xlsx`;
        const fileUri = FileSystem.documentDirectory + fileName;
        
        // Convert buffer to base64 and save file
        const base64 = btoa(
            new Uint8Array(excelBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        
        await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64
        });
        
        // Share the file (this will open the iOS share sheet)
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                dialogTitle: 'Export Expenses',
                UTI: 'org.openxmlformats.spreadsheetml.sheet'
            });
        }
        
        console.log("Excel file exported successfully:", fileName);
        return { 
            success: true, 
            message: `Exported ${expenses.length} expenses successfully` 
        };
        
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        return { 
            success: false, 
            message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
        };
    }
};