/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { z } from "zod";

/*eslint sort-keys: "error"*/
const envSchema = z.object({
  NEXT_PUBLIC__GCP_PROJECT_ID: z.string(),
  NEXT_PUBLIC__FIREBASE__API_KEY: z.string(),
  FIREBASE_ADMIN__PRIVATE_KEY: z.string(),
  FIREBASE_ADMIN__CLIENT_EMAIL: z.string(),
  GOOGLE__CLIENT_ID: z.string(),
  GOOGLE__CLIENT_SECRET: z.string(),
  GOOGLE__SCOPES: z.string(),
  GOOGLE_ANALYTICS__PROPERTY_ID: z.string(),
  NEXTAUTH_SECRET: z.string(),
  TWITTER__CLIENT_ID: z.string(),
  TWITTER__CLIENT_SECRET: z.string(),
  TWITTER__SCOPES: z.string(),
  STRIPE__API_KEY: z.string(),
  STRIPE__ENDPOINT_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(env.error.format(), null, 4)
  );
  process.exit(1);
}

const data = env.data;

export { data as env };
