import { z } from "zod";

declare module "bun" {
  interface Env {
    AWESOME: string;
    TELEGRAM_BOT_TOKEN: string;
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
  AWESOME: z.string().default("awesome"),
  TELEGRAM_BOT_TOKEN: z.string()
});

export const env = envSchema.parse(process.env);
