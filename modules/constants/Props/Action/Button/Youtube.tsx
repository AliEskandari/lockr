import Action from "@/modules/constants/Action";
import Provider from "@/modules/constants/Provider";
import extract from "@/modules/functions/strings/extract";
import { openTabWithPrefix } from "@/modules/functions/browser";
import { trpc } from "@/modules/trpc/vanilla-trpc";
import { ButtonType } from ".";

const Type = Action.Type;
const { Youtube: YoutubeProvider } = Provider;

const Youtube: Pick<
  ButtonType,
  (typeof Action.Type)["Youtube"][keyof (typeof Action.Type)["Youtube"]]
> = {
  // YOUTUBE...
  [Type.Youtube.LikeVideo]: {
    provider: YoutubeProvider,
    title: "Like video",
    onClick: openTabWithPrefix(""),
    onClickDirect: (userId, actionUrl) =>
      trpc.google.like.mutate({
        userId,
        videoId: extract.videoId(actionUrl),
      }),
    style: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white",
  },
  [Type.Youtube.SubscribeToChannel]: {
    provider: YoutubeProvider,
    title: (handle: string) =>
      !handle ? (
        "Subscribe on Youtube"
      ) : (
        <>
          Subscribe to <span className="font-bold">{handle}</span>
        </>
      ),
    onClick: openTabWithPrefix("https://youtube.com/"),
    onClickDirect: (userId, actionUrl) =>
      trpc.google.subscribe.mutate({ userId, targetId: actionUrl }),
    style: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white",
  },
  [Type.Youtube.PostComment]: {
    provider: YoutubeProvider,
    title: "Post comment",
    onClick: openTabWithPrefix(""),
    style: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white",
  },
};

export default Youtube;
