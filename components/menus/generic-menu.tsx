import React, { ComponentType, HTMLProps, ReactComponentElement } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import { classNames as merge } from "@/modules/functions/css";
import { Float } from "@headlessui-float/react";
import Button from "../buttons/button";
import LinkOrButton from "../buttons/link-or-button";
import { Placement, Strategy } from "@floating-ui/react-dom";

type GenericMenuProps = {
  menuItems: {
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    name?: string;
    icon?: ComponentType<any>;
  }[];
  children: React.ReactNode;
  placement?: Placement;
  strategy?: Strategy;
  classNames?: {
    MenuButton?: string;
    MenuItem?: string;
    MenuItems?: string;
  };
};

export default function GenericMenu({
  menuItems,
  children,
  placement,
  strategy = "absolute",
  classNames = {},
}: GenericMenuProps) {
  return (
    <Menu>
      <Float
        strategy={strategy}
        placement={placement}
        className="relative flex"
        enter="transition-opacity duration-300 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150 ease-in"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        tailwindcssOriginClass
        flip
      >
        <Menu.Button as={Button} className={merge("", classNames.MenuButton)}>
          {children}
        </Menu.Button>

        <Menu.Items
          className={merge(
            "mt-2 py-2 rounded-2xl ring-2 focus:outline-none z-10 space-y-1 ring-gray-200 dark:ring-gray-700 text-lg bg-white dark:bg-gray-900",
            classNames.MenuItems
          )}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => {
                const className = merge(
                  "flex group px-4 py-1 space-x-2 items-center",
                  classNames.MenuItem
                );
                const content = (
                  <>
                    {item.icon ? (
                      <item.icon className="inline-flex w-6 h-6" />
                    ) : null}

                    <span
                      className={
                        (merge(active ? "bg-gray-100 dark:bg-gray-800" : ""),
                        "inline-flex rounded-xl px-2 py-2 group-hover:bg-gray-100 dark:group-hover:bg-gray-800")
                      }
                    >
                      {item.name}
                    </span>
                  </>
                );
                return (
                  <LinkOrButton className={className} {...item}>
                    {content}
                  </LinkOrButton>
                );
              }}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Float>
    </Menu>
  );
}
