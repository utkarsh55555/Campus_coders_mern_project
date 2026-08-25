import { useQuery } from '@tanstack/react-query';
import { useFinance } from '../context/FinanceContext';

/** Soft-cache finance snapshots via React Query while data still lives in context. */
export function useFinanceSnapshot() {
  const finance = useFinance();

  return useQuery({
    queryKey: ['finance-snapshot', finance.transactions?.length, finance.budgets?.length],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 120));
      return {
        transactions: finance.transactions,
        budgets: finance.budgets,
        groups: finance.groups,
        groupExpenses: finance.groupExpenses,
      };
    },
    initialData: {
      transactions: finance.transactions,
      budgets: finance.budgets,
      groups: finance.groups,
      groupExpenses: finance.groupExpenses,
    },
  });
}
