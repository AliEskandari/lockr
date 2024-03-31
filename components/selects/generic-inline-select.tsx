import { ChevronRightIcon } from "@heroicons/react/24/outline";
import tw from "@/modules/tailwind";
import Button from "@/components/buttons/button";
import { motion } from "framer-motion";
import { MouseEvent, ReactNode, useReducer } from "react";
import { classNames as merge } from "@/modules/functions/css";

type Option = {
  [key: string]: any;
};

type OptionGroup = {
  label: string;
  icon?: React.ReactNode;
  options: Option[];
};

type GenericInlineSelectProps = {
  options: Option[] | OptionGroup[];
  onChange: (value: Option) => void;
  selected: any;
  accessor?: string;
  useOptionGroups?: boolean;
  classNames?: {
    OptionGroup?: string;
    Button?: string;
    Chevron?: string;
    Options?: string;
  };
  maxHeight?: number;
  emptyState?: React.ReactNode;
  onUpdate?: (state: any) => void;
};

const STATUS = {
  READY: "READY",
  EDITING: "EDITING",
};

namespace GenericInlineSelectReducer {
  export type State = {
    status: string;
    open: boolean;
    disabled: boolean;
    valid: boolean;
  };

  export type Action = {
    type: string;
    payload: any;
  };
}

const processStatus = (state: GenericInlineSelectReducer.State) => {
  const status = state.status;

  if (status == STATUS.READY) {
    state.open = false;
  }

  if (status == STATUS.EDITING) {
    state.open = true;
  }

  return state;
};

const reducer = (
  state: GenericInlineSelectReducer.State,
  { type, payload }: GenericInlineSelectReducer.Action
) => {
  switch (type) {
    case "set-status":
      var status = payload.value;
      var newState = { ...state, status };
      return processStatus(newState);
    default:
      return state;
  }
};

export default function GenericInlineSelect({
  options,
  accessor = "name",
  onChange,
  selected,
  useOptionGroups = false,
  classNames = {},
  maxHeight = 420,
  emptyState = undefined,
  onUpdate,
  ...props
}: GenericInlineSelectProps) {
  const [state, dispatch] = useReducer(reducer, {
    status: STATUS.READY,
    open: false,
    disabled: false,
    valid: true,
  });

  const handleClickButton = () => {
    dispatch({
      type: "set-status",
      payload: { value: state.open ? STATUS.READY : STATUS.EDITING },
    });
  };

  const handleClickOption = (option: Option) => {
    onChange(option);
    dispatch({
      type: "set-status",
      payload: { value: STATUS.READY },
    });
  };

  let content: ReactNode;
  if (options.length == 0) {
    content = <>{emptyState}</>;
  } else if (useOptionGroups) {
    const optionGroups = options as OptionGroup[];
    content = optionGroups.map((optionGroup) => (
      <OptionGroup
        optionGroup={optionGroup}
        key={optionGroup.label}
        className={classNames.OptionGroup}
      >
        {optionGroup.options.map((option) => (
          <Option
            onClick={handleClickOption}
            option={option}
            key={option[accessor]}
            accessor={accessor}
          />
        ))}
      </OptionGroup>
    ));
  } else {
    const _options = options as Option[];
    content = _options.map((option) => (
      <Option
        onClick={handleClickOption}
        option={option}
        key={option[accessor]}
        accessor={accessor}
      />
    ));
  }

  return (
    <motion.div
      className="rounded-t-xl divide-y dark:divide-gray-700 group flex flex-col bg-gray-100 dark:bg-gray-700 overflow-hidden"
      {...props}
    >
      <Button
        onClick={handleClickButton}
        className={merge(
          "relative w-full py-3 pl-4 pr-10 text-left z-0 flex items-center",
          classNames.Button
        )}
      >
        <span className="flex items-center space-x-2">
          {selected?.icon ? (
            <span className="w-6 flex justify-center">{selected.icon}</span>
          ) : null}
          <span className="min-w-0 truncate">{selected?.name}</span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronRightIcon
            className={merge("h-6 w-6", classNames.Chevron)}
            aria-hidden="true"
          />
        </span>
      </Button>

      <motion.div
        layout
        style={{ maxHeight: `${maxHeight}px` }}
        variants={{
          open: {
            display: "flex",
            height: maxHeight,
            opacity: 1,
            paddingTop: tw.padding[2],
            paddingBottom: tw.padding[2],
            paddingLeft: tw.padding[4],
            paddingRight: tw.padding[4],
            transition: { duration: 0.2, type: "tween" },
          },
          closed: {
            opacity: 0,
            height: 0,
            padding: 0,
            margin: 0,
            transition: { duration: 0.2, type: "tween" },
          },
        }}
        onUpdate={onUpdate}
        className={merge(
          "w-full flex-row flex-wrap overflow-y-auto rounded-none focus:outline-none",
          classNames.Options
        )}
        animate={state.open ? "open" : "closed"}
      >
        {content}
      </motion.div>
    </motion.div>
  );
}

type OptionGroupProps = {
  optionGroup: OptionGroup;
  children: ReactNode;
  className?: string;
};

function OptionGroup({ optionGroup, children, className }: OptionGroupProps) {
  return (
    <section className="w-full">
      <div className={merge("py-2 space-x-2 flex items-center", className)}>
        <span className="inline-flex">{optionGroup.icon}</span>
        <span className="inline-flex">{optionGroup.label}</span>
      </div>
      <div className="pl-1 flex flex-col gap-y-2 gap-x-2">{children}</div>
    </section>
  );
}

type OptionProps = {
  option: Option;
  onClick: (option: Option) => void;
  accessor: string;
};

function Option({ option, onClick, accessor }: OptionProps) {
  return (
    <Button
      onClick={() => onClick(option)}
      className={merge(
        "relative select-none cursor-pointer flex rounded-xl truncate hover:text-gray-900 dark:hover:text-gray-100 px-2 py-1"
      )}
    >
      {option[accessor]}
    </Button>
  );
}
