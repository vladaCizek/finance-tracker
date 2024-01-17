<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu
        v-model="selectedView"
        :options="TRANSACTION_VIEW_OPTIONS"
        size="sm"
        class="min-w-24"
      />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      title="Icome"
      color="green"
      :amount="400"
      :lastAmount="3000"
      :loading="false"
    />
    <Trend
      title="Icome"
      color="red"
      :amount="400"
      :lastAmount="3000"
      :loading="true"
    />
    <Trend
      title="Icome"
      color="green"
      :amount="400"
      :lastAmount="3000"
      :loading="false"
    />
    <Trend
      title="Icome"
      color="red"
      :amount="400"
      :lastAmount="3000"
      :loading="false"
    />
  </section>
</template>

<script setup>
import { TRANSACTION_VIEW_OPTIONS } from "~/constants";
const selectedView = ref(TRANSACTION_VIEW_OPTIONS[1]);
</script>
