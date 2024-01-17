<template>
  <div>
    <!-- Title -->
    <div class="font-bold" :class="[color]">{{ title }}</div>

    <!-- Amount -->
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton v-if="loading" class="h-8 w-full" />
      <div v-else>
        {{ amount }}
      </div>
    </div>

    <!-- Icon -->
    <div>
      <USkeleton v-if="loading" class="h-6 w-full" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon
          name="i-heroicons-arrow-trending-up-16-solid"
          dynamic
          :class="[color]"
        />
        <div class="text-gray-500 dark:text-gray-400">30% vs. last period</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  color: String,
  loading: Boolean,
});
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
