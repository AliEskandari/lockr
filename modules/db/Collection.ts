import { db } from "@/modules/firebase/app";
import {
  collection,
  getDoc,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  PartialWithFieldValue,
  Unsubscribe,
} from "firebase/firestore";
import User from "./User";
import type { SocialUnlock } from "@/types";
import { Collection, PopulatedCollection } from "@/types/Collection";
import { QueryConstraints } from "@/types/QueryConstraints";
import { DeepNonNullable } from "@/types/DeepNonNullable";
import _SocialUnlock from "./SocialUnlock";

const COLLECTION_NAME = "collections";

const create = async function (_collection: Collection) {
  const docRef = doc(collection(db, `${COLLECTION_NAME}`));
  await setDoc(docRef, {
    ..._collection,
    id: docRef.id,
    status: "active",
    views: 0,
    createdAt: new Date().toISOString(),
  });

  await User.addCollection(_collection.user.id, docRef.id);
  return Promise.resolve(docRef);
};

const update = async function (
  id: string,
  params: PartialWithFieldValue<Collection>
) {
  return updateDoc(doc(db, `${COLLECTION_NAME}/${id}`), {
    ...params,
    updatedAt: new Date().toISOString(),
  });
};

const find: {
  (constraints: QueryConstraints, callback: undefined): Promise<Collection[]>;
  (
    constraints: QueryConstraints,
    callback: (collections: Collection[]) => void
  ): Unsubscribe;
} = (
  constraints: QueryConstraints,
  callback: ((collections: Collection[]) => void) | undefined
): any => {
  const entries = Object.entries(constraints);
  const queryConstraints = entries.map((entry) =>
    where(entry[0], "==", entry[1])
  );
  const q = query(collection(db, `${COLLECTION_NAME}`), ...queryConstraints);
  if (callback) {
    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map((doc) => doc.data() as Collection);
      callback(docs);
    });
  } else {
    return getDocs(q).then((querySnapshot) =>
      querySnapshot.docs.map((doc) => doc.data() as Collection)
    );
  }
};

const findById = async function (id: string) {
  const docRef = doc(db, `${COLLECTION_NAME}/${id}`);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  else return docSnap.data() as Collection;
};

const _delete = function (id: string) {
  return update(id, {
    status: "deleted",
    deletedAt: new Date().toISOString(),
  });
};

const destroy = async function (id: string, userId: string) {
  await deleteDoc(doc(db, `${COLLECTION_NAME}/${id}`));
  return User.removeCollection(userId, id);
};

/**
 * Populate reference fields (socialUnlocks)
 */
const populate = async function (collection: Collection) {
  const populatedCollection: PopulatedCollection = {
    ...collection,
    collectionSocialUnlocks: {},
  };
  const promises = Object.entries(collection.collectionSocialUnlocks).map(
    ([key, collectionSocialUnlock]) => {
      const {
        id,
        socialUnlock: socialUnlockId,
        title,
      } = collectionSocialUnlock;

      return new Promise<void>(async (resolve, reject) => {
        if (typeof socialUnlockId != "string") return resolve();
        const socialUnlock = await _SocialUnlock.findById(socialUnlockId);
        if (!socialUnlock) return resolve();
        populatedCollection.collectionSocialUnlocks[parseInt(key)] = {
          id,
          title,
          socialUnlock: socialUnlock as DeepNonNullable<SocialUnlock>,
        };
        return resolve();
      });
    }
  );

  await Promise.all(promises);

  return populatedCollection;
};
/**
 * Converts data to references (socialUnlocks)
 */
const unpopulate = function (populatedCollection: PopulatedCollection) {
  const collection: Collection = {
    ...populatedCollection,
    collectionSocialUnlocks: {},
  };
  Object.entries(populatedCollection.collectionSocialUnlocks).forEach(
    async ([key, { id, socialUnlock, title }]) => {
      if (typeof socialUnlock != "object") return;
      collection.collectionSocialUnlocks[parseInt(key)] = {
        id,
        title,
        socialUnlock: socialUnlock.id!,
      };
    }
  );
  return collection;
};

export default {
  create,
  update,
  find,
  findById,
  delete: _delete,
  destroy,
  populate,
  unpopulate,
};
