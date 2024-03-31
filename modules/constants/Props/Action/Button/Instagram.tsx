import Action from "@/modules/constants/Action";
import Provider from "@/modules/constants/Provider";
import { openTabWithPrefix } from "@/modules/functions/browser";
import { ButtonType } from ".";

const Type = Action.Type;
const { Instagram: InstagramProvider } = Provider;

const Instagram: Pick<
  ButtonType,
  (typeof Action.Type)["Instagram"][keyof (typeof Action.Type)["Instagram"]]
> = {
  [Type.Instagram.FollowUser]: {
    provider: InstagramProvider,
    title: "Follow on Instagram",
    onClick: openTabWithPrefix("https://instagram.com/"),
    style: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white",
  },
  [Type.Instagram.Repost]: {
    provider: InstagramProvider,
    title: "Repost",
    onClick: openTabWithPrefix(""),
    style: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white",
  },
  [Type.Instagram.LikePost]: {
    provider: InstagramProvider,
    title: "Like post",
    onClick: openTabWithPrefix(""),
    style: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white",
  },
  [Type.Instagram.ReplyToPost]: {
    provider: InstagramProvider,
    title: "Reply to post",
    onClick: openTabWithPrefix(""),
    style: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white",
  },
};

export default Instagram;
