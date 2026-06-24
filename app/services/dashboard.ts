import { getRecentShoppingLists } from "./shopping-lists";
import { getShoppingItems } from "./shopping-items";
import type { ShoppingList } from "~/types/shopping-list";
import type { ShoppingItem } from "~/types/shopping-item";
import type {
  MonthlyTotal,
  MonthlyTotalsChartPoint,
  MonthlyTotalsResult,
  ItemPriceHistory,
} from "~/types/dashboard";

const MONTH_LABELS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function monthKey(list: ShoppingList): string {
  return `${list.year}-${String(list.month).padStart(2, "0")}`;
}

function monthLabel(list: ShoppingList): string {
  return `${MONTH_LABELS[list.month - 1] ?? list.month}/${list.year}`;
}

/**
 * Busca, em paralelo, os itens de cada lista informada.
 * Retorna pares [lista, itens] preservando a ordem de entrada.
 */
async function fetchItemsForLists(
  lists: ShoppingList[],
): Promise<Array<{ list: ShoppingList; items: ShoppingItem[] }>> {
  const results = await Promise.all(
    lists.map(async (list) => ({
      list,
      items: await getShoppingItems(list.id),
    })),
  );

  return results;
}

/**
 * Agrega o total gasto por mês e por categoria, considerando apenas
 * itens efetivamente comprados (total_price > 0). Valores em centavos.
 *
 * Itens com buy = 0 mas total_price > 0 (ex: sobra de cálculo anterior)
 * ainda contam, pois total_price reflete o valor realmente lançado
 * pelo usuário ao registrar a compra.
 */
export async function getMonthlyTotals(
  monthsBack = 12,
): Promise<MonthlyTotalsResult> {
  const lists = await getRecentShoppingLists(monthsBack);
  const itemsByList = await fetchItemsForLists(lists);

  const monthlyTotals: MonthlyTotal[] = itemsByList.map(({ list, items }) => {
    const byCategory: Record<string, number> = {};
    let total = 0;

    for (const item of items) {
      const value = item.total_price || 0;

      if (value <= 0) continue;

      byCategory[item.category] = (byCategory[item.category] || 0) + value;
      total += value;
    }

    return {
      key: monthKey(list),
      label: monthLabel(list),
      month: list.month,
      year: list.year,
      total,
      byCategory,
    };
  });

  // Categorias ordenadas pelo total acumulado no período (maior -> menor),
  // para que o BarChart empilhado mostre as categorias mais relevantes primeiro.
  const accumulatedByCategory: Record<string, number> = {};

  for (const monthly of monthlyTotals) {
    for (const [category, value] of Object.entries(monthly.byCategory)) {
      accumulatedByCategory[category] =
        (accumulatedByCategory[category] || 0) + value;
    }
  }

  const categories = Object.entries(accumulatedByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  const points: MonthlyTotalsChartPoint[] = monthlyTotals.map((monthly) => {
    const point: MonthlyTotalsChartPoint = {
      label: monthly.label,
      total: monthly.total,
    };

    for (const category of categories) {
      point[category] = monthly.byCategory[category] || 0;
    }

    return point;
  });

  return { points, categories };
}

/**
 * Monta o histórico de preço unitário (em centavos) de um item específico,
 * identificado por `name`, ao longo dos últimos `monthsBack` meses.
 *
 * Meses em que o item não aparece na lista (ex: item adicionado ao catálogo
 * depois) simplesmente não geram ponto no histórico.
 */
export async function getItemPriceHistory(
  itemName: string,
  monthsBack = 12,
): Promise<ItemPriceHistory | null> {
  const lists = await getRecentShoppingLists(monthsBack);
  const itemsByList = await fetchItemsForLists(lists);

  const points = [];
  let category = "";

  for (const { list, items } of itemsByList) {
    const found = items.find((item) => item.name === itemName);

    if (!found || !found.unit_price) continue;

    category = found.category;

    points.push({
      key: monthKey(list),
      label: monthLabel(list),
      unitPrice: found.unit_price,
    });
  }

  if (points.length === 0) return null;

  return { name: itemName, category, points };
}

/**
 * Lista os nomes de itens (distintos) que aparecem nos últimos `monthsBack`
 * meses, para alimentar um seletor de item no histórico de preço.
 */
export async function getAvailableItemNames(
  monthsBack = 12,
): Promise<string[]> {
  const lists = await getRecentShoppingLists(monthsBack);
  const itemsByList = await fetchItemsForLists(lists);

  const names = new Set<string>();

  for (const { items } of itemsByList) {
    for (const item of items) {
      if (item.unit_price > 0) {
        names.add(item.name);
      }
    }
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b, "pt-BR"));
}