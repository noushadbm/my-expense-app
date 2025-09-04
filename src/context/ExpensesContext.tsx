// src/context/ExpensesContext.tsx
import React, { createContext, useState, ReactNode } from "react";

// 👇 Polyfill for UUID in React Native
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  date: Date;
};

type ExpensesContextType = {
  expenses: Expense[
  ];
  addExpense: (title: string, amount: number, date: Date) => void;
  removeExpense: (id: string) => void;
};

export const ExpensesContext = createContext<ExpensesContextType>({
    expenses: [],
    addExpense: () => {},
    removeExpense: () => {},
  });
  
  type ProviderProps = {
    children: ReactNode;
  };

export const ExpensesProvider = ({ children }: ProviderProps) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
  
    const addExpense = (title: string, amount: number, date: Date) => {
      const newExpense: Expense = {
        id: uuidv4(), // ✅ Safe unique ID
        title,
        amount,
        date,
      };
      setExpenses((current) => [newExpense, ...current]);
    };
  
    const removeExpense = (id: string) => {
      setExpenses((current) => current.filter((expense) => expense.id !== id));
    };
  
    return (
      <ExpensesContext.Provider value={{ expenses, addExpense, removeExpense }}>
        {children}
      </ExpensesContext.Provider>
    );
  };