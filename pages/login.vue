<template>
  <UCard>
    <template #header> Sig-in to Finance Tracker </template>

    <form>
      <UFormGroup
        label="email"
        name="email"
        class="mb-4"
        :required="true"
        help="You will receive an email with the confirmation link"
      >
        <UInput type="email" placeholder="email" required />
        <UButton type="submit" variant="solid" color="black">Sign-In</UButton>
      </UFormGroup>
    </form>
  </UCard>
</template>

<script setup></script>
