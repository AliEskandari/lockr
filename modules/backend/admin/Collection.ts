import { db } from "@/modules/backend/firebase-admin";
import { Collection } from "@/types/Collection";
import { QueryConstraints } from "@/types/QueryConstraints";
import { PartialWithFieldValue } from "firebase-admin/firestore";

export default {
  find: async function (options: QueryConstraints) {
    const [key, value] = Object.entries(options)[0];

    const querySnapshot = await db()
      .collection("collections")
      .where(key, "==", value)
      .get();
    return querySnapshot.docs.map((doc) => doc.data());
  },

  findOne: async function (options: QueryConstraints) {
    const results = await this.find(options);
    if (results.length > 0) return results[0];
    else return null;
  },

  findById: async function (id: string) {
    const docRef = await db().doc(`collections/${id}`).get();
    return docRef.data();
  },

  update: async function (
    id: string,
    params: PartialWithFieldValue<Collection>
  ) {
    return db().doc(`collections/${id}`).update(params);
  },

  updateMany: async function (
    options: QueryConstraints,
    params: PartialWithFieldValue<Collection>
  ) {
    const collections = await this.find(options);
    const bulkWriter = db().bulkWriter();

    collections.forEach((collection) => {
      bulkWriter
        .update(db().doc(`collections/${collection.id}`), params)
        .then((res) => {
          console.log(`Updated document at ${res.writeTime}`);
        });
    });

    return bulkWriter.close().then(() => {
      console.log("Executed all writes");
    });
  },
};
