const TWEET_URL_REGEX = /https:\/\/twitter.com\/[\w]*\/status\/(\d*)/;
const YOUTUBE_VIDEO_URL_REGEX =
  /https:\/\/(?:www\.)?youtube.com\/watch\?v=(\w*)/;

const tweetId = (url: string) => {
  const match = url.match(TWEET_URL_REGEX);
  return match ? match[1] : "";
};

const videoId = (url: string) => {
  const match = url.match(YOUTUBE_VIDEO_URL_REGEX);
  return match ? match[1] : "";
};

const extract = { tweetId, videoId };
export default extract;
