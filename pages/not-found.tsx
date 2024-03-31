import { ReactNode } from "react";

export default function NotFound() {
  return <div className="pt-14 text-center text-3xl font-semibold">Oops!</div>;
}

NotFound.getLayout = function getLayout(page: ReactNode) {
  return <>{page}</>;
};
