import React, { useState, useEffect } from "react";
import Layout from "./_layout.js";
import EmailCapturingLayout from "../_layout.js";
import { ModalsContextProvider } from "@/contexts/modals.context";
import ComingSoon from "@/components/empty-states/coming-soon.js";

export default function Overview() {
  const [collections, setCollections] = useState([]);

  if (!collections || collections.length == 0)
    return (
      <div className="text-center">
        <h3>You haven't created an unlock yet!</h3>
        <button>Create a social unlock</button>
      </div>
    );

  return (
    <ModalsContextProvider>
      <ComingSoon />
    </ModalsContextProvider>
  );
}

Overview.getLayout = function getLayout(page: ReactNode) {
  return (
    <EmailCapturingLayout>
      <Layout>{page}</Layout>
    </EmailCapturingLayout>
  );
};
