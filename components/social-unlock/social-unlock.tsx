import constants from "@/modules/constants";
import { Action, ActionStatus, SocialUnlock } from "@/types";
import { motion } from "framer-motion";
import set from "lodash/set";
import { useEffect, useReducer } from "react";
import analytics from "@/modules/analytics";
import { trpc } from "@/modules/trpc/trpc";
import ActionButton from "../buttons/action-button";

type ReducerAction = {
  type: string;
  payload: { id: number; status: ActionStatus } | Partial<State>;
};

type State = {
  isUnlocked: boolean;
  socialUnlock: SocialUnlock;
};

const evaluate = (state: State): State => {
  const isUnlocked = Object.values(state.socialUnlock.actions.entities).every(
    (action) => action.status == constants.Action.Status.CompletedAction
  );

  return { ...state, isUnlocked };
};

function reducer(state: State, { type, payload }: ReducerAction): State {
  switch (type) {
    case "set-action-status":
      var { id, status } = payload as { id: number; status: ActionStatus };
      var newState = { ...state };
      newState.socialUnlock.actions.entities[id].status = status;
      // TODO: update lockstate
      return evaluate(newState);
    case "set":
      var newState = { ...state };
      const entries = Object.entries(payload as Partial<State>);
      entries.forEach(([key, value]) => set(newState, key, value));
      return newState;
    default:
      throw new Error();
  }
}

type Props = {
  socialUnlock: SocialUnlock | null;
};

export default function SocialUnlockComponent({ socialUnlock }: Props) {
  if (!socialUnlock) {
    // Don't allow state socialUnlock to be set to undefined
    // not loaded yet
    // TODO: Use placeholder HTML
    return null;
  }

  const incrementUnlocks = trpc.socialUnlock.incrementUnlocks.useMutation();

  const { actions, title, destinationURL, status } = socialUnlock;

  if (status == constants.SocialUnlock.Status.DELETED) {
    return (
      <div className="my-14 rounded-xl p-6 text-center mx-auto max-w-md flex justify-center flex-col">
        <h1 className="text-2xl font-semibold">This lock has be removed</h1>
      </div>
    );
  }

  const [state, dispatch] = useReducer(reducer, {
    isUnlocked: false,
    socialUnlock,
  });

  useEffect(() => {
    if (state.isUnlocked) {
      incrementUnlocks.mutate({ id: state.socialUnlock.id! });
      analytics.logEvent({
        name: "social_unlock_unlock",
        social_unlock_id: socialUnlock.id,
        social_unlock_user_id: socialUnlock.user!.id,
      });
    }
  }, [state.isUnlocked]);

  const handleStatusChange = (status: ActionStatus, action: Action) =>
    dispatch({
      type: "set-action-status",
      payload: { id: action.id, status },
    });

  return (
    <div className="rounded-xl p-7 bg-gray-100 dark:bg-gray-800 text-center max-w-sm w-full flex justify-center flex-col gap-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">{title || "*title goes here*"}</h1>
      </div>
      <motion.div layout className="flex flex-col gap-y-2">
        {actions.ids.map((id) => {
          const action = actions.entities[id];
          const buttonProps = constants.Props.Action.Button[action.type];

          return (
            <ActionButton
              {...buttonProps}
              key={action.id + action.url + action.type}
              action={action}
              onStatusChange={(status: ActionStatus) =>
                handleStatusChange(status, action)
              }
              socialUnlock={state.socialUnlock}
              className="w-full flex justify-center items-center"
            >
              <buttonProps.provider.Icon
                key={`${action.id}-icon}`}
                className="px-2"
              />
              <div className="mr-5 w-full" key={`${action.id}-title}`}>
                {typeof buttonProps.title == "string"
                  ? buttonProps.title
                  : buttonProps.title(action.url)}
              </div>
            </ActionButton>
          );
        })}
      </motion.div>
      <button
        className="rounded-xl py-2.5 text-xl text-red-500 bg-red-100 active:text-red-400 disabled:text-gray-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 duration-300 transition-color"
        onClick={() => (window.location.href = destinationURL)}
        disabled={!state.isUnlocked}
      >
        Unlock Link
      </button>
    </div>
  );
}
