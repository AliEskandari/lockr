import { User } from "@/types";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
  PartialWithFieldValue,
} from "firebase/firestore";
import { db } from "@/modules/firebase/app";

export default {
  create: async function (params: Partial<User>) {
    return await setDoc(doc(db, "users", params.id), {
      ...params,
      createdAt: new Date().toISOString(),
    });
  },
  find: async function (options: { [key: string]: string }) {
    const [key, value] = Object.entries(options)[0];
    const q = query(collection(db, "users"), where(key, "==", value));

    return getDocs(q).then((querySnapshot) =>
      querySnapshot.docs.map((doc) => doc.data())
    );
  },
  findOne: async function (options: { [key: string]: string }) {
    const results = await this.find(options);
    if (results.length > 0) return results[0];
    else return null;
  },
  findById: async function (id: string) {
    if (!id) throw Error("User ID cannot be null");
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data() as User;
    else return null;
  },
  update: function (
    { id }: { id: string },
    params: PartialWithFieldValue<User>
  ) {
    return updateDoc(doc(db, `users/${id}`), {
      ...params,
      updatedAt: new Date().toISOString(),
    });
  },
  removeSocialUnlock: function (id: string, socialUnlockId: string) {
    return updateDoc(doc(db, `users/${id}`), {
      socialUnlocks: arrayRemove(socialUnlockId),
    });
  },
  addSocialUnlock: function (id: string, socialUnlockId: string) {
    return updateDoc(doc(db, `users/${id}`), {
      socialUnlocks: arrayUnion(socialUnlockId),
    });
  },
  removeCollection: function (id: string, collectionId: string) {
    return updateDoc(doc(db, `users/${id}`), {
      collections: arrayRemove(collectionId),
    });
  },
  addCollection: function (id: string, collectionId: string) {
    return updateDoc(doc(db, `users/${id}`), {
      collections: arrayUnion(collectionId),
    });
  },
};
