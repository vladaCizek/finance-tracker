<template>
  <div
    class="grid grid-cols-3 py-2 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon
          v-if="type === 'Income'"
          name="i-heroicons-arrow-up-right"
          class="text-green-600"
        />
        <UIcon v-else name="i-heroicons-arrow-down-left" class="text-red-600" />
        <div>{{ props.type }}</div>
      </div>
      <div>
        <UBadge
          v-if="props.category"
          color="white"
          class="dark:text-gray-200"
          >{{ props.category }}</UBadge
        >
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <ClientOnly>
          <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
            <UButton
              color="white"
              variant="ghost"
              trailing-icon="i-heroicons-ellipsis-horizontal"
              :loading="isLoading"
            />
          </UDropdown>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: Number,
  amount: Number,
  description: String,
  category: String,
  type: String,
});

const emit = defineEmits(["deleted", "editTransaction"]);

const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();
const { currency } = useCurrency(props.amount);

const isLoading = ref(false);

// delete transaction on supabase
const deleteTransaction = async (id) => {
  isLoading.value = true;
  try {
    await supabase.from("transactions").delete().eq("id", props.id);
    toastSuccess({
      title: "Transaction deleted",
    });
    emit("deleted", props.id);
  } catch (error) {
    toastError({
      title: "Transaction not deleted",
    });
  } finally {
    isLoading.value = false;
  }
};

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => emit("editTransaction"),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: deleteTransaction,
    },
  ],
];
</script>
