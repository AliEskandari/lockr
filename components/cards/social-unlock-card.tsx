import { SocialUnlock } from "@/types";
import React from "react";
import Button from "../buttons/button";
import Link from "next/link";
import { Paths } from "@/modules/routes";
import Skeleton from "react-loading-skeleton";
import { classNames } from "@/modules/functions/css";
import tw from "@/modules/tailwind";

type SocialUnlockCardProps = {
  socialUnlock: SocialUnlock;
  className: string;
};
export default function SocialUnlockCard({
  socialUnlock,
  className,
}: SocialUnlockCardProps) {
  return (
    <Button
      className={classNames(
        "text-2xl p-4 flex-none bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600",
        className
      )}
    >
      <Link href={Paths.SocialUnlock.replace(":id", socialUnlock.id)}>
        {socialUnlock.title || (
          <Skeleton
            width={"150px"}
            baseColor={tw.colors.gray["500"]}
            highlightColor={tw.colors.gray["400"]}
            className="rounded-md"
          />
        )}
      </Link>
    </Button>
  );
}
