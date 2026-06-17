<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
});
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

async function submit() {
  error.value = '';

  try {
    loading.value = true;

    await authStore.login(form.email, form.password);

    await navigateTo('/');
  } catch (err: any) {
    error.value = 'Usuário ou senha inválidos';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="submit">
      <h1>My Groceries</h1>

      <input v-model="form.email" type="email" placeholder="Email" />

      <input v-model="form.password" type="password" placeholder="Senha" />

      <button :disabled="loading" type="submit">Entrar</button>

      <p v-if="error">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.login-card {
  width: 400px;
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

input {
  width: 100%;
  margin-bottom: 12px;
  padding: 12px;
}

button {
  width: 100%;
  padding: 12px;
}
</style>
