import client from "./client";
import oauthClient from "./oauth-client";
import oauth from "./oauth";
import tweets from "./tweets";
import users from "./users";

const twitter = { client, oauthClient, users, tweets, oauth };
export default twitter;
