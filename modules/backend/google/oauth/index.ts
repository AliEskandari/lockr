import { User } from "@/types";
import { FieldValue } from "firebase-admin/firestore";
import admin from "@/modules/backend/admin";
import debug from "../debug";
import oauthClient from "../oauth-client";

const revoke = async (user: User) => {
  const client = oauthClient(user);

  debug("Revoking google credentials for user...");
  try {
    await client.refreshAccessToken();
    await client.revokeCredentials();
  } catch (error) {
    debug("Error revoking google credentials: %O", error);
  }

  await admin.User.update(user.id, {
    accounts: { google: FieldValue.delete() },
  });
  return user;
};
const oauth = { revoke };
export default oauth;
