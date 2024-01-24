<template>
  <UCard>
    <template #header> Signing in... </template>

    <div>Wait a moment while we sign you in</div>
  </UCard>
</template>

<script setup>
const { user } = useRedirectIfAuthenticated("/");
</script>
