import User from "./User";
import SocialUnlock from "./SocialUnlock";
import Collection from "./Collection";
import LockState from "./LockState";

const admin = {
  User,
  SocialUnlock,
  Collection,
  LockState,
};

export default admin;
export type Admin = typeof admin;
