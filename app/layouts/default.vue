<script setup lang="ts">
import { navigationItems } from '~/constants/navigation';
const authStore = useAuthStore();

const sidebarOpen = ref(true);
const showLogoutModal = ref(false);

async function confirmLogout() {
  showLogoutModal.value = false;
  await logout();
}

async function logout() {
  await authStore.logout();
  await navigateTo('/login');
}
</script>

<template>
  <UPage>
    <div class="h-screen flex flex-col">
      <!-- Header -->
      <header class="h-16 border-b flex items-center px-4 shrink-0">
        <UButton icon="i-lucide-menu" variant="ghost" @click="sidebarOpen = !sidebarOpen" style="cursor:pointer" />

        <h1 class="ml-4 font-semibold text-lg">
          Minhas compras
        </h1>
      </header>

      <!-- Conteúdo -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <aside :class="sidebarOpen ? 'w-64' : 'w-0'"
          class="border-r shrink-0 overflow-hidden transition-all duration-300">
          <div class="p-4 flex flex-col gap-2">
            <UButton v-for="item in navigationItems" :key="item.to" as="NuxtLink" :to="item.to" variant="ghost"
              class="justify-start" :icon="item.icon">
              {{ item.label }}
            </UButton>

            <USeparator class="my-2" />

            <UButton icon="i-lucide-log-out" variant="ghost" class="justify-start" @click="showLogoutModal = true">
              Sair
            </UButton>
          </div>
        </aside>

        <!-- Área principal -->
        <main class="flex-1 overflow-auto p-6">
          <slot />
        </main>
      </div>
    </div>
    <UModal v-model:open="showLogoutModal">
      <template #content>
        <div class="p-6">
          <h2 class="text-lg font-semibold mb-2">
            Confirmar saída
          </h2>

          <p class="text-sm text-muted mb-6">
            Deseja realmente sair do sistema?
          </p>

          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showLogoutModal = false">
              Cancelar
            </UButton>

            <UButton color="error" @click="confirmLogout">
              Sair
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </UPage>

</template>