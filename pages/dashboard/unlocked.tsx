import React, { ReactNode } from "react";
import ComingSoon from "@/components/empty-states/coming-soon";
import Layout from "./_layout";

export default function SocialPages() {
  return <ComingSoon />;
}

SocialPages.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
};
