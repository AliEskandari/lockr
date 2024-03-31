import oauthClient from "../../oauth-client";
import client from "../client";
import { User } from "@/types";
import debug from "../../debug";

const list = async (user: User, targetId: string) => {
  const auth = oauthClient(user);
  const resp = await client.search.list({
    auth,
    part: ["snippet"],
    type: ["channel"],
    q: targetId,
  });

  debug({ search: resp.data });

  return resp.data;
};

const search = { list };
export default search;
