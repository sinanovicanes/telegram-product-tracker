import { z } from "zod";

declare module "bun" {
  interface Env {
    TELEGRAM_BOT_TOKEN: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    DATABASE_PORT: number;
    DATABASE_URL: string;
  }
}

enum ENVIRONMENT {
  PRODUCTION = "production",
  DEVELOPMENT = "development"
}

const envSchema = z.object({
  NODE_ENV: z
    .enum([ENVIRONMENT.DEVELOPMENT, ENVIRONMENT.PRODUCTION])
    .default(ENVIRONMENT.DEVELOPMENT),
  TELEGRAM_BOT_TOKEN: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PORT: z.number({ coerce: true }),
  DATABASE_URL: z.string()
});

export const env = envSchema.parse(process.env);
