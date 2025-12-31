import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  // experimental: { joins: true },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "users",
  },
  account: {
    modelName: "accounts",
  },
  session: {
    modelName: "sessions",
  },
  usePlural: true,
  plugins: [admin(), nextCookies()],
});
