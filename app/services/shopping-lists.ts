import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "./firebase";
import type { ShoppingList } from "~/types/shopping-list";

const shoppingListsCollection = () => collection(db, "shopping_lists");

/**
 * Busca as N listas de compras mais recentes (não deletadas), ordenadas
 * da mais antiga para a mais recente — ordem que os gráficos esperam.
 *
 * Ordenamos por year/month porque é o que existe no documento da lista
 * (não dependemos de created_at, que pode não refletir o mês de referência
 * em casos de edição manual).
 */
export async function getRecentShoppingLists(
  monthsBack = 12,
): Promise<ShoppingList[]> {
  const snapshot = await getDocs(
    query(
      shoppingListsCollection(),
      orderBy("year", "desc"),
      orderBy("month", "desc"),
      limit(monthsBack),
    ),
  );

  const lists = snapshot.docs
    .map((document) => {
      const data = document.data();

      return {
        id: document.id,
        ...data,
      } as ShoppingList;
    })
    .filter((list) => !list.is_deleted);

  // devolve em ordem cronológica crescente (mais antigo -> mais recente)
  return lists.reverse();
}