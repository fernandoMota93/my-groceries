import type { Timestamp } from 'firebase/firestore';

export interface Shopping {
    id: string;
    month: number;
    year: number;
    title: string;
    is_deleted: boolean;
    created_at?: Timestamp;
    updated_at?: Timestamp;
}