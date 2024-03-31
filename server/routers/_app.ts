import { router } from "../trpc";
import { analyticsRouter } from "./analytics";
import { collectionsRouter } from "./collections";
import { socialUnlocksRouter } from "./social-unlocks";
import { googleRouter } from "./google";
import { twitterRouter } from "./twitter";
import { stripeRouter } from "./stripe";

export const appRouter = router({
  socialUnlock: socialUnlocksRouter,
  collection: collectionsRouter,
  analytics: analyticsRouter,
  google: googleRouter,
  twitter: twitterRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
