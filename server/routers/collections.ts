import { FieldValue } from "firebase-admin/firestore";
import admin from "@/modules/backend/admin";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const collectionsRouter = router({
  incrementViews: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      await admin.Collection.update(id, { views: FieldValue.increment(1) });
      return await admin.SocialUnlock.findById(id);
    }),
});
