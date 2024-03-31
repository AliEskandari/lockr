import { SocialUnlock } from "@/types";
import { db } from "@/modules/backend/firebase-admin";
import {
  PartialWithFieldValue,
  FieldValue,
  CollectionReference,
  Query,
  FieldPath,
} from "firebase-admin/firestore";
import { QueryConstraints } from "@/types/QueryConstraints";

export default {
  find: async function (options: QueryConstraints) {
    const clauses = Object.entries(options);
    let query: CollectionReference | Query = db().collection("socialUnlocks");
    clauses.forEach(([key, value]) => (query = query.where(key, "==", value)));
    const querySnapshot = await query.get();
    return querySnapshot.docs.map((doc) => doc.data() as SocialUnlock);
  },

  findOne: async function (options: QueryConstraints) {
    const results = await this.find(options);
    if (results.length > 0) return results[0];
    else return null;
  },

  findById: async function (id: string) {
    const docRef = await db().doc(`socialUnlocks/${id}`).get();
    if (docRef.exists) return docRef.data() as SocialUnlock;
    else return null;
  },

  update: async function (
    id: string,
    params: PartialWithFieldValue<SocialUnlock>
  ) {
    return db().doc(`socialUnlocks/${id}`).update(params);
  },

  updateMany: async function (
    options: QueryConstraints,
    params: { [key: string]: any }
  ) {
    const socialUnlocks = await this.find(options);
    const bulkWriter = db().bulkWriter();

    socialUnlocks.forEach((socialUnlock) => {
      bulkWriter
        .update(db().doc(`socialUnlocks/${socialUnlock.id}`), params)
        .then((res) => {
          console.log(`Updated document at ${res.writeTime}`);
        });
    });

    return bulkWriter.close().then(() => {
      console.log("Executed all writes");
    });
  },
};
