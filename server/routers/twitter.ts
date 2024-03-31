import admin from "@/modules/backend/admin";
import twitter from "@/modules/backend/twitter";
import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const twitterRouter = router({
  revoke: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId } = input;
      const user = await admin.User.findById(userId);
      await twitter.oauth.revoke(user);
      return { success: true };
    }),
  follow: publicProcedure
    .input(z.object({ userId: z.string(), targetId: z.string() }))
    .mutation(async ({ input }) => {
      const { userId, targetId } = input;
      const user = await admin.User.findById(userId);
      await twitter.users.follow(user, targetId);
      return { success: true };
    }),
  retweet: publicProcedure
    .input(z.object({ userId: z.string(), targetId: z.string() }))
    .mutation(async ({ input }) => {
      const { userId, targetId } = input;
      const user = await admin.User.findById(userId);
      await twitter.tweets.retweet(user, targetId);
      return { success: true };
    }),
  like: publicProcedure
    .input(z.object({ userId: z.string(), targetId: z.string() }))
    .mutation(async ({ input }) => {
      const { userId, targetId } = input;
      const user = await admin.User.findById(userId);
      await twitter.tweets.like(user, targetId);
      return { success: true };
    }),
});
