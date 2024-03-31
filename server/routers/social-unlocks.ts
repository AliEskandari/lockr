import admin from "@/modules/backend/admin";
import constants from "@/modules/constants";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const socialUnlocksRouter = router({
  incrementViews: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      await admin.SocialUnlock.update(id, { views: FieldValue.increment(1) });
      return await admin.SocialUnlock.findById(id);
    }),

  incrementUnlocks: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      await admin.SocialUnlock.update(id, { unlocks: FieldValue.increment(1) });
      return await admin.SocialUnlock.findById(id);
    }),

  recommendations: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      const socialUnlock = await admin.SocialUnlock.findById(id);

      if (!socialUnlock)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Social unlock not found",
        });

      if (!socialUnlock.user) return [];

      const socialUnlocks = await admin.SocialUnlock.find({
        "user.id": socialUnlock.user.id,
        status: constants.SocialUnlock.Status.ACTIVE,
      });

      return socialUnlocks;
    }),
});
