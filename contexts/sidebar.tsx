import { Dispatch, ReactNode, createContext, useEffect, useState } from "react";
import useWindowSize from "../hooks/use-window-size";
import tw from "@/modules/tailwind";

const SidebarContext = createContext<{
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<boolean>;
  autoClose: boolean;
}>({ sidebarOpen: false, setSidebarOpen: () => {}, autoClose: false });

export function SidebarContextProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { width } = useWindowSize();
  const [autoClose, setAutoClose] = useState(false);

  useEffect(() => {
    if (width && width <= parseInt(tw.screens.lg)) {
      setAutoClose(true);
      setSidebarOpen(false);
    } else {
      setAutoClose(false);
      setSidebarOpen(true);
    }
  }, [width]);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen, autoClose }}>
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarContext;
