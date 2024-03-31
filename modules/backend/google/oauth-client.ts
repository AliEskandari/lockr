import { User } from "@/types";
import { google } from "googleapis";
import { generateCallbackPath } from "@/modules/backend/functions/generateCallbackPath";

const oauthClient = (user: User) => {
  const _oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE__CLIENT_ID,
    process.env.GOOGLE__CLIENT_SECRET,
    process.env.HOSTS__API + generateCallbackPath("google")
  );
  _oauth2Client.setCredentials({
    access_token: user.accounts.google.accessToken,
    refresh_token: user.accounts.google.refreshToken,
  });
  return _oauth2Client;
};

export default oauthClient;
