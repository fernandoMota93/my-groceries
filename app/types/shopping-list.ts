import type { Timestamp } from 'firebase/firestore';

export interface ShoppingList {
  id: string;
  title: string;
  month: number;
  year: number;
  is_deleted: boolean;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}