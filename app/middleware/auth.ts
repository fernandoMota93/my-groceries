export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  console.log('ANTES', {
    initialized: authStore.initialized,
    user: authStore.user,
  });

  if (!authStore.initialized) {
    await authStore.init();
  }

  console.log('DEPOIS', {
    initialized: authStore.initialized,
    user: authStore.user,
  });

  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
});
