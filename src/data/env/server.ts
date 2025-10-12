import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  createFinalSchema: (env) => {
    return z.object(env).transform((values) => {
      const {
        DB_HOST,
        DB_PORT,
        DB_USER,
        DB_PASSWORD,
        DB_NAME,
        GEMINI_FLASH_API_PARTIAL,
        GEMINI_FLASH_API_KEY,
        ...rest
      } = values;

      return {
        ...rest,
        DATABASE_URL: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
        GEMINI_FLASH_API: `${GEMINI_FLASH_API_PARTIAL}?key=${GEMINI_FLASH_API_KEY}`,
        GEMINI_FLASH_API_KEY,
      };
    });
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
  server: {
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    DB_HOST: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_PORT: z.string().min(1),
    DB_USER: z.string().min(1),
    GEMINI_FLASH_API_KEY: z.string().min(1),
    GEMINI_FLASH_API_PARTIAL: z.string().min(1),
    PDF_CO_API: z.string().min(1),
    PDF_CO_API_KEY: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
  },
});
