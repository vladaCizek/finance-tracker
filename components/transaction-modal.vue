<template>
  <UModal v-model="isOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <span>{{ isEditing ? "Edit" : "Add" }}</span>
        <span> Transaction</span>
      </template>

      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        :validate-on="['submit']"
        @submit="save"
      >
        <UFormGroup
          label="Transaction Type"
          name="type"
          :required="true"
          class="mb-4"
        >
          <USelect
            v-model="state.type"
            :options="TRANSACTION_TYPES"
            :disabled="isEditing"
            placeholder="Select the transaction type"
          />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
            type="number"
            placeholder="Amount"
            v-model.number="state.amount"
          />
        </UFormGroup>

        <UFormGroup
          label="Transaction Date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>

        <UFormGroup label="Description" name="description" class="mb-4">
          <UTextarea placeholder="Description" v-model="state.description" />
        </UFormGroup>

        <UFormGroup
          v-if="state.type === 'Expense'"
          label="Category"
          name="category"
          :required="true"
          class="mb-4"
        >
          <USelect
            :options="CATEGORIES"
            placeholder="Category"
            v-model="state.category"
          />
        </UFormGroup>

        <UButton
          type="Submit"
          color="black"
          variant="solid"
          label="Save"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { z } from "zod";
import {
  CATEGORIES,
  TransactionTypesMapping,
  TRANSACTION_TYPES,
} from "~/constants";

const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false,
  },
});

const isEditing = computed(() => !!props.transaction);

const emit = defineEmits(["update:modelValue", "saved"]);

// Define Supabase client and Toast
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();

// Default base schema
const defaultSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive("Amount has to be more than 0"),
  created_at: z.string(),
});

// Transaction Types Schemas
const incomeSchema = z.object({
  type: z.literal(TransactionTypesMapping.INCOME),
});
const investmentSchema = z.object({
  type: z.literal(TransactionTypesMapping.INVESTMENT),
});
const savingSchema = z.object({
  type: z.literal(TransactionTypesMapping.SAVING),
});
const expenseSchema = z.object({
  type: z.literal(TransactionTypesMapping.EXPENSE),
  category: z.enum(CATEGORIES),
});

// Intersection of schemas
// Here we make Category schema based on state of Type
// Show and Validate Category only if Type === 'Expense'
const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);

// access the ref="form" DOM element
const form = ref();

const isLoading = ref(false);

const save = async () => {
  // form is validated on submit automatically
  // we don't have to trigger the validation manually
  if (form.value.errors.length) {
    return;
  }

  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from("transactions")
      .upsert({
        ...state.value,
        id: props.transaction?.id,
      })
      .select();

    if (!error) {
      // Success: toast, close modal and notify parent new transaction was saved
      toastSuccess({
        title: "Transaction saved",
      });
      isOpen.value = false;
      emit("saved");
    } else {
      throw error;
    }
  } catch (error) {
    toastError({
      title: "Transaction not saved",
      description: error.message,
    });
  } finally {
    isLoading.value = false;
  }
};

const setState = (transaction) => {
  return {
    type: transaction?.type ?? undefined,
    amount: transaction?.amount ?? 0,
    created_at: transaction?.created_at?.split("T")[0] ?? undefined,
    description: transaction?.description ?? undefined,
    category: transaction?.category ?? undefined,
  };
};

const state = ref(setState(props.transaction));

const resetForm = () => {
  Object.assign(state.value, setState(props.transaction)); // re initialize the form data
  form.value.clear(); // clear all errors on the form
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) {
      resetForm();
    }
    emit("update:modelValue", value);
  },
});

watch(props, (value) => {
  const newValue = setState(props.transaction);
  state.value = { ...newValue };
});
</script>
