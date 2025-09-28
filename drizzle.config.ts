import { defineConfig } from "drizzle-kit";

import {env} from "@/data/env/server";

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
});
