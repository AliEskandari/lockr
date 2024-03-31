import React, { ReactNode, createContext, useState } from "react";
import DashboardSocialUnlockModals from "@/modals/dashboard/social-unlocks";
import DashboardCollectionModals from "@/modals/dashboard/collections";
import DashboardAccountsModals from "@/modals/dashboard/accounts";
import AuthModals from "@/modals/auth";
import SocialUnlockModals from "@/modals/social-unlock";
import { useRouter } from "next/router";
import { Modal } from "@/types";

export type ModalContextType = {
  show: (key: string, props?: {}) => void;
  hide: (key: string) => void;
  get: (key: string) => any;
};

type ModalState = {
  show: boolean;
  props: any;
};

const ModalsContext = createContext<ModalContextType>({
  show: () => {},
  hide: () => {},
  get: () => {},
});

export function ModalsContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { pathname, asPath } = router;

  const [modalStates, setModalStates] = useState<{ [key: string]: ModalState }>(
    {}
  );

  const modals = {
    show: (key: string, props = {}) =>
      setModalStates((modalStates) => {
        return { ...modalStates, [key]: { show: true, props } };
      }),
    hide: (key: string) =>
      setModalStates((modalStates) => {
        return {
          ...modalStates,
          [key]: { show: false, props: modalStates[key].props },
        };
      }),
    get: (key: string) => modalStates[key],
  };

  const loadModals = (Modals: { [key: string]: any | Modal }) =>
    Object.values(Modals).map((Modal) => {
      return (
        <Modal
          key={Modal.KEY}
          show={modals.get(Modal.KEY)?.show}
          onClose={() => modals.hide(Modal.KEY)}
          {...modals.get(Modal.KEY)?.props}
        />
      );
    });

  return (
    <ModalsContext.Provider value={modals}>
      {asPath.includes("/dashboard/social-unlocks")
        ? loadModals(DashboardSocialUnlockModals)
        : null}

      {asPath.includes("/dashboard/collections")
        ? loadModals(DashboardCollectionModals)
        : null}

      {asPath.includes("/dashboard/accounts")
        ? loadModals(DashboardAccountsModals)
        : null}

      {pathname.includes("/[social-unlock-id]")
        ? loadModals(SocialUnlockModals)
        : null}

      {loadModals(AuthModals)}

      {children}
    </ModalsContext.Provider>
  );
}

export default ModalsContext;
