export default defineNuxtPlugin(async () => {
  console.log('AUTH PLUGIN START');

  const authStore = useAuthStore();

  await authStore.init();

  console.log('AUTH PLUGIN END', authStore.user);
});
