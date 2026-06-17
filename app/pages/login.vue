<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
})

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''

  try {
    loading.value = true

    await authStore.login(form.email, form.password)

    await navigateTo('/')
  } catch (err) {
    error.value = 'Usuário ou senha inválidos'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md mx-auto px-4">
    <UCard>
      <template #header>
        <div class="text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
            <UIcon name="i-lucide-shopping-cart" class="size-8" />
          </div>

          <h1 class="text-2xl font-bold">
            Minhas Compras
          </h1>

          <p class="text-sm text-muted mt-2">
          Controle de mercado.
          </p>
        </div>
      </template>

      <div class="space-y-4">
        <UFormField label="E-mail">
          <UInput v-model="form.email" icon="i-lucide-mail" placeholder="Digite seu e-mail" class="w-full" />
        </UFormField>

        <UFormField label="Senha">
          <UInput v-model="form.password" type="password" icon="i-lucide-lock" placeholder="Digite sua senha"
            class="w-full" />
        </UFormField>

        <UAlert v-if="error" color="error" variant="soft" :title="error" />

        <UButton block :loading="loading" icon="i-lucide-log-in" @click="submit">
          Entrar
        </UButton>
      </div>
    </UCard>

    <p class="text-center text-xs text-muted mt-4">
      Controle de compras e acompanhamento de preços.
    </p>
  </div>
</template>