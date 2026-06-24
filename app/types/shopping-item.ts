import type { Timestamp } from 'firebase/firestore';

export interface ShoppingItem {
  id: string;
  item_id: string;
  name: string;
  category: string;
  maintain: number;
  stock: number;
  buy: number;
  unit_price: number;
  order: number;
  total_price: number;
  checked: boolean;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}