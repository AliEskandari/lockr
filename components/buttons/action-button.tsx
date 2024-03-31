import { Action, ActionStatus, SocialUnlock, User } from "@/types";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, {
  MouseEvent,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

import constants from "@/modules/constants";
import { classNames } from "@/modules/functions/css";
import { delay } from "@/modules/functions/time";
import Modals from "@/modules/constants/Modals";
import ModalsContext from "@/contexts/modals.context";
import UserContext from "@/contexts/user";
import db from "@/modules/db";
import tw from "@/modules/tailwind";
import { Provider, ProviderRouteFormatter } from "@/types";
import Button from "./button";
import { signIn } from "next-auth/react";
import { setCookie } from "cookies-next";

const MAX_WAIT_TIME = 15000; // 15 seconds
const MIN_WAIT_TIME = 3000; // 3 seconds

type YouNeedAnAccountProps = {
  dispatch: React.Dispatch<ReducerAction>;
  state: State;
};

const YouNeedAnAccount = ({ dispatch, state }: YouNeedAnAccountProps) => {
  const modals = useContext(ModalsContext);

  /**
   *TODO
   */
  const handleClick = () =>
    modals.show(Modals.AUTH.SIGN_IN, {
      onSuccess: () => {
        dispatch({
          type: "set-status",
          payload: constants.Action.Status.DoneSigninSignup,
        });
      },
      onFailure: () => {
        dispatch({
          type: "set-status",
          payload: constants.Action.Status.SigninSignup,
        });
      },
    });

  return (
    <motion.div
      layout
      className="flex flex-col gap-y-4 overflow-hidden"
      initial="closed"
      variants={{
        open: {
          height: "auto",
          transition: { duration: 0.3, type: "spring" },
        },
        closed: { height: 0, transition: { duration: 0.2, type: "tween" } },
      }}
      animate={
        state.status == constants.Action.Status.SigninSignup ? "open" : "closed"
      }
    >
      <h3 className="text-sm">You need an account first!</h3>
      <div className="flex justify-around items-center gap-x-4">
        <Button
          onClick={handleClick}
          className="text-lg font-medium bg-black hover:bg-gray-900 active:bg-gray-800 text-white w-full py-2.5"
        >
          Login
        </Button>
      </div>
    </motion.div>
  );
};

type ConnectAccountProps = {
  provider: Provider;
  user?: User | null;
  socialUnlock: SocialUnlock;
  action: Action;
  state: State;
};

const ConnectAccount = ({
  provider,
  user,
  socialUnlock,
  action,
  state,
}: ConnectAccountProps) => {
  if (!user) return <></>;

  /**
   * TODO
   */
  const handleClick = async () => {
    // save state
    const lockState = await db.LockState.create({
      ...socialUnlock,
    });
    setCookie("userId", user.id);
    setCookie("lockStateId", lockState.id);
    setCookie("actionId", action.id);
    signIn(provider.key.toLowerCase());
  };

  return (
    <motion.div
      layout
      className="flex flex-col gap-y-4 overflow-hidden"
      initial="closed"
      variants={{
        open: {
          height: "auto",
          transition: { duration: 0.3, type: "spring" },
        },
        closed: { height: 0, transition: { duration: 0.2, type: "tween" } },
      }}
      animate={
        state.status == constants.Action.Status.ConnectAccount
          ? "open"
          : "closed"
      }
    >
      <h3 className="text-sm">You need to connect your account!</h3>
      <div className="flex justify-center items-center">
        <Button
          onClick={handleClick}
          className="flex items-center justify-center text-white bg-black w-full py-2.5"
        >
          Connect to <provider.Logo className="ml-2 h-4 relative" />
        </Button>
      </div>
    </motion.div>
  );
};

type ReducerAction = {
  type: string;
  payload: ActionStatus;
};

type State = {
  status: ActionStatus;
  children: ReactNode;
  displayChildren: ReactNode;
  open: boolean;
  disabled: boolean;
  classNames: string;
};

const process = (state: State): State => {
  const status = state.status;
  if (
    (constants.Action.OpenStatus as unknown as ActionStatus[]).includes(status)
  ) {
    state.open = true;
  }

  if (status == constants.Action.Status.Ready) {
    state.open = false;
  }

  if (status == constants.Action.Status.CompletingAction) {
    state.displayChildren = (
      <div className="flex font-medium items-center justify-center animate-pulse">
        Completing action...
      </div>
    );
    state.disabled = true;
  }

  if (status == constants.Action.Status.CompletedAction) {
    state.displayChildren = state.children;
    state.disabled = true;
    state.classNames = "bg-gray-100 dark:bg-gray-800 text-gray-500";
  }

  if (status == constants.Action.Status.Loading) {
    state.displayChildren = (
      <div className="flex font-medium items-center justify-center animate-pulse">
        Verifying...
      </div>
    );
  }

  return state;
};

const reducer = (state: State, { type, payload }: ReducerAction): State => {
  switch (type) {
    case "set-status":
      var status = payload;
      var newState = { ...state, status };

      return process(newState);
    default:
      return state;
  }
};

export type ActionButtonProps = {
  title: string | ((text: string) => string | ReactNode);
  children: React.ReactNode;
  action: Action;
  className: string;
  style: string;
  provider: Provider;
  socialUnlock: SocialUnlock;
  onStatusChange: (status: ActionStatus) => void;
  onClick: (url: string) => void;
  onClickDirect?: (userId: string, actionUrl: string) => Promise<any>;
};

export default function ActionButton({
  title,
  children,
  action,
  className,
  style,
  provider,
  socialUnlock,
  onStatusChange,
  onClick,
  onClickDirect,
  ...rest
}: ActionButtonProps) {
  const before = useRef<number>(0); // timestamp
  const ref = useRef<HTMLDivElement>(null);
  const user = useContext(UserContext);
  const providerKey = provider?.key;
  const [state, dispatch] = useReducer(
    reducer,
    process({
      status: action.status || constants.Action.Status.Ready,
      children,
      displayChildren: children,
      open: false,
      disabled: false,
      classNames: style,
    })
  );
  /**
   * Called when the action button renders, status changes (from button
   * click), and user loads.
   *
   * Handles results after 'done login' or
   * 'done connecting account'.
   */
  useEffect(() => {
    (async function () {
      if (user == undefined) return; // wait for user to load

      if (state.status == constants.Action.Status.DoneSigninSignup) {
        if (!user)
          return dispatch({
            type: "set-status",
            payload: constants.Action.Status.SigninSignup,
          });

        if (!user.accounts?.[providerKey]) {
          return dispatch({
            type: "set-status",
            payload: constants.Action.Status.ConnectAccount,
          });
        }

        await directConnect();
      }

      if (state.status == constants.Action.Status.DoneConnectAccount) {
        if (!user?.accounts?.[providerKey]) {
          dispatch({
            type: "set-status",
            payload: constants.Action.Status.ConnectAccount,
          });
        }

        await directConnect();
      }
    })();
  }, [state.status, user]);

  /**
   * Called whenever state status changes when button is clicked.
   *
   * Sends new status to onStatusChange callback prop.
   */
  useEffect(() => {
    onStatusChange(state.status);
  }, [state.status]);

  /**
   * Called when status changes when button is clicked.
   *
   * Watches document for click events. If click is outside
   * the button then the button is closed.
   */
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (state.open)
          dispatch({
            type: "set-status",
            payload: constants.Action.Status.Ready,
          });
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [state.status]);

  /**
   * Called when button is clicked and action is not
   * `directConnect` (opens tab).
   *
   * Watches tab's visibility changes. Used to track when user returns to
   * tab after having opened the action button's url.
   */
  const watchDocumentVisibility = () => {
    const onVisiblityChange = () => {
      if (document.visibilityState == "visible") {
        const msToReturn = performance.now() - before.current;
        const waitDuration =
          Math.max(MAX_WAIT_TIME - msToReturn, 0) + MIN_WAIT_TIME;

        setTimeout(() => {
          dispatch({
            type: "set-status",
            payload: constants.Action.Status.CompletedAction,
          });
        }, waitDuration);

        document.removeEventListener("visibilitychange", onVisiblityChange);
      }
    };

    document.addEventListener("visibilitychange", onVisiblityChange);
  };

  /**
   * Called when the button is clicked and the action is a `directConnect`
   * action. Also called when done with signin or done with connect account.
   *
   * Sets action to `completing-action` and then performs direct connect action.
   */
  const directConnect = async () => {
    dispatch({
      type: "set-status",
      payload: constants.Action.Status.CompletingAction,
    });

    await delay(4000);

    await onClickDirect!(user!.id, action.url);

    dispatch({
      type: "set-status",
      payload: constants.Action.Status.CompletedAction,
    });
  };

  /**
   * Called when button is clicked.
   *
   * Sets status to appropriate status depending on the current
   * state and action.
   */
  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (state.open) {
      // close button
      return dispatch({
        type: "set-status",
        payload: constants.Action.Status.Ready,
      });
    }

    if (!action.url) return;

    if (!action.directConnect) {
      // send to action url
      dispatch({
        type: "set-status",
        payload: constants.Action.Status.Loading,
      });
      before.current = performance.now();
      onClick(action.url);
      return watchDocumentVisibility();
    }

    if (!user) {
      // need to login / signup
      return dispatch({
        type: "set-status",
        payload: constants.Action.Status.SigninSignup,
      });
    }

    if (!user.accounts?.[providerKey]) {
      // need to connect to provider
      return dispatch({
        type: "set-status",
        payload: constants.Action.Status.ConnectAccount,
      });
    }

    await directConnect();
  };

  return (
    <motion.div
      ref={ref}
      className="rounded-xl flex flex-col bg-gray-200 dark:bg-gray-700 text-lg"
      layout
      variants={{
        open: {
          padding: tw?.padding?.[4],
          rowGap: tw?.gap?.[3]!,
        },
        closed: {
          padding: 0,
          rowGap: 0,
        },
      }}
      initial="closed"
      transition={{ duration: 0.1, type: "tween" }}
      animate={state.open ? "open" : "closed"}
    >
      <Button
        onClick={handleClick}
        disabled={state.disabled}
        className={classNames(
          state.classNames,
          className,
          "py-2.5 break-words px-4 font-light"
        )}
        {...rest}
      >
        {state.displayChildren}
      </Button>
      {action.directConnect ? (
        <div>
          <YouNeedAnAccount
            key="you-need-an-account"
            state={state}
            dispatch={dispatch}
          />
          <ConnectAccount
            provider={provider}
            user={user}
            action={action}
            state={state}
            socialUnlock={socialUnlock}
          />
        </div>
      ) : null}
    </motion.div>
  );
}
