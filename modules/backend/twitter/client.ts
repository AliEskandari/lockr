import { Client } from "twitter-api-sdk";
import oauthClient from "./oauth-client";
import { User } from "@/types";
import { OAuth2User } from "twitter-api-sdk/dist/OAuth2User";

export interface TwitterClient extends Client {
  oauthClient?: OAuth2User;
}

const client = (user: User) => {
  const auth = oauthClient(user);
  const client = new Client(auth) as TwitterClient;
  client.oauthClient = auth;
  return client;
};

export default client;
