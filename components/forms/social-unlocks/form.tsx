import ActionFromInput from "@/components/buttons/action-form-input";
import Button from "@/components/buttons/button";
import FormGroup from "@/components/form-groups/form-group";
import Heading from "@/components/headings/heading";
import Input from "@/components/inputs/input";
import AuthUserContext from "@/contexts/auth-user";
import constants from "@/modules/constants";
import db from "@/modules/db";
import { BLANK_SOCIAL_UNLOCK_ACTION } from "@/modules/db/SocialUnlock";
import entityManager from "@/modules/entity-manager";
import { classNames as merge } from "@/modules/functions/css";
import { Paths } from "@/modules/routes";
import {
  Action as SocialUnlockAction,
  EntityManager,
  SocialUnlock,
} from "@/types";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { DocumentReference } from "firebase/firestore";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

const validate = (state: SocialUnlock): SocialUnlock => {
  const { isValid, errors } = db.SocialUnlock.validate(state);
  return { ...state, isValid, errors };
};

export namespace SocialUnlockFormReducer {
  export type Action =
    | { type: "set-actions"; payload: EntityManager<SocialUnlockAction> }
    | { type: "delete-action"; payload: number }
    | {
        type: "update-action";
        payload: { id: number; action: SocialUnlockAction };
      }
    | { type: "set-actions-ids"; payload: number[] }
    | { type: "set-unlock"; payload: SocialUnlock }
    | { type: "set-views"; payload: number }
    | { type: "set-unlocks"; payload: number }
    | { type: "set-title"; payload: string }
    | { type: "set-destination-url"; payload: string }
    | { type: "set-status"; payload: string }
    | { type: "set-state"; payload: SocialUnlock };

  export type Reducer = (state: SocialUnlock, action: Action) => SocialUnlock;

  export type State = SocialUnlock;
}

const initialState: SocialUnlockFormReducer.State = db.SocialUnlock.new();

function reducer(
  state: SocialUnlockFormReducer.State,
  { type, payload }: SocialUnlockFormReducer.Action
): SocialUnlock {
  switch (type) {
    case "set-actions":
      return {
        ...state,
        actions: payload as EntityManager<SocialUnlockAction>,
      };

    case "delete-action":
      var newState = { ...state };
      var id = payload as number;
      newState.actions.ids = newState.actions.ids.filter(
        (actionId) => actionId !== id
      );
      delete newState.actions.entities[id];
      return newState;

    case "update-action":
      var newState = { ...state };
      var typedPayload = payload as { id: number; action: SocialUnlockAction };
      newState.actions.entities[typedPayload.id] = typedPayload.action;
      newState.errors!.actions![typedPayload.id] = [];
      return newState;

    case "set-actions-ids":
      var newState = { ...state };
      newState.actions.ids = payload as number[];
      return newState;

    case "set-destination-url":
      var newState = { ...state };
      newState.destinationURL = payload as string;
      newState.errors!.destinationURL = [];
      return newState;

    case "set-title":
      var newState = { ...state };
      newState.title = payload as string;
      newState.errors!.title = [];
      return newState;

    case "set-state":
      return { ...state, ...(payload as SocialUnlock) };

    default:
      throw new Error();
  }
}

export type FormProps = {
  /**
   * The lock to edit. If not provided, a new lock will be created.
   */
  socialUnlock?: Partial<SocialUnlock>;
  /**
   * Called whenever the lock changes. Passes the lock as an argument.
   * Used to pass the lock to outside components like the preview.
   */
  onChange?: (socialUnlock: SocialUnlock) => void;
  children?: ReactNode;
  className?: string;
  scrollContainerRef: MutableRefObject<HTMLElement | null>;
  onValidation?: (state: SocialUnlock) => void;
};

export default function Form({
  socialUnlock = {},
  onChange = () => {},
  onValidation,
  className,
  scrollContainerRef,
}: FormProps) {
  const authUser = useContext(AuthUserContext);
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...socialUnlock,
  });

  /**
   * Called whenever state changes. Used to pass state to outside
   * components.
   */
  useEffect(() => {
    onChange(state);
  }, [state]);

  /**
   * Performs validation on lock. If there are errors, add to errors to lock.
   * The form will diplay the errors. If there are no errors, create
   * a lock and redirect to lock's page
   */
  const handleClickCreate = async () => {
    // validate...
    const socialUnlock = validate(state);
    onValidation?.(socialUnlock);
    dispatch({ type: "set-state", payload: socialUnlock });

    if (socialUnlock.isValid) {
      socialUnlock.user = null;
      if (authUser)
        socialUnlock.user = { id: authUser.uid, subscription: null };
      socialUnlock.errors = null;
      let docRef: DocumentReference;
      if (socialUnlock.id) {
        docRef = await db.SocialUnlock.update(socialUnlock.id, socialUnlock);
      } else {
        docRef = await db.SocialUnlock.create(socialUnlock);
      }

      router.push(Paths.SocialUnlock.replace(":id", docRef.id));
    }
  };

  /**
   * Called when add action button is clicked. Adds an action to the
   * lock.
   */
  const handleClickAddAction = () => {
    if (state.actions.ids.length == 6) return;
    const actions = entityManager.add(
      { ...state.actions },
      BLANK_SOCIAL_UNLOCK_ACTION
    );
    dispatch({ type: "set-actions", payload: actions });
  };

  /**
   * Called when an action button has been reordered to a different position.
   * Updates the order by updating the ids.
   * @param ids
   */
  const onReorder = (ids: number[]) => {
    dispatch({ type: "set-actions-ids", payload: ids });
  };

  const handleChangeTitle = ({ target }: ChangeEvent<HTMLInputElement>) =>
    dispatch({
      type: "set-title",
      payload: target.value,
    });

  const handleChangeUrl = ({ target }: ChangeEvent<HTMLInputElement>) =>
    dispatch({
      type: "set-destination-url",
      payload: target.value,
    });

  const handleClearUrl = () =>
    dispatch({
      type: "set-destination-url",
      payload: "",
    });

  const handleClearTitle = () => dispatch({ type: "set-title", payload: "" });

  const handleDeleteAction = (id: number) =>
    dispatch({ type: "delete-action", payload: id });

  const handleUpdateAction = (id: number, action: SocialUnlockAction) =>
    dispatch({
      type: "update-action",
      payload: { id, action },
    });

  return (
    <div
      id="social-unlock-form"
      className={merge("flex flex-col gap-y-4", className)}
    >
      <motion.div
        layoutScroll
        className="min-w-[200px] px-4 py-8 rounded-xl mb-2 grid grid-cols-1 gap-y-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
      >
        <div className="flex flex-col gap-y-4">
          {/* Title */}
          <Heading level={1} className="px-4">
            title
          </Heading>
          <FormGroup className="mb-5">
            <Input
              onChange={handleChangeTitle}
              className="rounded-xl bg-white dark:bg-gray-700 text-xl"
              value={state.title}
              placeholder="travis scott type beat"
              onClear={handleClearTitle}
              errors={state.errors?.title}
            />
          </FormGroup>
        </div>

        <div className="flex flex-col gap-y-4">
          {/* Add Actions */}
          <div className="flex items-baseline justify-between space-x-2 px-4">
            <Heading level={1} className="inline-flex">
              actions
            </Heading>
            <Button
              className="p-1 rounded-lg text-red-500 active:text-red-400"
              onClick={handleClickAddAction}
            >
              <PlusIcon className="w-6 h-6  stroke-2" />
            </Button>
          </div>
          {/* Actions List */}
          <Reorder.Group
            className="flex flex-col gap-y-3 py-2 rounded-xl mb-5"
            axis="y"
            values={state.actions.ids}
            onReorder={onReorder}
          >
            <AnimatePresence>
              {state.actions.ids.map((id, index) => {
                const action = state.actions.entities[id];
                const actionFormInputProps =
                  constants.Props.Action.FormInput[action.type];
                return (
                  <ActionFromInput
                    {...actionFormInputProps}
                    key={id}
                    action={state.actions.entities[id]}
                    scrollContainerRef={scrollContainerRef}
                    onUpdate={(params: SocialUnlockAction) =>
                      handleUpdateAction(id, params)
                    }
                    onDelete={() => handleDeleteAction(id)}
                    disableDelete={state.actions.ids.length == 1}
                    errors={state?.errors?.actions?.[id]}
                  />
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
        </div>

        <div className="flex flex-col gap-y-4">
          <Heading level={1} className="px-4">
            link
          </Heading>
          {/* Destination URL and Title */}
          <FormGroup className="mb-5">
            {/* Destination URL */}
            <Input
              type="text"
              value={state.destinationURL}
              className="rounded-xl bg-white dark:bg-gray-700 text-xl"
              placeholder="https://link.to.beat"
              onClear={handleClearUrl}
              onChange={handleChangeUrl}
              errors={state.errors?.destinationURL}
            />
          </FormGroup>
        </div>
      </motion.div>
      <Button
        className="mt-2 py-3 px-3 bg-black text-white hover:bg-gray-900 active:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:active:bg-gray-200 w-auto disabled:active:text-gray-100 text-xl font-semibold"
        onClick={handleClickCreate}
      >
        {state.id ? "Save" : "Create"}
      </Button>
    </div>
  );
}
