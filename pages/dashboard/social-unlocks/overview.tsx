import EmptySocialUnlocks from "@/components/empty-states/empty-social-unlocks";
import SocialUnlockTable from "@/components/tables/social-unlock-table";
import AuthUserContext from "@/contexts/auth-user";
import { ModalsContextProvider } from "@/contexts/modals.context";
import db from "@/modules/db";
import { STATUS } from "@/modules/db/SocialUnlock";
import { SocialUnlock } from "@/types/SocialUnlock";
import { ReactNode, useContext, useEffect, useState } from "react";
import DashboardLayout from "../_layout";
import Layout from "./_layout";
import { Unsubscribe } from "firebase/firestore";

export default function Overview() {
  const [socialUnlocks, setSocialUnlocks] = useState<SocialUnlock[]>();
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    if (!authUser) return;
    let unsubscribe: Unsubscribe;
    (async function () {
      unsubscribe = db.SocialUnlock.find(
        { "user.id": authUser.uid, status: STATUS.ACTIVE },
        (socialUnlocks) => {
          setSocialUnlocks(socialUnlocks);
        }
      );
    })();

    return () => unsubscribe();
  }, []);

  if (!socialUnlocks) {
    // not loaded yet
    return;
  }

  if (socialUnlocks.length == 0) return <EmptySocialUnlocks />;

  return (
    <ModalsContextProvider>
      <SocialUnlockTable data={socialUnlocks} />
    </ModalsContextProvider>
  );
}

Overview.getLayout = function getLayout(page: ReactNode) {
  return (
    <DashboardLayout>
      <Layout>{page}</Layout>
    </DashboardLayout>
  );
};
