<template>
  <UForm :state="state" :schema="schema" @submit="saveProfile">
    <!-- Full Name -->
    <UFormGroup class="mb-4" label="Full Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <!-- Email -->
    <UFormGroup
      class="mb-4"
      label="Email"
      name="email"
      help="You will receive a confirmation email on both the old and the new email addresses, if you modify your email address"
    >
      <UInput v-model="state.email" :required="true" />
    </UFormGroup>

    <!-- Submit button -->
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

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);

const state = ref({
  name: user.value.user_metadata?.full_name,
  email: user.value.email,
});

const schema = z.object({
  name: z.string().min(2).or(z.string().length(0)),
  email: z.string().email(),
});

const saveProfile = async () => {
  try {
    pending.value = true;
    const data = {
      full_name: state.value.name,
    };
    if (state.value.email !== user.value.email) {
      data.email = state.value.email;
    }
    const { error } = await supabase.auth.updateUser(data);
    if (error) {
      throw error;
    }
    toastSuccess({
      title: "Success",
      description: "Your profile has been updated.",
    });
  } catch (error) {
    toastError({
      title: "Error updating profile",
      description: "Your profile has been not updated.",
    });
  } finally {
    pending.value = false;
  }
};
</script>
