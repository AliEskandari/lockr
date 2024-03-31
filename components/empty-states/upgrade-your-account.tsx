import Link from "next/link";
import React from "react";
import { Paths } from "@/modules/routes";

export default function UpgradeYourAccount() {
  return (
    <div className="w-full py-10 flex justify-center">
      <div className="text-center p-6 max-w-sm rounded-xl flex flex-col items-center gap-y-4">
        <h3>Upgrade your account to unlock analytics.</h3>
        <Link
          href={Paths.Pricing}
          className="py-2 px-4 w-fit rounded-xl bg-red-500 text-white text-sm"
        >
          View pricing
        </Link>
      </div>
    </div>
  );
}
