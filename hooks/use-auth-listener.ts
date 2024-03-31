import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/modules/firebase/app";

export default function useAuthListener() {
  const [user, setUser] = useState<User | undefined | null>();

  useEffect(() => {
    const localStorageAuthUser = localStorage.getItem("authUser");
    if (localStorageAuthUser) setUser(JSON.parse(localStorageAuthUser));

    const listener = onAuthStateChanged(auth, (authUser) => {
      // runs on every load...
      if (authUser) {
        // we have a user...therefore we can store the user in localstorage
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
      } else {
        // we don't have an authUser, therefore clear the localstorage
        localStorage.removeItem("authUser");
        setUser(null);
      }
    });

    return () => listener();
  }, []);

  return user;
}
