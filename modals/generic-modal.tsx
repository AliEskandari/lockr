import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { classNames as merge } from "@/modules/functions/css";

export type GenericModalProps = {
  show?: boolean;
  onClose?: () => void;
  beforeEnter?: any;
  unmount?: boolean;
  children: any;
  className: string;
};

const GenericModal = React.forwardRef<any, GenericModalProps>(
  (
    {
      show = false,
      onClose = () => {},
      beforeEnter = () => [],
      unmount = true,
      children,
      className,
    },
    ref: any
  ) => {
    return (
      <Transition
        beforeEnter={beforeEnter}
        show={show}
        as={Fragment}
        unmount={unmount}
      >
        <Dialog onClose={onClose} className="relative z-50" unmount={unmount}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            unmount={unmount}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur" />
          </Transition.Child>

          {/* Contents */}
          <Transition.Child
            as={Fragment}
            unmount={unmount}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* Full-screen container to center the panel */}
            <div
              id="modal-container"
              className="fixed inset-0 flex items-center justify-center p-2.5"
            >
              <Dialog.Panel
                id="modal-dialog-panel"
                ref={ref}
                className={merge(
                  "mx-auto rounded-xl bg-white dark:bg-gray-900 dark:text-white px-4 py-6 min-w-[300px] overflow-hidden",
                  className
                )}
              >
                {/* The actual dialog panel  */}
                {children}
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    );
  }
);

export default GenericModal;
