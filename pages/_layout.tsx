import { ReactNode } from "react";
import Footer from "../components/footer";

export default function StaticLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
