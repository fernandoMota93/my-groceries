<script setup>
definePageMeta({
  middleware: ['auth'],
});

const authStore = useAuthStore();
</script>

<template>
  <div>
    <h1>Dashboard</h1>

    <p>
      {{ authStore.user?.email }}
    </p>

    <button @click="authStore.logout()">Sair</button>
  </div>
</template>
