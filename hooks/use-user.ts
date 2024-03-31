import { useState, useEffect } from "react";
import db from "@/modules/db";
import { ReloadableUser } from "@/types";

/**
 * User is initialized to 'undefined' until data is fetched
 * from backend.
 * @param {*} userId
 * @returns
 */
export default function useUser(userId?: string) {
  const [activeUser, setActiveUser] = useState<ReloadableUser>();

  const loadUser = async () => {
    const user = (await db.User.findById(userId!)) as ReloadableUser;
    if (user) user.reload = loadUser;
    setActiveUser(user || null);
  };

  useEffect(() => {
    (async function () {
      if (!userId) return setActiveUser(undefined);
      loadUser();
    })();
  }, [userId]);

  return activeUser;
}
