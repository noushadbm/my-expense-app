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

export const getAllEntries = async (selectedDate: Date, selectedTab: string): Promise<Expense[]> => {
  // TODO: Open db only once and reuse the connection
  //const db = await openDatabaseAsync("dbTesting.db");
  const db = await getDb();
  const { start, end } = getDateRange(selectedDate, selectedTab);


  if (selectedTab === 'Daily') {
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
  } else if (selectedTab === 'Monthly') {
    // Monthly view - aggregate expenses by day
    const entries = await db.getAllAsync(
      `SELECT 
        DATE(entryDate / 1000, 'unixepoch', 'localtime') as day,
        SUM(amount) as totalAmount,
        COUNT(*) as expenseCount
       FROM expenses 
       WHERE entryDate BETWEEN ? AND ? 
       GROUP BY DATE(entryDate / 1000, 'unixepoch', 'localtime')
       ORDER BY day ASC`,
      [start, end]
    );

    return entries.map((entry: any, index: number) => {
      const dayDate = new Date(entry.day + 'T00:00:00');
      const dayOfMonth = dayDate.getDate();
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });

      return {
        id: (index + 1).toString(), // Generate a unique ID for each day
        title: `${dayOfMonth} ${dayName} (${entry.expenseCount})`,
        amount: entry.totalAmount,
        category: 'Daily Summary',
        description: `Total expenses for ${entry.day}`,
        date: dayDate,
      };
    }) as Expense[];
  } else if (selectedTab === 'Yearly') {
    // Yearly view - aggregate expenses by month
    const entries = await db.getAllAsync(
      `SELECT 
        strftime('%Y-%m', entryDate / 1000, 'unixepoch', 'localtime') as month,
        SUM(amount) as totalAmount,
        COUNT(*) as expenseCount
       FROM expenses 
       WHERE entryDate BETWEEN ? AND ? 
       GROUP BY strftime('%Y-%m', entryDate / 1000, 'unixepoch', 'localtime')
       ORDER BY month ASC`,
      [start, end]
    );

    return entries.map((entry: any, index: number) => {
      const monthDate = new Date(entry.month + '-01T00:00:00');
      const monthIndex = monthDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });

      return {
        id: (index + 1).toString(), // Generate a unique ID for each month
        title: `${monthIndex} ${monthName}`,
        amount: entry.totalAmount,
        category: 'Monthly Summary',
        description: `Total expenses for ${monthName} ${monthDate.getFullYear()}`,
        date: monthDate,
      };
    }) as Expense[];
  }
  return [];
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

export const updateEntry = async (body: Expense) => {
  console.log("Updating entry in the database with ID:", body.id);
  const db = await getDb();
  const statement = await db.prepareAsync(
    `UPDATE expenses 
     SET title = $title, 
         amount = $amount, 
         category = $category, 
         description = $description, 
         entryDate = $entryDate 
     WHERE id = $id`
  );

  try {
    const response = await statement.executeAsync({
      $id: body.id,
      $title: body.title,
      $amount: body.amount,
      $category: body.category,
      $description: body.description,
      $entryDate: body.date ? body.date.getTime() : new Date().getTime(), // Store as epoch ms
    });

    console.log("Update response:", response);

    return response;
  } catch (error) {
    console.log(error);
  } finally {
    await statement.finalizeAsync();
  }
} 

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

export const restore = async (expenses: Expense[]): Promise<void> => {
  console.log("Restoring expenses database with", expenses.length, "records");
  const db = await getDb();
  
  try {
    // Start transaction
    await db.execAsync("BEGIN TRANSACTION");
    
    // Delete all existing records
    await db.execAsync("DELETE FROM expenses");
    console.log("Deleted all existing expense records");
    
    // Prepare insert statement
    const insertStatement = await db.prepareAsync(
      "INSERT INTO expenses (title, amount, category, description, entryDate) VALUES ($title, $amount, $category, $description, $entryDate)"
    );
    
    try {
      // Insert all new records
      for (const expense of expenses) {
        await insertStatement.executeAsync({
          $title: expense.title,
          $amount: expense.amount,
          $category: expense.category,
          $description: expense.description,
          $entryDate: expense.date ? expense.date.getTime() : new Date().getTime(),
        });
      }
      
      console.log("Inserted", expenses.length, "expense records");
      
      // Commit transaction
      await db.execAsync("COMMIT");
      console.log("Database restore completed successfully");
      
    } finally {
      await insertStatement.finalizeAsync();
    }
    
  } catch (error) {
    // Rollback transaction on error
    await db.execAsync("ROLLBACK");
    console.error("Error during database restore, transaction rolled back:", error);
    throw error;
  }
};