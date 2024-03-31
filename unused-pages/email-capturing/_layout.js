import React from "react";
import Link from "next/link";
import { Paths } from "@/modules/routes";
import { useRouter } from "next/router";
import { classNames } from "@/modules/functions/css";

const tabs = [
  { name: "Overview", href: Paths.Dashboard.Collections.Overview },
  { name: "Create", href: Paths.Dashboard.Collections.Create },
];

export default function EmailCapturingLayout({ children }: { children: ReactNode) {
  const router = useRouter();
  const currentRoute = router.asPath;
  tabs.map((tab) => {
    tab.current = currentRoute === tab.href ? true : false;
  });
  return (
    <div className="w-full">
      <div className="w-full">{children}</div>
    </div>
  );
}
