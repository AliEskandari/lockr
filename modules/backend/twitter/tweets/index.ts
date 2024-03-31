import { User } from "@/types";
import client from "../client";
import admin from "@/modules/backend/admin";

const retweet = async (user: User, tweetId: string) => {
  const _client = client(user);

  // Retweet
  const retweet = await _client.tweets.usersIdRetweets(
    user.accounts.twitter!.id!,
    {
      tweet_id: tweetId,
    }
  );

  // Store updated token
  if (_client.oauthClient?.token) {
    const { access_token, refresh_token, expires_at } =
      _client.oauthClient.token;
    if (access_token != user.accounts.twitter!.accessToken) {
      await admin.User.update(user.id, {
        accounts: {
          twitter: {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt: expires_at,
          },
        },
      });
    }
  }

  return retweet;
};

const like = async (user: User, tweetId: string) => {
  const _client = client(user);

  // Like
  const like = await _client.tweets.usersIdLike(user.accounts.twitter!.id!, {
    tweet_id: tweetId,
  });

  // Store updated token
  if (_client.oauthClient?.token) {
    const { access_token, refresh_token, expires_at } =
      _client.oauthClient.token;
    if (access_token != user.accounts.twitter!.accessToken) {
      await admin.User.update(user.id, {
        accounts: {
          twitter: {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt: expires_at,
          },
        },
      });
    }
  }
  return like;
};

const tweets = { retweet, like };
export default tweets;
