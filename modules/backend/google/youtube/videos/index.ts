import oauthClient from "../../oauth-client";
import youtube from "../client";
import { User } from "@/types";
import debug from "../../debug";

const rate = async (user: User, videoId: string) => {
  const auth = oauthClient(user);
  const resp = await youtube.videos.rate({
    auth,
    id: videoId,
    rating: "like",
  });

  debug({ like: resp.data });

  return resp.data;
};

const videos = { rate };
export default videos;
