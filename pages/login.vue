<template>
  <UCard v-if="!success">
    <template #header> Sig-in to Finance Tracker </template>

    <form @submit.prevent="handleLogin">
      <UFormGroup
        label="Email"
        name="email"
        class="mb-4"
        :required="true"
        help="You will receive an email with the confirmation link"
      >
        <UInput type="email" v-model="email" placeholder="email" required />
      </UFormGroup>
      <UButton
        type="submit"
        variant="solid"
        color="black"
        :loading="pending"
        :disabled="pending"
        >Sign-In</UButton
      >
    </form>
  </UCard>
  <UCard v-else>
    <template #header>Email has been sent</template>
    <div class="text-center">
      <p class="mb-4">
        We have sent an email to <strong></strong> with a sing in link.
      </p>
      <p>
        <strong>Important:</strong>
        <span> The link will expire in 5 minutes.</span>
      </p>
    </div>
  </UCard>
</template>

<script setup>
const success = ref(false);
const email = ref("");
const pending = ref(false);
const { toastError } = useAppToast();
const supabase = useSupabaseClient();
const redirectUrl = useRuntimeConfig().public.baseUrl;

useRedirectIfAuthenticated();

const handleLogin = async () => {
  try {
    pending.value = true;
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: false,
        emailRedirectTo: `${redirectUrl}/confirm`,
      },
    });
    if (error) {
      throw error;
    }
    success.value = true;
  } catch (error) {
    toastError({
      title: "Error authenticating",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
