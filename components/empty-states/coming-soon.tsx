import Link from "next/link";
import React from "react";
import { Paths } from "@/modules/routes";

export default function ComingSoon() {
  return (
    <div className="w-full py-10 flex justify-center">
      <div className="text-center p-6 max-w-sm rounded-xl flex flex-col items-center gap-y-4">
        <h3>This feature is coming soon!</h3>
      </div>
    </div>
  );
}
