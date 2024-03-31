import { db } from "@/modules/firebase/app";
import { SocialUnlock } from "@/types";
import LockState from "@/types/LockState";
import {
  PartialWithFieldValue,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const COLLECTION_NAME = "lockStates";

export default {
  create: async function (params: PartialWithFieldValue<SocialUnlock>) {
    const docRef = doc(collection(db, COLLECTION_NAME));
    await setDoc(docRef, {
      ...params,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    });

    return Promise.resolve(docRef);
  },
  update: async function (
    id: string,
    params: PartialWithFieldValue<LockState>
  ) {
    return updateDoc(doc(db, `${COLLECTION_NAME}/${id}`), {
      ...params,
      updatedAt: new Date().toISOString(),
    });
  },

  findById: async function (id: string) {
    const docRef = await getDoc(doc(db, `${COLLECTION_NAME}/${id}`));
    return docRef.data() || null;
  },

  destroy: async function (id: string) {
    return deleteDoc(doc(db, `${COLLECTION_NAME}/${id}`));
  },
};
