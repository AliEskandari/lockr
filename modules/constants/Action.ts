const Status = {
  Ready: "READY",
  Loading: "LOADING",
  CompletedAction: "COMPLETED_ACTION",
  SigninSignup: "SIGNIN_SIGNUP",
  DoneSigninSignup: "DONE_SIGNIN_SIGNUP",
  ConnectAccount: "CONNECT_ACCOUNT",
  DoneConnectAccount: "DONE_CONNECT_ACCOUNT",
  CompletingAction: "COMPLETING_ACTION",
} as const;

const OpenStatus = [Status.SigninSignup, Status.ConnectAccount] as const;

export const Type = {
  Youtube: {
    SubscribeToChannel: "YOUTUBE_SUBSCRIBE_TO_CHANNEL",
    LikeVideo: "YOUTUBE_LIKE_VIDEO",
    PostComment: "YOUTUBE_POST_COMMENT",
  },
  Twitter: {
    FollowUser: "TWITTER_FOLLOW_USER",
    Retweet: "TWITTER_RETWEET",
    LikeTweet: "TWITTER_LIKE_TWEET",
    ReplyToTweet: "TWITTER_REPLY_TO_TWEET",
  },
  Instagram: {
    FollowUser: "INSTAGRAM_FOLLOW_USER",
    Repost: "INSTAGRAM_REPOST",
    LikePost: "INSTAGRAM_LIKE_POST",
    ReplyToPost: "INSTAGRAM_REPLY_TO_POST",
  },
} as const;

const Action = { Status, Type, OpenStatus };
export default Action;
