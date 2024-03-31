import { deleteCookie, getCookies } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Account, AuthOptions, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import admin from "@/modules/backend/admin";
import debug from "@/modules/backend/debug";
import { initializeAdmin } from "@/modules/backend/firebase-admin";
import { env } from "@/modules/env";

type GoogleProfile = Profile & {
  email_verified: boolean;
  picture: string;
};

type TwitterProfile = {
  data: {
    username: string;
    profile_image_url: string;
    id: string;
    name: string;
  };
};

export const authOptions = (req: NextApiRequest, res: NextApiResponse) => {
  return {
    secret: env.NEXTAUTH_SECRET,
    providers: [
      GoogleProvider({
        clientId: env.GOOGLE__CLIENT_ID,
        clientSecret: env.GOOGLE__CLIENT_SECRET,
        authorization: {
          params: {
            access_type: "offline",
            scope: env.GOOGLE__SCOPES.split(",").join(" "),
          },
        },
      }),
      TwitterProvider({
        clientId: env.TWITTER__CLIENT_ID,
        clientSecret: env.TWITTER__CLIENT_SECRET,
        version: "2.0",
        authorization: {
          params: {
            scope: env.TWITTER__SCOPES.split(",").join(" "),
          },
        },
      }),
    ],
    callbacks: {
      async signIn({
        account,
        profile,
      }: {
        account: Account;
        profile?: Profile;
      }) {
        const { userId, lockStateId, actionId } = getCookies({ req, res });

        debug("Handling sign in... %O %O", account, profile);

        if (lockStateId && actionId) {
          await admin.LockState.update(lockStateId, {
            actions: {
              entities: {
                [parseInt(actionId)]: {
                  status: "DONE_CONNECT_ACCOUNT",
                },
              },
            },
          });
          deleteCookie("userId", { req, res });
          deleteCookie("actionId", { req, res });
          //   redirectURL += `?${encode({ lockStateId })}`;
        }

        if (!userId) return false;

        if (account.provider === "google") {
          const googleProfile = profile as GoogleProfile;

          await admin.User.update(userId, {
            accounts: {
              google: {
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                name: googleProfile.name,
                picture: googleProfile.picture,
              },
            },
          });

          return true;
        } else if (account.provider == "twitter") {
          const twitterProfile = profile as TwitterProfile;
          await admin.User.update(userId, {
            accounts: {
              twitter: {
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                name: twitterProfile.data.name,
                picture: twitterProfile.data.profile_image_url,
                id: twitterProfile.data.id,
                expiresAt: account.expires_at,
                scope: account.scope,
              },
            },
          });
        }
        return true;
      },
    },
  } as AuthOptions;
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await initializeAdmin();
  return NextAuth(req, res, authOptions(req, res));
};
