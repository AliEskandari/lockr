import { setCookie } from "cookies-next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { ReactNode, useContext } from "react";
import UserContext from "@/contexts/user";
import { trpc } from "@/modules/trpc/vanilla-trpc";
import AccountCard from "@/components/cards/account-card";
import { TwitterIcon, YoutubeIcon } from "@/components/icons";
import Layout from "./_layout";
import { ReloadableUser } from "@/types/App/User";
import { Provider } from "@/types";

export type AccountType = {
  key: Provider.Key;
  name: Provider.Name;
  onRevoke: (user: ReloadableUser) => Promise<void>;
  onClick: (user: ReloadableUser) => void;
  color: string;
  Icon: any;
};

const ACCOUNT_TYPES: { [key: string]: AccountType } = {
  YOUTUBE: {
    key: "google",
    name: "Youtube",
    onRevoke: async (user: ReloadableUser) => {
      await trpc.google.revoke.mutate({ userId: user.id });
      return user.reload();
    },
    onClick: (user) => {
      setCookie("userId", user.id);
      signIn("google");
    },
    color:
      "bg-red-500 dark:bg-red-800 hover:bg-red-600 dark:hover:bg-red-700 active:bg-red-300 dark:active:bg-red-600",
    Icon: YoutubeIcon,
  },
  TWITTER: {
    key: "twitter",
    name: "Twitter",
    onRevoke: async (user: ReloadableUser) => {
      await trpc.twitter.revoke.mutate({ userId: user.id });
      return user.reload();
    },
    onClick: (user) => {
      setCookie("userId", user.id);
      signIn("twitter");
    },
    color:
      "bg-blue-500 dark:bg-blue-800 hover:bg-blue-600 dark:hover:bg-blue-700 active:bg-blue-300 dark:active:bg-blue-600",
    Icon: TwitterIcon,
  },
};

export default function Accounts() {
  const user = useContext(UserContext);

  return (
    <>
      <Head>
        <title>Accounts - Lockr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul
        role="list"
        className="grid grid-cols-3 gap-6 @sm:grid-cols-4 @lg:grid-cols-5 @3xl:grid-cols-6 @5xl:grid-cols-7 min-w-min"
      >
        {user &&
          Object.values(ACCOUNT_TYPES).map((accountType) => (
            <AccountCard key={accountType.key} accountType={accountType} />
          ))}
      </ul>
    </>
  );
}

Accounts.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
};
