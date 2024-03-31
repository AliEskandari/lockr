import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { classNames as merge } from "@/modules/functions/css";

type GenericDrawerProps = {
  show?: boolean;
  onClose?: () => void;
  beforeEnter?: any;
  unmount?: boolean;
  children: any;
  className: string;
};

const GenericDrawer = React.forwardRef<any, GenericDrawerProps>(
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
      <AnimatePresence>
        <Dialog
          key="dialog"
          as={motion.div}
          onClose={onClose}
          className="relative z-50"
          static
          initial={"closed"}
          open={show}
          animate={show ? "open" : "closed"}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black"
            variants={{
              open: { opacity: 0.3, pointerEvents: "auto" },
              closed: {
                opacity: 0,
                pointerEvents: "none",
              },
            }}
            transition={{ duration: 0.2 }}
          ></motion.div>

          {/* Full-screen container to center the panel */}
          {/* Contents */}
          <Dialog.Panel
            id="modal-dialog-panel"
            as={motion.div}
            ref={ref}
            variants={{
              open: {
                bottom: 0,
              },
              closed: {
                bottom: "-100%",
              },
            }}
            transition={{ duration: 0.3, type: "tween" }}
            className={merge(
              "fixed left-1/2 -translate-x-1/2 rounded-t-xl bg-white dark:bg-gray-900 px-4 py-6 appearance-none dark:text-white min-w-[300px] overflow-hidden",
              className
            )}
          >
            {/* The actual dialog panel  */}
            {children}
          </Dialog.Panel>
        </Dialog>
      </AnimatePresence>
    );
  }
);

export default GenericDrawer;
