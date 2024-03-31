import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Fragment, ReactNode } from "react";
import React from "react";
import { classNames as merge } from "@/modules/functions/css";
import { Float } from "@headlessui-float/react";
import { size, shift } from "@floating-ui/react-dom";
import Button from "@/components/buttons/button";

export type Option = {
  [key: string]: any;
};

export type OptionGroup = {
  label: string;
  icon?: React.ReactNode;
  options: Option[];
};

type GenericSelectProps = {
  options: Option[] | OptionGroup[];
  accessor?: string;
  onChange: (value: Option) => void;
  selected: any;
  useOptionGroups?: boolean;
  classNames?: {
    Button?: string;
    Chevron?: string;
    Options?: string;
  };
  maxHeight?: number;
  emptyState?: React.ReactNode;
};

export default function GenericSelect({
  options,
  accessor = "name",
  onChange,
  selected,
  useOptionGroups = false,
  classNames = {},
  maxHeight = 420,
  emptyState,
  ...props
}: GenericSelectProps) {
  let content: ReactNode;
  if (options.length == 0) {
    content = <>{emptyState}</>;
  } else if (useOptionGroups) {
    const optionGroups = options as OptionGroup[];
    content = optionGroups.map((optionGroup) => (
      <OptionGroup optionGroup={optionGroup} key={optionGroup.label}>
        {optionGroup.options.map((option) => (
          <Option option={option} accessor={accessor} key={option[accessor]} />
        ))}
      </OptionGroup>
    ));
  } else {
    const _options = options as Option[];
    content = _options.map((option) => (
      <Option option={option} accessor={accessor} key={option[accessor]} />
    ));
  }
  const middleware = ({ referenceEl, floatingEl }) => [
    size({
      apply({ availableHeight }) {
        Object.assign(floatingEl.current.style, {
          maxHeight: `${Math.min(availableHeight, maxHeight)}px`,
        });
      },
      padding: 5,
    }),
  ];

  return (
    <Listbox value={selected} onChange={onChange} {...props}>
      <Float
        as="div"
        floatingAs={React.Fragment}
        className="relative"
        placement="bottom-start"
        flip
        middleware={middleware}
      >
        <Listbox.Button
          as={Button}
          className={merge(
            "relative w-full py-3 pl-4 pr-10 text-left z-0 flex items-center",
            classNames.Button
          )}
        >
          <span className="flex items-center space-x-2">
            {selected?.icon ? (
              <span className="w-5 flex justify-center">{selected.icon}</span>
            ) : null}
            <span className="min-w-0 truncate">{selected?.name}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronRightIcon
              className={merge("h-5 w-5", classNames.Chevron)}
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={merge(
              "z-30 mt-1 w-full overflow-auto rounded-xl py-1 ring-1 ring-gray-300 dark:ring-gray-700 focus:outline-none",
              classNames.Options
            )}
          >
            {content}
          </Listbox.Options>
        </Transition>
      </Float>
    </Listbox>
  );
}

const Option = ({ option, accessor }: { option: Option; accessor: string }) => {
  return (
    <Listbox.Option
      className={({ active }) =>
        `relative select-none py-2 pl-4 pr-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
          active ? "bg-gray-100 dark:bg-gray-800" : ""
        }`
      }
      value={option}
    >
      {({ selected }) => (
        <>
          <span className={`block truncate ${selected ? "font-semibold" : ""}`}>
            {option[accessor]}
          </span>
          {/* {selected ? (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-500">
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : null} */}
        </>
      )}
    </Listbox.Option>
  );
};

const OptionGroup = ({
  optionGroup,
  children,
}: {
  optionGroup: OptionGroup;
  children: ReactNode;
}) => {
  return (
    <div>
      <div className="pl-4 py-2 font-normal space-x-2 flex items-center">
        <span className="inline-flex">{optionGroup.icon}</span>
        <span className="inline-flex">{optionGroup.label}</span>
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
};
