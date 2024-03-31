import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "firebase/firestore";
import "firebase/auth";
import _debug from "../debug";
const debug = _debug.extend("firebase");

var firebaseConfig;
if (process.env.NEXT_PUBLIC__GCP_PROJECT_ID === "social-unlock-c4273") {
  debug(`Using firebase config for: social-unlock-c4273`);

  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC__FIREBASE__API_KEY,
    authDomain: "lockr.social",
    projectId: "social-unlock-c4273",
    storageBucket: "social-unlock-c4273.appspot.com",
    messagingSenderId: "1077909172586",
    appId: "1:1077909172586:web:129cc1f9f5987a0f163513",
    measurementId: "G-QSXHPSNN4V",
  };
} else {
  // firebase dev
  debug(`Using firebase config for: lockr-dev-b5f20`);

  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC__FIREBASE__API_KEY,
    authDomain: "lockr-dev-b5f20.firebaseapp.com",
    projectId: "lockr-dev-b5f20",
    storageBucket: "lockr-dev-b5f20.appspot.com",
    messagingSenderId: "166900537816",
    appId: "1:166900537816:web:653e56df6f56582065faad",
    measurementId: "G-BSW1W262P0",
  };
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
