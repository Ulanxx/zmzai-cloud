import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3013"),
  MONGODB_URI: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  SESSION_COOKIE_NAME: z.string().regex(/^[a-zA-Z0-9_-]+$/).default("muzhi_session"),
  SESSION_COOKIE_DOMAIN: z.string().trim().min(1).optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;
let cachedEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  cachedEnv ??= envSchema.parse(process.env);
  return cachedEnv;
}

export function requireAuthSecret(): string {
  return getServerEnv().AUTH_SECRET;
}
