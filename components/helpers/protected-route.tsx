import AuthUserContext from "@/contexts/auth-user";
import { Paths } from "@/modules/routes";
import { useRouter } from "next/router";
import { ReactNode, useContext, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const authUser = useContext(AuthUserContext);
  const router = useRouter();

  useEffect(() => {
    if (authUser === null) {
      // user has loaded... and is null (not logged in)
      router.push(Paths.Home);
    }
  }, [authUser]);

  if (!authUser) return null;

  return <>{children}</>;
}
