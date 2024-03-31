import { User } from "@/types";
import _client from "../client";
import oauthClient from "../oauth-client";
import debug from "../debug";
import { FieldValue } from "firebase-admin/firestore";
import admin from "@/modules/backend/admin";

const revoke = async (user: User) => {
  debug("Revoking twitter for user...");
  const _oauthClient = oauthClient(user);
  const resp = await _oauthClient.revokeAccessToken();

  if (resp.revoked) {
    await admin.User.update(user.id, {
      accounts: { twitter: FieldValue.delete() },
    });
  } else {
    debug(resp);
    throw Error("Could not revoke Twitter connection.");
  }
};

const oauth = { revoke };
export default oauth;
