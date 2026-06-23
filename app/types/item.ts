import type { Timestamp } from "firebase/firestore"

export interface Item {
  id: string
  name: string
  category: string
  amount: number
  active: boolean
  created_at: Timestamp
  updated_at: Timestamp
}