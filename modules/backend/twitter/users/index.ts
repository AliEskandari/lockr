import { User } from "@/types";
import _client from "../client";

const follow = async (user: User, handle: string) => {
  const client = _client(user);

  // Get target user Twitter id
  const targetUser = await client.users.findUserByUsername(
    handle.replace("@", "")
  );

  if (!targetUser.data) {
    throw new Error("Could not find target user.");
  }

  // Follow user
  const follow = await client.users.usersIdFollow(user.accounts.twitter!.id!, {
    target_user_id: targetUser.data.id,
  });

  return follow;
};

const users = { follow };
export default users;
