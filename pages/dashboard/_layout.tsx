import { Transition } from "@headlessui/react";
import React, { ReactNode, useContext } from "react";
import SidebarContext from "@/contexts/sidebar";
import Sidebar from "@/components/sidebar";
import ProtectedRoute from "@/components/helpers/protected-route";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useContext(SidebarContext);

  return (
    <ProtectedRoute>
      <Transition
        as="div"
        id="dashboard-layout"
        className="!block absolute w-full overflow-hidden bottom-0 left-0 right-0 top-16 dark:bg-gray-900 dark:text-white"
        show={sidebarOpen}
        appear={sidebarOpen}
        unmount={false}
      >
        <Transition.Child
          id="dashboard-layout-sidebar"
          unmount={false}
          appear={sidebarOpen}
          className="!flex absolute top-0 bottom-0 -translate-x-full transition-all ease-in-out duration-300 transform-gpu"
          enterTo="translate-x-0"
          leaveFrom="translate-x-0"
        >
          <Sidebar />
        </Transition.Child>
        <Transition.Child
          id="dashboard-layout-content"
          unmount={false}
          className="!flex flex-col h-full overflow-y-auto overflow-x-hidden py-2 px-4 sm:px-6 lg:px-8 ml-0 transition-all ease-in-out duration-300 @container min-w-[300px]"
          enterTo="ml-[300px]"
          leaveFrom="ml-[300px]"
        >
          {children}
        </Transition.Child>
      </Transition>
    </ProtectedRoute>
  );
}
