type GlobalHandlerType = {
    addExpense?: (Expense: {
      id: string;
      title: string;
      amount: number;
    }) => void;
  };
  
  const GlobalHandler: GlobalHandlerType = {};
  
  export default GlobalHandler;