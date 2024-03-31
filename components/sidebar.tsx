import {
  ArrowRightOnRectangleIcon,
  CogIcon,
  GiftIcon,
  LockClosedIcon,
  Square2StackIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import LinkOrButton from "@/components/buttons/link-or-button";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { useContext } from "react";
import { signOut } from "@/modules/auth/auth";
import SidebarContext from "@/contexts/sidebar";
import UserContext from "@/contexts/user";
import { Paths } from "@/modules/routes";
import { classNames } from "@/modules/functions/css";
import { isPro } from "@/modules/functions/user";

const navigationItems = [
  {
    name: "Locks",
    href: Paths.Dashboard.SocialUnlocks.Overview,
    parentRoute: "/dashboard/social-unlocks",
    icon: LockClosedIcon,
    current: false,
  },
  {
    name: "Collections",
    href: Paths.Dashboard.Collections.Overview,
    parentRoute: "/dashboard/collections",
    icon: Square2StackIcon,
    current: false,
  },
  {
    name: "Unlocks",
    href: Paths.Dashboard.Unlocked,
    parentRoute: "/dashboard/unlocked",
    icon: GiftIcon,
    current: false,
  },
  {
    name: "Accounts",
    href: Paths.Dashboard.Accounts,
    parentRoute: "/dashboard/accounts",
    icon: SquaresPlusIcon,
    current: false,
  },
  {
    name: "Settings",
    href: Paths.Dashboard.Settings,
    parentRoute: "/dashboard/settings",
    icon: CogIcon,
    current: false,
  },
  {
    name: "Logout",
    onClick: async (router: NextRouter) => {
      await signOut();
      if (router.asPath.includes("/dashboard")) router.push(Paths.Home);
    },
    icon: ArrowRightOnRectangleIcon,
    current: false,
  },
];

const UpgradeButton = () => (
  <Link
    key="upgrade"
    href={Paths.Pricing}
    className="group flex items-center px-6 lg:px-8 py-1"
  >
    <span className="rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 p-3 flex space-x-2 items-center">
      <span className="inline-flex font-normal text-xs rounded-xl py-1 px-2 bg-black dark:bg-gray-100 text-gray-100 dark:text-black">
        PRO
      </span>
      <span className="inline-flex text-sm">Upgrade your account</span>
    </span>
  </Link>
);

export default function Sidebar() {
  const { setSidebarOpen, autoClose } = useContext(SidebarContext);
  const router = useRouter();
  const user = useContext(UserContext);
  const currentRoute = router.asPath;
  navigationItems.map((navigationItem) => {
    navigationItem.current =
      navigationItem.parentRoute &&
      currentRoute.includes(navigationItem.parentRoute)
        ? true
        : false;
  });

  return (
    <div className="w-[300px] bg-white dark:bg-gray-900 flex flex-col overflow-y-auto border-r dark:border-gray-700 h-full">
      <div className="flex flex-grow flex-col">
        <nav className="flex-1 space-y-1 text-lg" aria-label="Sidebar">
          {navigationItems.map((item) => (
            <LinkOrButton
              key={item.name}
              href={item.href}
              onClick={() => {
                item.onClick?.(router);
                if (autoClose) setSidebarOpen(false);
              }}
              className={classNames(
                item.current
                  ? "font-medium" // current
                  : "", // not current
                "group flex items-center px-6 lg:px-8 py-1" // all links
              )}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? "" // current
                    : "", // not current
                  "mx-2 flex-shrink-0 h-6 w-6 " // all icons
                )}
                aria-hidden="true"
              />
              <span
                className={classNames(
                  item.current
                    ? "" // current
                    : "rounded-xl group-hover:bg-gray-100 dark:group-hover:bg-gray-800 ", // not current
                  "p-2" // all names
                )}
              >
                {item.name}
              </span>
            </LinkOrButton>
          ))}
          {user && !isPro(user) ? <UpgradeButton /> : null}
        </nav>
      </div>
    </div>
  );
}
