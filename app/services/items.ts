import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from './firebase';
import type { Item } from '~/types/item';

const collectionRef = collection(db, 'items');

export async function getItems(): Promise<Item[]> {
  const q = query(
    collectionRef,
    where('active', '==', true),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      name: data.name,
      order: data.order,
      category: data.category,
      amount: data.amount,
      active: data.active,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  });
}

export async function createItem(payload) {
  return addDoc(collectionRef, {
    ...payload,
    active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
}

export async function updateItem(id, payload) {
  return updateDoc(doc(db, 'items', id), {
    ...payload,
    updated_at: serverTimestamp(),
  });
}

export async function deleteItem(id) {
  return updateDoc(doc(db, 'items', id), {
    active: false,
    updated_at: serverTimestamp(),
  });
}