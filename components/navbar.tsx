import { Disclosure } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  CogIcon,
  EllipsisVerticalIcon,
  GiftIcon,
  LockOpenIcon,
  Square2StackIcon,
  SquaresPlusIcon,
  UserCircleIcon,
  ArrowUpOnSquareIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { default as React, useContext } from "react";
import Modals from "@/modules/constants/Modals";
import { Paths } from "@/modules/routes";
import AuthUserContext from "@/contexts/auth-user";
import ModalsContext from "@/contexts/modals.context";
import SidebarContext from "@/contexts/sidebar";
import SettingsContext from "@/contexts/settings";
import { auth } from "@/modules/firebase/app";
import GenericMenu from "./menus/generic-menu";
import Button from "./buttons/button";
import { SocialUnlock } from "@/types";

type NavbarProps = {
  socialUnlock?: SocialUnlock;
};

export default function Navbar({ socialUnlock }: NavbarProps) {
  const router = useRouter();
  const authUser = useContext(AuthUserContext);
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const modals = useContext(ModalsContext);
  const { settings, setSetting } = useContext(SettingsContext);
  const pathname = router.pathname;
  const redirectTo = Paths.StayRoutes.includes(pathname as any)
    ? null
    : Paths.Dashboard.SocialUnlocks.Overview;

  const handleClickShareButton = () =>
    modals.show(Modals.SOCIAL_UNLOCK.SHARE, { socialUnlock });

  const handleClickDarkModeButton = () => {
    setSetting("darkMode", !settings.darkMode);
  };

  const handleClickSidebarButton = () => setSidebarOpen(!sidebarOpen);

  function Logo() {
    return (
      <Link
        href={authUser ? Paths.Dashboard.SocialUnlocks.Overview : Paths.Home}
        className="rounded-xl tracking-tight font-medium text-2xl active:text-gray-700 dark:active:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 flex items-center gap-x-2"
      >
        <img className="w-7 h-7 inline-flex" src="/assets/logo.png" />
        lockr
      </Link>
    );
  }

  function SidebarButton() {
    return (
      <Button
        onClick={handleClickSidebarButton}
        className="p-2 text-semibold rounded-full mr-1 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Bars3Icon className="flex-shrink-0 h-6 w-6" />
      </Button>
    );
  }

  function ShareButton() {
    return (
      <Button
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={handleClickShareButton}
      >
        <ArrowUpOnSquareIcon className="w-7 h-7" />
      </Button>
    );
  }

  function DarkModeButton() {
    return (
      <Button
        className="hover:bg-gray-100 dark:hover:bg-gray-800 p-1 transition-none"
        onClick={handleClickDarkModeButton}
      >
        {settings.darkMode ? (
          <SunIcon className="w-7 h-7" />
        ) : (
          <MoonIcon className="w-7 h-7" />
        )}
      </Button>
    );
  }

  function MobileMenu() {
    const menuItems = [
      {
        onClick: () => router.push(Paths.Pricing),
        name: "Pricing",
        icon: undefined,
      },
      {
        onClick: () => modals.show(Modals.AUTH.SIGN_UP, { redirectTo }),
        name: "Create account",
        icon: undefined,
      },
      {
        onClick: () => modals.show(Modals.AUTH.SIGN_IN, { redirectTo }),
        name: "Sign in",
        icon: undefined,
      },
    ];
    return (
      <GenericMenu
        menuItems={menuItems}
        placement="bottom-end"
        strategy="fixed"
        classNames={{
          MenuButton:
            "hover:bg-gray-100 dark:hover:bg-gray-800 ring-gray-300 dark:ring-gray-700 p-1",
          MenuItems: "w-48",
          MenuItem: "w-full text-black dark:text-gray-400 active:text-gray-400",
        }}
      >
        <span className="sr-only">Open menu</span>
        <EllipsisVerticalIcon className="w-7 h-7" />
      </GenericMenu>
    );
  }

  function ProfileMenu() {
    const router = useRouter();

    const handleSignOut = async () => {
      await auth.signOut();
      if (router.asPath.includes("/dashboard")) router.push(Paths.Home);
    };

    const profileMenuItems = [
      {
        name: "Locks",
        href: Paths.Dashboard.SocialUnlocks.Overview,
        icon: LockOpenIcon,
      },
      {
        name: "Collections",
        href: Paths.Dashboard.Collections.Overview,
        icon: Square2StackIcon,
      },
      {
        name: "Unlocks",
        href: Paths.Dashboard.Unlocked,
        icon: GiftIcon,
      },
      {
        name: "Accounts",
        href: Paths.Dashboard.Accounts,
        icon: SquaresPlusIcon,
      },
      {
        name: "Settings",
        href: Paths.Dashboard.Settings,
        icon: CogIcon,
      },
      {
        name: "Logout",
        onClick: handleSignOut,
        icon: ArrowRightOnRectangleIcon,
      },
    ];

    return (
      <GenericMenu
        menuItems={profileMenuItems}
        placement="bottom-end"
        strategy="absolute"
        classNames={{
          MenuButton: "hover:bg-gray-100 dark:hover:bg-gray-800 p-1 my-auto",
          MenuItems:
            "text-lg flex flex-col w-48 bg-white dark:bg-gray-900 ring-gray-300 dark:ring-gray-700",
          MenuItem: "w-full text-black dark:text-gray-400 active:text-gray-400",
        }}
      >
        <span className="sr-only">Open profile menu</span>
        <UserCircleIcon className="w-7 h-7" />
      </GenericMenu>
    );
  }

  return (
    <Disclosure as="nav" className="z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-[4.5rem] items-center">
          {pathname.includes("/dashboard") ? <SidebarButton /> : null}

          <Logo />

          <div className="flex ml-auto items-center space-x-2">
            {pathname.includes("[social-unlock-id]") ? <ShareButton /> : null}
            <DarkModeButton />
            {authUser ? <ProfileMenu /> : <MobileMenu />}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
