import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCreFTXTc6XpyyZQMUGhAdsIRtGlgu4ssk',
  authDomain: 'my-groceries-cd3ea.firebaseapp.com',
  projectId: 'my-groceries-cd3ea',
  storageBucket: 'my-groceries-cd3ea.firebasestorage.app',
  messagingSenderId: '277501444807',
  appId: '1:277501444807:web:ca90e772acc85ed31774e2',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

if (import.meta.client) {
  auth.setPersistence(browserLocalPersistence);
}

export const db = getFirestore(app);
