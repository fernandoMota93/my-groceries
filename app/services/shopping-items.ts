import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";
import { getItems, getWeeklyItems } from "./items";
import type { ShoppingItem } from "~/types/shopping-item";

const shoppingItemsCollection = (shoppingId: string) =>
  collection(db, "shopping_lists", shoppingId, "items");



export async function getShoppingItems(
  shoppingId: string,
): Promise<ShoppingItem[]> {
  const snapshot = await getDocs(
    collection(db, "shopping_lists", shoppingId, "items"),
  );

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      ...data,
    } as ShoppingItem;
  });
}

export async function createShoppingItem(shoppingId: string, payload: any) {
  return addDoc(shoppingItemsCollection(shoppingId), payload);
}

export async function addIndividualShoppingItem(
  shoppingId: string,
  item: Item,
) {
  return createShoppingItem(shoppingId, {
    item_id: item.id,
    name: item.name,
    category: item.category,
    maintain: item.amount,
    stock: 0,
    buy: item.amount,
    unit_price: 0,
    total_price: 0,
    order: item.order,
    checked: false,
  });
}

export async function addIndividualShoppingItemWeekly(
  shoppingId: string,
  item: Item,
) {
  return createShoppingItem(shoppingId, {
    item_id: item.id,
    name: item.name,
    category: item.category,
    maintain: item.amount,
    stock: 0,
    buy: item.amount,
    unit_price: 0,
    total_price: 0,
    order: item.order,
    checked: false,
  });
}

export async function seedShoppingItems(shoppingId: string) {
  const items = await getItems();

  const promises = items.map((item) =>
    createShoppingItem(shoppingId, {
      item_id: item.id,
      name: item.name,
      category: item.category,
      maintain: item.amount,
      stock: 0,
      buy: item.amount,
      unit_price: 0,
      total_price: 0,
      order: item.order,
      checked: false,
    }),
  );

  await Promise.all(promises);
  
}

export async function updateShoppingItem(
  shoppingId: string,
  itemId: string,
  payload: Partial<ShoppingItem>,
) {
  return updateDoc(doc(db, "shopping_lists", shoppingId, "items", itemId), {
    ...payload,
    updated_at: serverTimestamp(),
  });
}


//SEMANAL


const shoppingItemsCollectionWeekly = (shoppingId: string) =>
  collection(db, "weekly_shopping_lists", shoppingId, "items");

export async function createShoppingItemWeekly(shoppingId: string, payload: any) {
  return addDoc(shoppingItemsCollectionWeekly(shoppingId), payload);
}

export async function seedShoppingItemsWeekly(shoppingId: string) {
  const items = await getWeeklyItems();

  const promises = items.map((item) =>
    createShoppingItemWeekly(shoppingId, {
      item_id: item.id,
      name: item.name,
      category: item.category,
      maintain: item.amount,
      stock: 0,
      buy: item.amount,
      unit_price: 0,
      total_price: 0,
      order: item.order,
      checked: false,
    }),
  );

  await Promise.all(promises);
}


export async function getShoppingItemsWeekly(
  shoppingId: string,
): Promise<ShoppingItem[]> {
  const snapshot = await getDocs(
    collection(db, "weekly_shopping_lists", shoppingId, "items"),
  );

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      ...data,
    } as ShoppingItem;
  });
}



export async function updateShoppingItemWeekly(
  shoppingId: string,
  itemId: string,
  payload: Partial<ShoppingItem>,
) {
  return updateDoc(doc(db, "weekly_shopping_lists", shoppingId, "items", itemId), {
    ...payload,
    updated_at: serverTimestamp(),
  });
}
