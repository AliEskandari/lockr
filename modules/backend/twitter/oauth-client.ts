import { auth } from "twitter-api-sdk";
import { OAuth2Scopes } from "twitter-api-sdk/dist/OAuth2User.js";
import { generateCallbackPath } from "@/modules/backend/functions/generateCallbackPath";
import { User } from "@/types";
import { env } from "@/modules/env";

const oauthClient = (user: User) => {
  if (!user.accounts.twitter) {
    throw new Error("User does not have a Twitter account.");
  }

  return new auth.OAuth2User({
    client_id: env.TWITTER__CLIENT_ID,
    client_secret: env.TWITTER__CLIENT_SECRET,
    callback: env.HOSTS__API + generateCallbackPath("twitter"),
    scopes: env.TWITTER__SCOPES.split(",") as OAuth2Scopes[],
    token: {
      access_token: user.accounts.twitter.accessToken,
      refresh_token: user.accounts.twitter.refreshToken,
      expires_at: user.accounts.twitter.expiresAt,
    },
  });
};

export default oauthClient;
