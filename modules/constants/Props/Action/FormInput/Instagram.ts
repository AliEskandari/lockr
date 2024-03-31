import { FormInputType } from ".";
import Action from "@/modules/constants/Action";
import Provider from "@/modules/constants/Provider";

const Type = Action.Type;
const { Instagram: InstagramProvider } = Provider;

const Instagram: Pick<
  FormInputType,
  (typeof Action.Type)["Instagram"][keyof (typeof Action.Type)["Instagram"]]
> = {
  [Type.Instagram.FollowUser]: {
    provider: InstagramProvider,
    input: {
      title: "Follow user",
      placeholder: "Instagram username",
      type: "text",
    },
    directConnect: { enabled: false },
  },
  [Type.Instagram.Repost]: {
    provider: InstagramProvider,
    input: { title: "Repost", placeholder: "*link to post*", type: "text" },
    directConnect: { enabled: false },
  },
  [Type.Instagram.LikePost]: {
    provider: InstagramProvider,
    input: { title: "Like post", placeholder: "*link to post*", type: "text" },
    directConnect: { enabled: false },
  },
  [Type.Instagram.ReplyToPost]: {
    provider: InstagramProvider,
    input: {
      title: "Reply to post",
      placeholder: "*link to post*",
      type: "text",
    },
    directConnect: { enabled: false },
  },
};

export default Instagram;
