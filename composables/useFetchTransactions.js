export const useFetchTransactions = (period) => {
  const supabase = useSupabaseClient();
  const transactions = ref([]);
  const pending = ref(false);

  const income = computed(() =>
    (transactions.value ?? []).filter((t) => t.type === "Income")
  );
  const expense = computed(() =>
    (transactions.value ?? []).filter((t) => t.type === "Expense")
  );

  const incomeCount = computed(() => income.value?.length ?? 0);
  const expenseCount = computed(() => expense.value?.length ?? 0);

  const incomeTotal = computed(() =>
    income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const expenseTotal = computed(() =>
    expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const fetchTransactions = async () => {
    pending.value = true;
    try {
      const { data } = await useAsyncData(
        `get-transactions-${period.value.to.toDateString()}`, // key must be always unique
        async () =>
          await supabase
            .from("transactions")
            .select()
            .gte("created_at", period.value.from.toISOString())
            .lte("created_at", period.value.to.toISOString())
            .order("created_at", { ascending: false })
      );
      return data.value?.data;
    } catch (error) {
      console.log("error", error);
    } finally {
      pending.value = false;
    }
  };

  const refresh = async () => {
    transactions.value = await fetchTransactions();
  };

  const transactionsGroupedByDate = computed(() => {
    let grouped = {};

    for (const transaction of transactions.value) {
      const date = new Date(transaction.created_at)
        .toISOString()
        ?.split("T")[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(transaction);
    }

    return grouped;
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      incomeTotal,
      incomeCount,
      expenseTotal,
      expenseCount,
    },
    refresh,
    pending,
  };
};
