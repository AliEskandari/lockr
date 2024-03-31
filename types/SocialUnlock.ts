import type { ActionError, Action } from "./Action";
import { User } from "./App/User";
import { EntityManager } from "./EntityManager";
import SocialUnlock from "@/modules/constants/SocialUnlock";

type SocialUnlockStatus =
  (typeof SocialUnlock.Status)[keyof typeof SocialUnlock.Status];

type SocialUnlock = {
  id: string;
  actions: EntityManager<Action>;
  title: string;
  destinationURL: string;
  status: SocialUnlockStatus;
  isValid: boolean;
  unlocks: number;
  views: number;

  /**
   * The user who created the social unlock. This is null if the social unlock
   * was created without an account.
   */
  user: { id: string; subscription: User["subscription"] } | null;

  errors: {
    title?: ActionError[];
    destinationURL?: ActionError[];
    actions?: {
      [index: number]: ActionError[];
    };
  } | null;
  deletedAt: string | null;
  createdAt: string | null;
};
export type { SocialUnlock, SocialUnlockStatus };
