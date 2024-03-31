import { FormInputType } from ".";
import Action from "@/modules/constants/Action";
import Provider from "@/modules/constants/Provider";

const Type = Action.Type;
const { Youtube: YoutubeProvider } = Provider;

const Youtube: Pick<
  FormInputType,
  (typeof Action.Type)["Youtube"][keyof (typeof Action.Type)["Youtube"]]
> = {
  // YOUTUBE...
  [Type.Youtube.LikeVideo]: {
    provider: YoutubeProvider,
    input: {
      title: "Like video",
      placeholder: "*link to video*",
      type: "text",
    },
    directConnect: { enabled: true },
  },
  [Type.Youtube.SubscribeToChannel]: {
    provider: YoutubeProvider,
    input: { title: "Subscribe", placeholder: "@hitboy", type: "text" },
    directConnect: { enabled: true },
  },
  [Type.Youtube.PostComment]: {
    provider: YoutubeProvider,
    input: {
      title: "Post comment",
      placeholder: "*link to post*",
      type: "text",
    },
    directConnect: { enabled: false },
  },
};

export default Youtube;
