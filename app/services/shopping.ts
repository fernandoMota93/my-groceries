import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";
import { seedShoppingItems } from "./shopping-items";
import type { Shopping } from "~/types/shopping";

const collectionRef = collection(db, "shopping_lists");

export async function getShopping(): Promise<Shopping[]> {
  const q = query(collectionRef, where("is_deleted", "==", false));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      month: data.month,
      year: data.year,
      title: data.title,
      is_deleted: data.is_deleted,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  });
}

export async function createShopping(payload: { month: number; year: number }) {
  const document = await addDoc(collectionRef, {
    month: payload.month,
    year: payload.year,
    title: `${payload.month}/${payload.year}`,
    is_deleted: false,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  await seedShoppingItems(document.id);

  return document;
}

export async function updateShopping(
  id: string,
  payload: {
    month: number;
    year: number;
  },
) {
  return updateDoc(doc(db, "shopping_lists", id), {
    ...payload,

    title: `${payload.month}/${payload.year}`,

    updated_at: serverTimestamp(),
  });
}

export async function deleteShopping(id: string) {
  return updateDoc(doc(db, "shopping_lists", id), {
    is_deleted: true,
    updated_at: serverTimestamp(),
  });
}
