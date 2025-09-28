import { Expense } from "../context/ExpensesContext";

type GlobalHandlerType = {
    addExpense?: (Expense: {
      id?: string;
      title: string;
      amount: number;
      category: string;
      description?: string;
      date?: Date;
    }) => void,
    updateExpense?: (expense: Expense) => void,
    reloadExpenses?: () => void,
  };
  
const GlobalHandler: GlobalHandlerType = {};
  
export default GlobalHandler;