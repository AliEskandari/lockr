import { AuthUserContextProvider } from "@/contexts/auth-user";
import { ModalsContextProvider } from "@/contexts/modals.context";
import { SettingsContextProvider } from "@/contexts/settings";
import { SidebarContextProvider } from "@/contexts/sidebar";
import { UserContextProvider } from "@/contexts/user";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NextPage } from "next";
import { AppProps } from "next/app";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "../components/navbar";
import { trpc } from "../modules/trpc/trpc";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const ComponentWithLayout = Component as any;
  const getLayout = ComponentWithLayout.getLayout || ((page: NextPage) => page);

  return (
    <SettingsContextProvider>
      <AuthUserContextProvider>
        <UserContextProvider>
          <SidebarContextProvider>
            <ModalsContextProvider>
              <main className="flex flex-col">
                <Navbar {...pageProps} />
                {getLayout(<Component {...pageProps} />)}
              </main>
            </ModalsContextProvider>
          </SidebarContextProvider>
        </UserContextProvider>
      </AuthUserContextProvider>
    </SettingsContextProvider>
  );
}

export default trpc.withTRPC(MyApp);
