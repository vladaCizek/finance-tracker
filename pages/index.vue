<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <ClientOnly>
        <USelectMenu
          v-model="selectedView"
          :options="TRANSACTION_VIEW_OPTIONS"
          size="sm"
          class="min-w-24"
        />
      </ClientOnly>
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      title="Icome"
      color="green"
      :amount="incomeTotal"
      :lastAmount="previousIncomeTotal"
      :loading="pending"
    />
    <Trend
      title="Expense"
      color="red"
      :amount="expenseTotal"
      :lastAmount="previousExpenseTotal"
      :loading="pending"
    />
    <Trend
      title="Investments"
      color="green"
      :amount="4000"
      :lastAmount="3000"
      :loading="pending"
    />
    <Trend
      title="Savings"
      color="red"
      :amount="4000"
      :lastAmount="4100"
      :loading="pending"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses.
      </div>
    </div>
    <div>
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      />
    </div>
  </section>

  <section v-if="!pending">
    <div
      v-for="(transactionOnDay, date) in transactionsGroupedByDate"
      :key="date"
      class="mb-10"
    >
      <DailyTransactionSummary :date="date" :transactions="transactionOnDay" />

      <Transaction
        v-for="(transaction, i) in transactionOnDay"
        :key="`tt-${i}-${transaction.id}`"
        v-bind="transaction"
        @deleted="refresh"
      />
    </div>
  </section>

  <section v-else>
    <USkeleton
      v-for="i in 4"
      :key="`transaction-skeleton-${i}`"
      class="h-8 w-full mb-2"
    />
  </section>

  <UNotifications />
  <TransactionModal v-model="isOpen" @saved="refresh" />
</template>

<script setup>
import { TRANSACTION_VIEW_OPTIONS } from "~/constants";
const selectedView = ref(TRANSACTION_VIEW_OPTIONS[1]);

const { current, previous } = useUseSeletectedTimePeriod(selectedView);

const {
  pending,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: { byDate: transactionsGroupedByDate },
  },
} = useFetchTransactions(current);

await refresh();

const {
  refresh: refreshPrevious,
  transactions: {
    incomeTotal: previousIncomeTotal,
    expenseTotal: previousExpenseTotal,
  },
} = useFetchTransactions(previous);

await refreshPrevious();

watch(selectedView, async () => {
  await refresh();
  await refreshPrevious();
});

const isOpen = ref(false);
</script>
