import { ReactNode, createContext } from "react";
import useAuthListener from "../hooks/use-auth-listener";
import { User } from "firebase/auth";

export type AuthUserContextType = User | null | undefined;

const AuthUserContext = createContext<AuthUserContextType>(null);

type Props = {
  children: ReactNode;
};

export function AuthUserContextProvider({ children }: Props) {
  const authUser = useAuthListener();

  return (
    <AuthUserContext.Provider value={authUser}>
      {children}
    </AuthUserContext.Provider>
  );
}

export default AuthUserContext;
