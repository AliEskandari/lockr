import admin from "@/modules/backend/admin";
import _debug from "@/modules/backend/debug";
import google from "@/modules/backend/google";
import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";
const debug = _debug.extend("google");

export const googleRouter = router({
  revoke: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId } = input;
      const user = await admin.User.findById(userId);
      await google.oauth.revoke(user);
      return { success: true };
    }),

  subscribe: publicProcedure
    .input(z.object({ userId: z.string(), targetId: z.string() }))
    .mutation(async ({ input }) => {
      const { userId, targetId } = input;
      const user = await admin.User.findById(userId);

      // get channel id...
      const { items: searchItems } = await google.youtube.search.list(
        user,
        targetId
      );

      if (!searchItems)
        throw Error(`Channel ${targetId} not found when searching youtube`);

      const { channelId } = searchItems[0].snippet!;

      // check if subscription already exists...
      const { items: subscriptionItems } =
        await google.youtube.subscriptions.list(user, channelId!);

      if (subscriptionItems?.length != 0) {
        debug("User already subscribed to channel...");
        return { success: true }; // sub already exists
      }

      // subscribe to channel...
      await google.youtube.subscriptions.insert(user, channelId!);

      return { success: true };
    }),

  like: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        videoId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, videoId } = input;
      const user = await admin.User.findById(userId);
      await google.youtube.videos.rate(user, videoId);
      return { success: true };
    }),
});
