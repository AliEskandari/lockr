import React from "react";
import Layout from "./_layout.js";
import EmailCapturingLayout from "../_layout.js";

export default function Create() {
  return <h1>Create</h1>;
}

Create.getLayout = function getLayout(page: ReactNode) {
  return (
    <EmailCapturingLayout>
      <Layout>{page}</Layout>
    </EmailCapturingLayout>
  );
};
