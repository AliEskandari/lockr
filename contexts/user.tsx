import { ReactNode, createContext, useContext } from "react";
import useUser from "../hooks/use-user";
import AuthUserContext from "./auth-user";
import { User } from "@/types";
const UserContext = createContext<User | null | undefined>(null);

type Props = {
  children: ReactNode;
};

export function UserContextProvider({ children }: Props) {
  const authUser = useContext(AuthUserContext);
  const user = useUser(authUser?.uid);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
export default UserContext;
