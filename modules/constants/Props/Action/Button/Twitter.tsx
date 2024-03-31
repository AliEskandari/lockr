import Action from "@/modules/constants/Action";
import Provider from "@/modules/constants/Provider";
import { openTabWithPrefix } from "@/modules/functions/browser";
import extract from "@/modules/functions/strings/extract";
import { trpc } from "@/modules/trpc/vanilla-trpc";
import { ButtonType } from ".";
const Type = Action.Type;
const { Twitter: TwitterProvider } = Provider;

const Twitter: Pick<
  ButtonType,
  (typeof Action.Type)["Twitter"][keyof (typeof Action.Type)["Twitter"]]
> = {
  [Type.Twitter.FollowUser]: {
    provider: TwitterProvider,
    title: (handle: string) =>
      !handle ? (
        "Follow on Twitter"
      ) : (
        <>
          Follow <span className="font-bold">{handle}</span>
        </>
      ),
    onClick: openTabWithPrefix("https://twitter.com/"),
    onClickDirect: async (userId, actionUrl) =>
      trpc.twitter.follow.mutate({ userId, targetId: actionUrl }),
    style: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white",
  },
  [Type.Twitter.Retweet]: {
    provider: TwitterProvider,
    title: "Retweet",
    onClick: openTabWithPrefix(""),
    onClickDirect: (userId, actionUrl) =>
      trpc.twitter.retweet.mutate({
        userId,
        targetId: extract.tweetId(actionUrl),
      }),
    style: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white",
  },
  [Type.Twitter.LikeTweet]: {
    provider: TwitterProvider,
    title: "Like Tweet",
    onClick: openTabWithPrefix(""),
    onClickDirect: (userId, actionUrl) =>
      trpc.twitter.like.mutate({
        userId,
        targetId: extract.tweetId(actionUrl),
      }),
    style: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white",
  },
  [Type.Twitter.ReplyToTweet]: {
    provider: TwitterProvider,
    title: "Reply to Tweet",
    onClick: openTabWithPrefix(""),
    style: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white",
  },
};

export default Twitter;
