import { defineStore } from 'pinia';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

import { auth } from '~/services/firebase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          console.log('Firebase restored user:', user);

          this.user = user;
          this.initialized = true;
          resolve(user);
        });
      });
    },

    async login(email: string, password: string) {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      this.user = credential.user;

      return credential.user;
    },

    async logout() {
      await signOut(auth);

      this.user = null;

      await navigateTo('/login');
    },
  },
});
