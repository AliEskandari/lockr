import { Provider } from "../Provider";
import Stripe from "stripe";

export interface ReloadableUser extends User {
  /**
   * Re-fetches user data from database.
   * @returns Promise<void>
   */
  reload: () => Promise<void>;
}

export type Account = {
  accessToken: string;
  refreshToken: string;
  name: string;
  picture: string;
  username?: string;
  id: string | null;
  expiresAt?: number;
  scope: string;
};

export type User = {
  accounts: {
    [provider in Provider.Key]: Account | null;
  };
  collections: string[];
  dateCreated: number;
  email: string;
  id: string;
  name: string;
  socialUnlocks: string[];
  stripe: {
    customer: {
      id: string;
    };
    invoices: {
      [index: string]: any;
    };
    subscription: {
      current_period_end: Stripe.Subscription["current_period_end"];
      current_period_start: Stripe.Subscription["current_period_start"];
      id: Stripe.Subscription["id"];
      status: Stripe.Subscription["status"];
    };
  };
  subscription: {
    expiresAt: number;
    status: Stripe.Subscription["status"];
  } | null;
  createdAt: number;
};
