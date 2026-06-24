
export interface MonthlyTotal {
  /** Chave de ordenação/exibição, ex: "2026-07" */
  key: string;
  /** Label amigável, ex: "Jul/2026" */
  label: string;
  month: number;
  year: number;
  /** Total geral do mês em centavos */
  total: number;
  /** Total por categoria em centavos, ex: { "Carnes e Frios": 4500 } */
  byCategory: Record<string, number>;
}

/**
 * Resultado pronto para alimentar o BarChart (vue-chrts), já "achatado":
 * cada categoria se torna uma chave numérica no próprio objeto do mês.
 */
export interface MonthlyTotalsChartPoint {
  label: string;
  total: number;
  [category: string]: string | number;
}

export interface MonthlyTotalsResult {
  points: MonthlyTotalsChartPoint[];
    categories: string[];
}

/**
 * Um ponto no histórico de preço unitário de um item específico.
 */
export interface ItemPricePoint {
  key: string;
  label: string;
  unitPrice: number;
}

export interface ItemPriceHistory {
  name: string;
  category: string;
  points: ItemPricePoint[];
}