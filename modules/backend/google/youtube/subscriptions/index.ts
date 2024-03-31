import { User } from "@/types";
import oauthClient from "../../oauth-client";
import youtube from "../client";
import debug from "../../debug";

const list = async (user: User, channelId: string) => {
  const auth = oauthClient(user);
  const resp = await youtube.subscriptions.list({
    auth,
    part: ["snippet"],
    forChannelId: channelId,
    mine: true,
  });

  debug({ check: resp.data });
  return resp.data;
};

const insert = async (user: User, channelId: string) => {
  const auth = oauthClient(user);
  debug(auth);

  const resp = await youtube.subscriptions.insert({
    auth,
    part: ["snippet"],
    resource: {
      snippet: {
        resourceId: {
          kind: "youtube#channel",
          channelId,
        },
      },
    },
  } as any);

  debug({ insert: resp.data });

  return resp.data;
};

const subscriptions = { list, insert };

export default subscriptions;
