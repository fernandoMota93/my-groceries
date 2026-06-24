import {
    doc,
    getDocs,
    collection,
    setDoc,
} from 'firebase/firestore';

import { db } from '~/services/firebase';


export interface MeatFractioning {
    id: string;
    name: string;

    gramsPerWeek: number;
    packsPerWeek: number;

    stockGrams: number;
    stockPacks: number;
}


const COLLECTION = 'meat_fractioning';


export async function getMeatFractioning() {

    const snapshot = await getDocs(
        collection(db, COLLECTION)
    );


    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as MeatFractioning[];
}



export async function updateMeatFractioning(
    id: string,
    payload: Partial<MeatFractioning>,
) {

    await setDoc(
        doc(db, COLLECTION, id),
        payload,
        {
            merge: true,
        },
    );

}