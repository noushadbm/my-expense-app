import { SQLiteDatabase, openDatabaseAsync } from "expo-sqlite";
import { Expense } from "../context/ExpensesContext";

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

export const createEntry = async (body: Expense) => {
  const db = await openDatabaseAsync("dbTesting.db");
  const statement = await db.prepareAsync(
    "INSERT INTO expenses (title, amount, category, description, entryDate) VALUES ($title, $amount, $category, $description, $entryDate)"
  );

  try {
    const response = await statement.executeAsync({
      $title: body.title,
      $amount: body.amount,
      $category: body.category,
      $description: body.description,
      $entryDate: body.date ? body.date.getTime() : new Date().getTime(),
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