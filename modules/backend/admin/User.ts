import { PartialWithFieldValue, SetOptions } from "firebase-admin/firestore";
import { db } from "@/modules/backend/firebase-admin";
import { QueryConstraints } from "@/types/QueryConstraints";
import { User } from "@/types/App/User";

export const SUBSCRIPTION_STATUS = {
  TRIALING: "TRIALING",
  ACTIVE: "ACTIVE",
  INCOMPLETE: "INCOMPLETE",
  INCOMPLETE_EXPIRED: "INCOMPLETE_EXPIRED",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
  UNPAID: "UNPAID",
};

export default {
  update: function (
    id: string,
    params: PartialWithFieldValue<User>,
    options: SetOptions = { merge: true }
  ) {
    return db().doc(`users/${id}`).set(params, options);
  },
  find: async function (options: QueryConstraints) {
    const [key, value] = Object.entries(options)[0];

    const querySnapshot = await db()
      .collection("users")
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
    const docRef = await db().doc(`users/${id}`).get();
    if (!docRef.exists) throw Error("User does not exist");
    return docRef.data() as User;
  },
};
