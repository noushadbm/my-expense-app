import { SQLiteDatabase } from "expo-sqlite";

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