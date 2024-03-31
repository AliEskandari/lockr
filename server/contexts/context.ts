import { type inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { initializeAdmin } from "@/modules/backend/firebase-admin";

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  await initializeAdmin();
  return { req, res };
};

export type Context = inferAsyncReturnType<typeof createContext>;
