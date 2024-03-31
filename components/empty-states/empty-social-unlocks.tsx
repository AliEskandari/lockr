import Link from "next/link";
import React from "react";
import { Paths } from "@/modules/routes";

export default function EmptySocialUnlocks() {
  return (
    <div className="w-full py-10 flex justify-center">
      <div className="text-center p-6 max-w-sm rounded-xl flex flex-col items-center gap-y-4">
        <h3>You haven't created a social unlock yet!</h3>
        <Link
          href={Paths.Dashboard.SocialUnlocks.Create}
          className="py-2 px-4 w-fit rounded-xl bg-red-500 text-white text-sm"
        >
          Create a social unlock
        </Link>
      </div>
    </div>
  );
}
