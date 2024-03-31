import { PartialWithFieldValue, SetOptions } from "firebase-admin/firestore";
import LockState from "@/types/LockState";
import { db } from "@/modules/backend/firebase-admin";
import { SocialUnlock } from "@/types/SocialUnlock";
const COLLECTION_NAME = "lockStates";

export default {
  findById: async function (id: string) {
    const docRef = await db().doc(`${COLLECTION_NAME}/${id}`).get();
    return docRef.data();
  },

  update: async function (
    id: string,
    params: PartialWithFieldValue<SocialUnlock>,
    options: SetOptions = { merge: true }
  ) {
    return db().doc(`${COLLECTION_NAME}/${id}`).set(params, options);
  },
};
