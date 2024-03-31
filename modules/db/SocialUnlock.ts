import constants from "@/modules/constants";
import { Action, ActionType, SocialUnlock } from "@/types";
import {
  PartialWithFieldValue,
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/modules/firebase/app";
import { isURL } from "../functions/urls";
import User from "./User";
import { QueryConstraints } from "@/types/QueryConstraints";
import entityManager from "../entity-manager";

const COLLECTION_NAME = "socialUnlocks";

export const STATUS = {
  ACTIVE: "ACTIVE",
  DELETED: "DELETED",
} as const;

export const BLANK_SOCIAL_UNLOCK_ACTION: Action = {
  id: 0,
  type: constants.Action.Type.Youtube.SubscribeToChannel,
  url: "",
  directConnect: false,
};

const _new = (): SocialUnlock => {
  const docRef = doc(collection(db, `${COLLECTION_NAME}`));
  return {
    id: docRef.id,
    title: "",
    destinationURL: "",
    actions: entityManager.create([BLANK_SOCIAL_UNLOCK_ACTION]),
    views: 0,
    unlocks: 0,
    user: null,
    isValid: false,
    status: constants.SocialUnlock.Status.ACTIVE,
    errors: { actions: {} },
    deletedAt: null,
    createdAt: null,
  };
};

const create = async (socialUnlock: SocialUnlock) => {
  const docRef = doc(db, `${COLLECTION_NAME}/${socialUnlock.id}`);
  await setDoc(docRef, {
    ...socialUnlock,
    createdAt: new Date().toISOString(),
  });

  if (socialUnlock.user!.id)
    await User.addSocialUnlock(socialUnlock.user!.id, docRef.id);
  return Promise.resolve(docRef);
};
const update = async (
  id: string,
  params: PartialWithFieldValue<SocialUnlock>
) => {
  const docRef = doc(db, `${COLLECTION_NAME}/${id}`);
  await updateDoc(docRef, {
    ...params,
    updatedAt: new Date().toISOString(),
  });
  return Promise.resolve(docRef);
};

const find: {
  (constraints: QueryConstraints, callback: undefined): Promise<SocialUnlock[]>;
  (
    constraints: QueryConstraints,
    callback: (socialUnlocks: SocialUnlock[]) => void
  ): Unsubscribe;
} = (
  constraints: QueryConstraints,
  callback: ((socialUnlocks: SocialUnlock[]) => void) | undefined
): any => {
  const entries = Object.entries(constraints);
  const queryConstraints = entries.map((entry) =>
    where(entry[0], "==", entry[1])
  );
  const q = query(collection(db, `${COLLECTION_NAME}`), ...queryConstraints);

  if (callback) {
    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map((doc) => doc.data() as SocialUnlock);
      callback(docs);
    });
  } else {
    return getDocs(q).then((querySnapshot) =>
      querySnapshot.docs.map((doc) => doc.data() as SocialUnlock)
    );
  }
};

const findById = async (id: string) => {
  const docRef = await getDoc(doc(db, `${COLLECTION_NAME}/${id}`));
  if (!docRef.exists()) return null;
  return docRef.data() as SocialUnlock;
};

const _delete = (id: string) => {
  return update(id, {
    status: STATUS.DELETED,
    deletedAt: new Date().toISOString(),
  });
};

const destroy = async ({ id, userId }: { id: string; userId: string }) => {
  await deleteDoc(doc(db, `${COLLECTION_NAME}/${id}`));
  return User.removeSocialUnlock(userId, id);
};

const validate = (socialUnlock: SocialUnlock) => {
  const errors: Required<SocialUnlock["errors"]> = {
    title: [],
    destinationURL: [],
    actions: {},
  };
  let isValid = true;

  if (socialUnlock.title.length == 0) {
    errors.title.push({ code: "empty-title", message: "title is required" });
    isValid = false;
    return { isValid, errors };
  }

  const everyActionIsValid = socialUnlock.actions.ids.every((id) => {
    const action = socialUnlock.actions.entities[id];
    if (action?.url.length == 0) {
      errors.actions[id] = [{ code: "empty-action-url", message: "required" }];
      isValid = false;
      return false;
    }
    const { isValid: isValidAction, errors: actionErrors } =
      validateActionBasedOnType(action);

    if (!isValidAction) {
      errors.actions[id] = actionErrors;
      isValid = false;
      return false;
    }

    return true;
  });

  if (!everyActionIsValid) return { isValid, errors };

  if (socialUnlock.destinationURL.length == 0) {
    errors.destinationURL.push({ code: "empty-destination-url", message: "" });
    isValid = false;
    return { isValid, errors };
  } else if (!isURL(socialUnlock.destinationURL)) {
    errors.destinationURL.push({
      code: "destination-url-is-not-url",
      message: "must be a link 🔗",
    });
    isValid = false;
    return { isValid, errors };
  }

  return { isValid, errors };
};

export default {
  new: _new,
  create,
  update,
  find,
  findById,
  delete: _delete,
  destroy,
  validate,
};

export const isUsername = (string: string) => {
  const regex = /^@[a-zA-Z0-9_]{1,15}$/;
  return regex.test(string);
};

export const youtubeUsernameValidator = (string: string) => {
  if (isUsername(string)) return { isValid: true, errors: [] };
  return {
    isValid: false,
    errors: [
      { code: "invalid-youtube-username", message: "invalid youtube handle" },
    ],
  };
};

export const twitterUsernameValidator = (string: string) => {
  if (isUsername(string)) return { isValid: true, errors: [] };
  return {
    isValid: false,
    errors: [
      { code: "invalid-twitter-username", message: "invalid twitter handle" },
    ],
  };
};

export const youtubeVideoURLValidator = (string: string) => {
  if (isURL(string)) return { isValid: true, errors: [] };
  return {
    isValid: false,
    errors: [
      {
        code: "invalid-youtube-video-url",
        message: "invalid youtube video url 🔗",
      },
    ],
  };
};

export const twitterTweetURLValidator = (string: string) => {
  if (isURL(string)) return { isValid: true, errors: [] };
  return {
    isValid: false,
    errors: [
      {
        code: "invalid-twitter-tweet-url",
        message: "invalid twitter tweet url",
      },
    ],
  };
};

export const instagramUserURLValidator = (string: string) => {
  if (isURL(string)) return { isValid: true, errors: [] };
  return {
    isValid: false,
    errors: [
      {
        code: "invalid-instagram-user-url",
        message: "invalid instagram user url",
      },
    ],
  };
};

export const instagramPostURLValidator = (string: string) => {
  if (isURL(string)) return { isValid: true, errors: [] };
  return {
    isValid: false,
    errors: [
      {
        code: "invalid-instagram-post-url",
        message: "invalid instagram post url",
      },
    ],
  };
};

export const validateActionBasedOnType = (action: Action) => {
  if (
    (
      [constants.Action.Type.Youtube.SubscribeToChannel] as ActionType[]
    ).includes(action.type)
  ) {
    // @username
    return youtubeUsernameValidator(action.url);
  }
  if (
    ([constants.Action.Type.Twitter.FollowUser] as ActionType[]).includes(
      action.type
    )
  ) {
    // @username
    return twitterUsernameValidator(action.url);
  } else if (
    (
      [
        constants.Action.Type.Twitter.ReplyToTweet,
        constants.Action.Type.Twitter.LikeTweet,
        constants.Action.Type.Twitter.Retweet,
      ] as ActionType[]
    ).includes(action.type)
  ) {
    // twitter tweet url
    return twitterTweetURLValidator(action.url);
  } else if (
    (
      [
        constants.Action.Type.Youtube.LikeVideo,
        constants.Action.Type.Youtube.PostComment,
      ] as ActionType[]
    ).includes(action.type)
  ) {
    // youtube video url
    return youtubeVideoURLValidator(action.url);
  } else if (
    ([constants.Action.Type.Instagram.FollowUser] as ActionType[]).includes(
      action.type
    )
  ) {
    // instagram user url
    return instagramUserURLValidator(action.url);
  } else if (
    (
      [
        constants.Action.Type.Instagram.LikePost,
        constants.Action.Type.Instagram.ReplyToPost,
        constants.Action.Type.Instagram.Repost,
      ] as ActionType[]
    ).includes(action.type)
  ) {
    // instagram post url
    return instagramPostURLValidator(action.url);
  } else {
    return { isValid: true, errors: [] };
  }
};
