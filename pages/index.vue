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
      :amount="4000"
      :lastAmount="3000"
      :loading="isLoading"
    />
    <Trend
      title="Expense"
      color="red"
      :amount="4000"
      :lastAmount="5000"
      :loading="isLoading"
    />
    <Trend
      title="Investments"
      color="green"
      :amount="4000"
      :lastAmount="3000"
      :loading="isLoading"
    />
    <Trend
      title="Savings"
      color="red"
      :amount="4000"
      :lastAmount="4100"
      :loading="isLoading"
    />
  </section>

  <section v-if="!isLoading">
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
        @deleted="refetchTransactions"
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
</template>

<script setup>
import { TRANSACTION_VIEW_OPTIONS } from "~/constants";
const selectedView = ref(TRANSACTION_VIEW_OPTIONS[1]);

const supabase = useSupabaseClient();
const transactions = ref([]);
const isLoading = ref(false);

const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData(
      "get-transactions",
      async () => await supabase.from("transactions").select()
    );
    return data.value;
  } catch (error) {
    console.log("error", error);
  } finally {
    isLoading.value = false;
  }
};

const refetchTransactions = async () => {
  transactions.value = await fetchTransactions();
};

await refetchTransactions();

const transactionsGroupedByDate = computed(() => {
  let grouped = {};

  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString()?.split("T")[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(transaction);
  }

  return grouped;
});

console.log(transactionsGroupedByDate.value);
</script>
