import { isBefore } from "date-fns";
import { User } from "@/types";

export function isPro(user: User) {
  if (!user?.subscription) return false; // no user or no subscription
  return isBefore(Date.now(), new Date(user.subscription.expiresAt * 1000));
}
