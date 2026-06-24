import type { Timestamp } from "firebase/firestore"

export interface Item {
  id: string
  name: string
  category: string
  amount: number
  active: boolean
  order: number
  created_at: Timestamp
  updated_at: Timestamp
}