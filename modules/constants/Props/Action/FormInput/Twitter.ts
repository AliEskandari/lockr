import { FormInputType } from ".";
import Action from "@/modules/constants/Action";
import Provider from "@/modules/constants/Provider";

const Type = Action.Type;
const { Twitter: TwitterProvider } = Provider;

const Twitter: Pick<
  FormInputType,
  (typeof Action.Type)["Twitter"][keyof (typeof Action.Type)["Twitter"]]
> = {
  // TWITTER...
  [Type.Twitter.FollowUser]: {
    provider: TwitterProvider,
    input: { title: "Follow", placeholder: "@hitboy", type: "text" },
    directConnect: { enabled: true },
  },
  [Type.Twitter.Retweet]: {
    provider: TwitterProvider,
    input: { title: "Retweet", placeholder: "*link to tweet*", type: "text" },
    directConnect: { enabled: true },
  },
  [Type.Twitter.LikeTweet]: {
    provider: TwitterProvider,
    input: {
      title: "Like Tweet",
      placeholder: "*link to tweet*",
      type: "text",
    },
    directConnect: { enabled: true },
  },
  [Type.Twitter.ReplyToTweet]: {
    provider: TwitterProvider,
    input: {
      title: "Reply Tweet",
      placeholder: "*link to tweet*",
      type: "text",
    },
    directConnect: { enabled: false },
  },
};

export default Twitter;
