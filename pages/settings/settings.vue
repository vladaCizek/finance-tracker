<template>
  <UForm :state="state" :schema="schema" @submit="saveSettings">
    <UFormGroup
      label="Transaction View"
      class="mb-4"
      help="Choose how you would like to view transactions"
    >
      <USelect
        v-model="state.transactionView"
        :options="TRANSACTION_VIEW_OPTIONS"
      />
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>

<script setup>
import { z } from "zod";
import { TRANSACTION_VIEW_OPTIONS } from "~/constants";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);

const state = ref({
  transactionView:
    user.value.user_metadata?.transaction_view ?? TRANSACTION_VIEW_OPTIONS[1],
});
const schema = z.object({
  transactionView: z.enum(TRANSACTION_VIEW_OPTIONS),
});

const saveSettings = async () => {
  pending.value = true;

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: state.value.transactionView,
      },
    });
    if (error) throw error;
    toastSuccess({
      title: "Settings updated",
    });
  } catch (error) {
    toastError({
      title: "Error updating settings",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
