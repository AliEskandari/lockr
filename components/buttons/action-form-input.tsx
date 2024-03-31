import MinusCircleIcon from "@heroicons/react/24/outline/MinusCircleIcon";
import Button from "@/components/buttons/button";
import {
  GripVerticalIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/icons";
import {
  motion,
  Reorder,
  ResolvedValues,
  useDragControls,
} from "framer-motion";
import tw from "@/modules/tailwind";
import {
  ChangeEvent,
  MouseEvent,
  MutableRefObject,
  PointerEvent,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { classNames } from "@/modules/functions/css";
import { Action, ActionError, ActionType } from "@/types";
import Input from "../inputs/input";
import GenericInlineSelect from "../selects/generic-inline-select";
import Toggle from "../toggles/toggle";
import sharedConstants from "@/modules/constants";
import constants from "@/modules/constants";
import { Provider } from "@/types";

const optionFromActionType = (actionType: ActionType) => {
  const { input, provider } = constants.Props.Action.FormInput[actionType];
  return {
    type: actionType,
    name: input.title,
    icon: <provider.Icon className={provider.colors.text} />,
    value: actionType,
  };
};

const actionTypeOptions = [
  {
    label: "Youtube",
    icon: <YoutubeIcon className="text-red-500" />,
    options: Object.values(sharedConstants.Action.Type.Youtube).map(
      (actionType) => optionFromActionType(actionType)
    ),
  },
  {
    label: "Twitter",
    icon: <TwitterIcon className="text-blue-500" />,
    options: Object.values(sharedConstants.Action.Type.Twitter).map(
      (actionType) => optionFromActionType(actionType)
    ),
  },
  {
    label: "Instagram",
    icon: <InstagramIcon className="text-purple-500" />,
    options: Object.values(sharedConstants.Action.Type.Instagram).map(
      (actionType) => optionFromActionType(actionType)
    ),
  },
];

const FormActionStatus = {
  Ready: "READY",
  Editing: "EDITING",
} as const;

type FormActionStatus =
  (typeof FormActionStatus)[keyof typeof FormActionStatus];

type ReducerAction = { type: string; payload: FormActionStatus };

type State = {
  status: FormActionStatus;
  open: boolean;
  disabled: boolean;
  valid: boolean;
};

const processState = (state: State): State => {
  const status = state.status;

  if (status == FormActionStatus.Ready) {
    state.open = false;
  }

  if (status == FormActionStatus.Editing) {
    state.open = true;
  }

  return state;
};

const reducer = (state: State, { type, payload }: ReducerAction): State => {
  switch (type) {
    case "set-status":
      var status = payload;
      var newState = { ...state, status };
      return processState(newState);
    default:
      return state;
  }
};

export type ActionFormInputProps = {
  action: Action;
  disableDelete: boolean;
  scrollContainerRef: MutableRefObject<HTMLElement | null>;
  errors?: ActionError[];
  provider: Provider;
  input: {
    title: string;
    placeholder: string;
    type: "text" | "url";
  };
  directConnect: {
    enabled: boolean;
  };
  onDelete: () => void;
  onUpdate: (params: Action) => void;
};

/**
 * Used to define actions for locks
 */
export default function ActionFormInput({
  action,
  onDelete,
  onUpdate,
  disableDelete,
  scrollContainerRef,
  errors,
  input,
  directConnect,
  provider,
}: ActionFormInputProps) {
  const [state, dispatch] = useReducer(reducer, {
    status: FormActionStatus.Ready,
    open: false,
    disabled: false,
    valid: true,
  });
  const ref = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    if (!errors || errors.length == 0) return;
    dispatch({ type: "set-status", payload: FormActionStatus.Editing });
  }, [errors]);

  /**
   * Setups up event listener on entire document to listen for clicks. If the
   * click happens outside the button the action button is closed.
   *
   * This event handler is re-created everytime the status changes. Otherwise,
   * it won't work.
   */
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (state.open)
          dispatch({ type: "set-status", payload: FormActionStatus.Ready });
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [state.status]);

  const handleClickButton = (event: MouseEvent<HTMLButtonElement>) => {
    if (state.open) {
      dispatch({
        type: "set-status",
        payload: FormActionStatus.Ready,
      });
    } else {
      dispatch({
        type: "set-status",
        payload: FormActionStatus.Editing,
      });
    }
  };

  const handleUpdateButtonContainer = () => {
    if (!scrollContainerRef?.current || !state.open) return;
    scrollContainerRef.current.scrollTo({
      top: ref.current?.offsetTop,
      behavior: "auto",
    });
  };

  const handleChangeToggle = (event: ChangeEvent<HTMLInputElement>) =>
    onUpdate({ ...action, directConnect: event.target.checked });

  const handleClickGrip = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const handlePointerDownGrip = (event: PointerEvent<SVGSVGElement>) => {
    console.log(event);
    event.preventDefault();
    ref.current?.classList.add("shadow-xl");
    (event.target as Element).classList.add("cursor-grabbing");
    dragControls.start(event);
  };

  const handlePointerUpGrip = (event: PointerEvent<SVGSVGElement>) => {
    ref.current?.classList.remove("shadow-xl");
    (event.target as Element).classList.remove("cursor-grabbing");
  };

  const handleUpdateInlineSelect = (latest: ResolvedValues) => {
    if (!scrollContainerRef?.current || !state.open) return;
    scrollContainerRef.current.scrollTo({
      top: ref.current?.offsetTop,
      behavior: "auto",
    });
  };

  const handleChangeInlineSelect = (option: any) =>
    onUpdate({ ...action, type: option.type });

  const handleChangeActionUrl = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...action, url: target.value });
  };

  const handleClearActionUrl = () => {
    onUpdate({ ...action, url: "" });
  };

  return (
    <Reorder.Item
      key={action.id}
      value={action.id}
      dragListener={false}
      dragControls={dragControls}
    >
      <motion.div
        ref={ref}
        id={`action-${action.id}`}
        initial={{ opacity: 0 }}
        layout
        exit={{
          height: 0,
          padding: 0,
          opacity: 0,
          overflow: "hidden",
        }}
        className="rounded-xl group flex flex-col bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-shadow"
        variants={{
          open: {
            opacity: 1,
            padding: tw.padding[3],
            rowGap: tw.gap[4],
            transition: {
              duration: 0.2,
              type: "tween",
            },
          },
          closed: {
            opacity: 1,
            transition: {
              duration: 0.2,
              type: "tween",
            },
          },
        }}
        onUpdate={handleUpdateButtonContainer}
        animate={state.open ? "open" : "closed"}
      >
        <Button
          initial={{ padding: 0 }}
          variants={{
            open: {
              padding: tw.padding[3],
            },
            closed: {
              padding: tw.padding[3],
            },
          }}
          onClick={handleClickButton}
          className={classNames(
            "relative normal-case text-xl rounded-xl w-full text-white z-0 select-none",
            `bg-${provider.colors.bg}-500 hover:bg-${provider.colors.bg}-600 active:bg-${provider.colors.bg}-700`
          )}
        >
          <provider.Icon className="mr-2" />
          {input.title}
          <GripVerticalIcon
            onClick={handleClickGrip}
            onPointerDown={handlePointerDownGrip}
            onPointerUp={handlePointerUpGrip}
            className="cursor-grab h-6 p-3 touch-none absolute text-white right-1 top-1/2 -translate-y-1/2 opacity-40"
          />
        </Button>

        {/* Type, URL, Direct Follow */}
        <motion.div
          initial={{ height: 0 }}
          variants={{
            open: {
              height: "auto",
              opacity: 1,
              transition: {
                duration: 0.2,
                type: "tween",
              },
            },
            closed: {
              height: 0,
              opacity: 0,
              transition: {
                duration: 0.2,
                type: "tween",
              },
            },
          }}
          className="mb-0 flex flex-col gap-y-4 overflow-hidden"
        >
          <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
            {/* Action Type Select */}
            <GenericInlineSelect
              useOptionGroups={true}
              classNames={{
                Button:
                  "rounded-t-xl rounded-b-none bg-white text-xl hover:bg-gray-50 active:bg-gray-300 dark:bg-gray-800",
                Chevron: "text-gray-400",
                Options: "dark:bg-gray-800 text-xl gap-y-4",
                OptionGroup: "text-2xl font-extrabold",
              }}
              options={actionTypeOptions}
              onUpdate={handleUpdateInlineSelect}
              selected={optionFromActionType(action.type)}
              onChange={handleChangeInlineSelect}
            />
            {/* Action URL */}
            <Input
              onChange={handleChangeActionUrl}
              className="bg-white text-xl rounded-t-none rounded-b-xl dark:bg-gray-800"
              errors={errors}
              value={action.url}
              placeholder={input.placeholder}
              type={input.type}
              onClear={handleClearActionUrl}
            />
          </div>
          {/* Action Direct Connect */}
          <motion.div
            layout
            variants={{
              visible: { display: "flex" },
              hidden: { display: "none" },
            }}
            animate={directConnect.enabled ? "visible" : "hidden"}
            className="items-center text-xl justify-between bg-white dark:bg-gray-800 py-3 px-4 rounded-xl"
          >
            <span>Direct Connect</span>
            <Toggle
              checked={action.directConnect!}
              onChange={handleChangeToggle}
            />
          </motion.div>

          {/* Remove, Swap */}
          <div
            className={classNames(
              "flex items-center justify-between ",
              disableDelete ? "hidden" : ""
            )}
          >
            <Button
              className="disabled:hidden flex justify-center items-center rounded-xl p-2 text-gray-500 hover:text-gray-400 active:text-gray-300 tracking-wide"
              onClick={onDelete}
              disabled={disableDelete}
            >
              <MinusCircleIcon className="w-4 h-full mr-1" /> Remove
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </Reorder.Item>
  );
}
