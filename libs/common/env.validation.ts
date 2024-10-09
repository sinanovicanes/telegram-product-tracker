import { z } from "zod";

declare module "bun" {
  interface Env {
    URL: string;
    PORT: number;
    WEBHOOK_SECRET: string;
    TELEGRAM_BOT_TOKEN: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    DATABASE_PORT: number;
    DATABASE_URL: string;
    SCRAPER_CONCURRENCY: number;
    MAX_SCRAPE_FAILURES: number;
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
  URL: z.string(),
  PORT: z.number({ coerce: true }).default(8080),
  WEBHOOK_SECRET: z.string(),
  TELEGRAM_BOT_TOKEN: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PORT: z.number({ coerce: true }),
  DATABASE_URL: z.string(),
  SCRAPER_CONCURRENCY: z.number({ coerce: true }).default(3),
  MAX_SCRAPE_FAILURES: z.number({ coerce: true }).default(10)
});

export const env = envSchema.parse(process.env);
