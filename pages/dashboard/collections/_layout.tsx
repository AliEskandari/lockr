import Button from "@/components/buttons/button";
import { classNames } from "@/modules/functions/css";
import { Paths } from "@/modules/routes";
import { ListBulletIcon, PlusIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const tabs = [
  {
    name: "Overview",
    href: Paths.Dashboard.Collections.Overview,
    current: false,
    icon: <ListBulletIcon />,
  },
  {
    name: "Create",
    href: Paths.Dashboard.Collections.Create,
    current: false,
    icon: <PlusIcon />,
  },
];

export default function CollectionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const currentRoute = router.asPath;
  tabs.map((tab) => {
    tab.current = currentRoute === tab.href ? true : false;
  });
  return (
    <>
      <Head>
        <title>Collections - Lockr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="collections-layout" className="flex-1 flex flex-col">
        {/* Tabs */}
        <div
          id="collections-layout-tabs"
          className="mb-4 whitespace-nowrap overflow-x-auto min-h-min"
        >
          {tabs.map((tab) => (
            <Link key={tab.name} href={tab.href} passHref>
              <Button
                className={classNames(
                  tab.current
                    ? "!rounded-none border-b border-black dark:border-white" // current
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl", // not current
                  "font-normal px-2 py-2 mr-2 mb-2 items-center inline-flex space-x-1 transition-colors"
                )}
              >
                <span className="w-6 h-6 inline-flex">{tab.icon}</span>
                <span className="inline-flex">{tab.name}</span>
              </Button>
            </Link>
          ))}
        </div>
        {/* Content */}
        <div
          id="collections-layout-content"
          className="w-full overflow-x-visible flex-1"
        >
          {children}
        </div>
      </div>
    </>
  );
}
