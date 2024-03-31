import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { env } from "@/modules/env";

function formatFirebasePrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const privateKey = formatFirebasePrivateKey(params.privateKey);

  // if already created, return the same instance
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // create certificate
  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  // initialize admin app
  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
  });
}

export async function initializeAdmin() {
  const params = {
    projectId: env.NEXT_PUBLIC__GCP_PROJECT_ID,
    clientEmail: env.FIREBASE_ADMIN__CLIENT_EMAIL,
    privateKey: env.FIREBASE_ADMIN__PRIVATE_KEY,
  };

  return createFirebaseAdminApp(params);
}

export function db() {
  return getFirestore();
}
