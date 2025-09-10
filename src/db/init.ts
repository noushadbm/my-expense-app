import { SQLiteDatabase, openDatabaseAsync } from "expo-sqlite";
import { Expense } from "../context/ExpensesContext";
import { getDateRange } from "../utils/TimeUtils";

let db: SQLiteDatabase | null = null;

export const getDb = async (): Promise<SQLiteDatabase> => {
  if (!db) {
    db = await openDatabaseAsync("dbTesting.db");
  }
  return db;
};

export const initCreateTables = async (db: SQLiteDatabase) => {
  console.log("Initializing database and creating tables if they do not exist...");
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY UNIQUE NOT NULL, 
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      active INTEGER NOT NULL
    )`
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS expenses ( 
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          title TEXT, 
          amount REAL DEFAULT 0, 
          category TEXT, 
          description TEXT, 
          entryDate INT NOT NULL
        )`
  );
};

export const getAllEntries = async (selectedDate : Date, selectedTab: string): Promise<Expense[]> => {
  // TODO: Open db only once and reuse the connection
  //const db = await openDatabaseAsync("dbTesting.db");
  const db = await getDb();
  const { start, end } = getDateRange(selectedDate, selectedTab);
  const entries = await db.getAllAsync(
    "SELECT * FROM expenses WHERE entryDate BETWEEN ? AND ? ORDER BY entryDate ASC",
    [start, end]
  );
  return entries.map((entry: any) => ({
    id: entry.id,
    title: entry.title,
    amount: entry.amount,
    category: entry.category,
    description: entry.description,
    date: new Date(entry.entryDate),
  })) as Expense[];
};

export const createEntry = async (body: Expense, selectedDate: Date) => {
  console.log("Creating new entry in the database for date:", selectedDate);
  const db = await getDb();
  const statement = await db.prepareAsync(
    "INSERT INTO expenses (title, amount, category, description, entryDate) VALUES ($title, $amount, $category, $description, $entryDate)"
  );

  try {
    const response = await statement.executeAsync({
      $title: body.title,
      $amount: body.amount,
      $category: body.category,
      $description: body.description,
      $entryDate: selectedDate.getTime(), // Store as epoch ms
    });

    console.log("Insert lastInsertRowId:", response.lastInsertRowId);

    return await db.getFirstAsync(
      "SELECT * FROM expenses WHERE id=?",
      response.lastInsertRowId
    );
  } catch (error) {
    console.log(error);
  } finally {
    await statement.finalizeAsync();
  }
};

export const deleteEntry = async (id: string) => {
  console.log("Deleting entry with ID:", id);
  const db = await getDb();
  const statement = await db.prepareAsync(
    "DELETE FROM expenses WHERE id = $id"
  );

  try {
    const response = await statement.executeAsync({
      $id: id,
    });

    console.log("Delete response:", response);
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    await statement.finalizeAsync();
  }
}