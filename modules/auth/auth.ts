import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import db from "../db";
import { auth } from "@/modules/firebase/app";
import { logEvent } from "@/modules/analytics/logEvent";

export async function signUpWithEmailAndPassword(
  email: string,
  password: string
) {
  const createdUserResult = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return db.User.create({
    id: createdUserResult.user.uid,
    email,
    createdAt: Date.now(),
  }).then((result) => {
    logEvent({ name: "sign_up", method: "EmailAndPassword" });
    return result;
  });
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
) {
  return firebaseSignInWithEmailAndPassword(auth, email, password).then(
    (result) => {
      logEvent({ name: "login", method: "EmailAndPassword" });
      return result;
    }
  );
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  // successfully signed into auth...
  const user = result.user;
  const { email } = user;

  // if haven't created user doc yet...
  if (email && !(await db.User.findOne({ email }))) {
    return db.User.create({ id: user.uid, email, createdAt: Date.now() }).then(
      (result) => {
        logEvent({ name: "sign_up", method: "Google" });
        return result;
      }
    );
  } else {
    logEvent({ name: "login", method: "Google" });
    return user;
  }
}

export async function sendPasswordResetEmail(email: string) {
  return firebaseSendPasswordResetEmail(auth, email);
}

export async function signOut() {
  return auth.signOut();
}
