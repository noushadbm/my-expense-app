type GlobalHandlerType = {
    addExpense?: (Expense: {
      id?: string;
      title: string;
      amount: number;
      category: string;
      description?: string;
      date?: Date;
    }) => void;
  };
  
  const GlobalHandler: GlobalHandlerType = {};
  
  export default GlobalHandler;