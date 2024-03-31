import EmptySocialUnlocks from "@/components/empty-states/empty-social-unlocks";
import FormGroup from "@/components/form-groups/form-group";
import Input from "@/components/inputs/input";
import GenericSelect from "@/components/selects/generic-select";
import AuthUserContext from "@/contexts/auth-user";
import db from "@/modules/db";
import { STATUS } from "@/modules/db/SocialUnlock";
import entityManager from "@/modules/entity-manager";
import { classNames } from "@/modules/functions/css";
import { Action, SocialUnlock } from "@/types";
import {
  CollectionSocialUnlock,
  PopulatedCollection,
  PopulatedCollectionSocialUnlock,
} from "@/types/Collection";
import { MinusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import {
  ChangeEvent,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const BLANK_COLLECTION_SOCIAL_UNLOCK: PopulatedCollectionSocialUnlock = {
  id: 0, // will be replaced
  socialUnlock: {
    id: "",
    title: "Social Unlock",
    status: STATUS.ACTIVE,
    user: {
      id: "",
      subscription: null,
    },
    actions: entityManager.create([
      {
        type: "YOUTUBE_SUBSCRIBE_TO_CHANNEL",
        url: "",
        directConnect: false,
      } as Action,
    ]),
    views: 0,
    unlocks: 0,
    isValid: false,
    destinationURL: "",
  },
  title: "",
};

export namespace CollectionFormReducer {
  export type Action = {
    type: string;
    payload?: any;
  };

  export type State = PopulatedCollection;
}

const initialState: CollectionFormReducer.State = {
  id: "",
  user: null,
  deletedAt: null,
  title: "",
  description: "",
  collectionSocialUnlocks: {
    0: BLANK_COLLECTION_SOCIAL_UNLOCK,
  },
  isValid: false,
  status: "active",
  views: 0,
};

function reducer(
  state: CollectionFormReducer.State,
  action: CollectionFormReducer.Action
) {
  switch (action.type) {
    case "add-collection-social-unlock":
      if (Object.keys(state.collectionSocialUnlocks).length == 10) return state;
      const collectionSocialUnlocksArray = Object.values(
        state.collectionSocialUnlocks
      );
      // Add blank collection social unlock
      collectionSocialUnlocksArray.push(BLANK_COLLECTION_SOCIAL_UNLOCK);
      const collectionSocialUnlocks: PopulatedCollection["collectionSocialUnlocks"] =
        {};
      collectionSocialUnlocksArray.map(
        (collectionSocialUnlock, index) =>
          (collectionSocialUnlocks[index] = {
            ...collectionSocialUnlock,
            id: index,
          })
      );

      return validate({
        ...state,
        collectionSocialUnlocks,
      });
    case "delete-collection-social-unlock":
      delete state.collectionSocialUnlocks[action.payload.id];
      return validate({ ...state });
    case "update-collection-social-unlock":
      return validate({
        ...state,
        collectionSocialUnlocks: {
          ...state.collectionSocialUnlocks,
          [action.payload.id]: action.payload.params,
        },
      });
    case "shift-down":
      var id = action.payload.id;
      var copy = { ...state.collectionSocialUnlocks };
      var temp = copy[id + 1];
      copy[id + 1] = copy[id];
      copy[id] = temp;
      return validate({ ...state, collectionSocialUnlocks: copy });

    case "update-description":
      return validate({
        ...state,
        description: action.payload.value,
      });
    case "update-title":
      return validate({
        ...state,
        title: action.payload.value,
      });

    default:
      return state;
  }
}

const validate = (state: CollectionFormReducer.State) => {
  let errors: Required<PopulatedCollection["errors"]> = {
    title: [],
    description: [],
    collectionSocialUnlocks: {},
  };
  let isValid = true;
  if (state.title.length == 0) {
    errors.title.push({ code: "empty-title" });
    isValid = false;
  }

  for (const key in state.collectionSocialUnlocks) {
    const collectionSocialUnlock = state.collectionSocialUnlocks[key];
    if (collectionSocialUnlock.socialUnlock.id == null) {
      errors.collectionSocialUnlocks[key] = [{ code: "empty-social-unlock" }];
      isValid = false;
    }
  }

  return { ...state, isValid, errors } as CollectionFormReducer.State;
};

type CollectionFormProps = {
  collection?: PopulatedCollection;
  onValidation?: (state: CollectionFormReducer.State) => void;
  children?: ReactNode;
  className?: string;
};

/**
 * Used to create and edit collections.
 */
export default function Form({
  collection,
  onValidation,
  children,
  className,
}: CollectionFormProps) {
  const [state, dispatch] = useReducer(
    reducer,
    validate({ ...initialState, ...collection })
  );
  const [socialUnlocks, setSocialUnlocks] = useState({});
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    onValidation?.(state);
  }, [state]);

  useEffect(() => {
    (async function () {
      if (!authUser) return;
      const socialUnlocks = await db.SocialUnlock.find({
        "user.id": authUser.uid,
        status: STATUS.ACTIVE,
      });
      setSocialUnlocks(socialUnlocks);
    })();
  }, [authUser]);

  return (
    <div
      className={classNames(
        "min-w-[200px] py-1 rounded-xl mb-2 grid grid-cols-1 gap-y-2",
        className
      )}
    >
      <h1 className="text-sm text-gray-400 px-4 uppercase tracking-wide">
        Collection
      </h1>
      <FormGroup className="mb-5">
        {/* Title */}
        <Input
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            dispatch({
              type: "update-title",
              payload: { value: target.value },
            })
          }
          className="rounded-t-xl bg-gray-100 dark:bg-gray-800"
          onClear={() =>
            dispatch({ type: "update-title", payload: { value: "" } })
          }
          placeholder="Collection Title"
          value={state.title}
        />
        <textarea
          onChange={({ target }) =>
            dispatch({
              type: "update-description",
              payload: { value: target.value },
            })
          }
          value={state.description}
          className="rounded-t-none rounded-b-xl w-full py-3 pl-4 pr-10 peer bg-gray-100 dark:bg-gray-800 focus:outline-none caret-red-500 resize-none"
          placeholder="Description"
        />
      </FormGroup>

      {/* Add Collection Social Unlocks */}
      <div className="flex items-baseline justify-between space-x-2 px-2">
        <h1 className="inline-flex text-gray-400 uppercase tracking-wide text-sm px-2">
          Social Unlocks
        </h1>
        <button
          className="p-1 rounded-lg text-red-500 active:text-red-400"
          onClick={() => dispatch({ type: "add-collection-social-unlock" })}
        >
          <PlusIcon className="w-6 h-6  stroke-2" />
        </button>
      </div>

      {/* Social Unlock List */}
      <div className="flex gap-y-6 flex-col mb-2">
        {Object.entries(state.collectionSocialUnlocks).map(
          ([id, collectionSocialUnlock], index) => (
            <CollectionSocialUnlockFormField
              key={id}
              collectionSocialUnlock={collectionSocialUnlock}
              socialUnlocks={socialUnlocks}
              onUpdate={(params: PopulatedCollectionSocialUnlock) =>
                dispatch({
                  type: "update-collection-social-unlock",
                  payload: { id, params },
                })
              }
              onDelete={() =>
                dispatch({
                  type: "delete-collection-social-unlock",
                  payload: { id },
                })
              }
              onShiftDown={() =>
                dispatch({ type: "shift-down", payload: { id: parseInt(id) } })
              }
              disableDelete={
                Object.keys(state.collectionSocialUnlocks).length == 1
              }
              disableShiftDown={
                index == Object.values(state.collectionSocialUnlocks).length - 1
              }
            />
          )
        )}
      </div>
      {children}
    </div>
  );
}

type CollectionSocialUnlockFormFieldProps = {
  socialUnlocks: Record<string, SocialUnlock>;
  collectionSocialUnlock: PopulatedCollectionSocialUnlock;
  onUpdate: (params: PopulatedCollectionSocialUnlock) => void;
  onDelete: () => void;
  onShiftDown: () => void;
  disableDelete: boolean;
  disableShiftDown: boolean;
};

const CollectionSocialUnlockFormField = ({
  socialUnlocks,
  collectionSocialUnlock,
  onDelete,
  onUpdate,
  onShiftDown,
  disableDelete,
  disableShiftDown,
}: CollectionSocialUnlockFormFieldProps) => {
  const optionFromSocialUnlock = (socialUnlock: SocialUnlock) => {
    return {
      id: socialUnlock.id,
      name: socialUnlock.title,
      value: socialUnlock,
    };
  };

  const optionsFromSocialUnlocks = (socialUnlocks: SocialUnlock[]) => {
    return socialUnlocks.map((socialUnlock) =>
      optionFromSocialUnlock(socialUnlock)
    );
  };

  return (
    <div className="">
      <FormGroup className="mb-1">
        {/* Social Unlock Select */}
        <GenericSelect
          options={optionsFromSocialUnlocks(Object.values(socialUnlocks))}
          selected={optionFromSocialUnlock(collectionSocialUnlock.socialUnlock)}
          onChange={(option) =>
            onUpdate({
              ...collectionSocialUnlock,
              socialUnlock: option.value,
            })
          }
          classNames={{
            Button: classNames(
              "rounded-t-xl bg-gray-100 dark:bg-gray-800",
              !collectionSocialUnlock.socialUnlock.id
                ? "text-gray-400 font-normal"
                : null
            ),
            Chevron: "text-gray-400",
            Options: "bg-gray-100 dark:bg-gray-800",
          }}
          emptyState={<EmptySocialUnlocks />}
        />
        {/* Collection Social Unlock Title */}
        <Input
          onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
            onUpdate({ ...collectionSocialUnlock, title: target.value });
          }}
          className="rounded-b-xl bg-gray-100 dark:bg-gray-800"
          value={collectionSocialUnlock.title}
          placeholder="Title"
          onClear={() => {
            onUpdate({ ...collectionSocialUnlock, title: "" });
          }}
        />
      </FormGroup>
      {/* Buttons */}
      <div className="flex justify-between text-gray-400">
        <button
          className="disabled:hidden flex justify-center items-center text-xs rounded-xl p-2 active:text-gray-300 uppercase tracking-wide"
          onClick={onDelete}
          disabled={disableDelete}
        >
          <MinusCircleIcon className="w-4 h-full mr-1" /> Remove
        </button>
        <button
          className="disabled:hidden flex justify-center items-center text-sm rounded-xl p-2 active:text-gray-300"
          onClick={onShiftDown}
          disabled={disableShiftDown}
        >
          <ArrowsUpDownIcon className="w-4 h-full mr-1" />
        </button>
      </div>
    </div>
  );
};
