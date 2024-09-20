import { z } from "zod";

declare module "bun" {
  interface Env {
<<<<<<< HEAD
<<<<<<< HEAD
    TELEGRAM_BOT_TOKEN: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    DATABASE_PORT: number;
    DATABASE_URL: string;
=======
    AWESOME: string;
    TELEGRAM_BOT_TOKEN: string;
>>>>>>> f22edf2 (Initial commit)
=======
    TELEGRAM_BOT_TOKEN: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    DATABASE_PORT: number;
    DATABASE_URL: string;
>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)
  TELEGRAM_BOT_TOKEN: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PORT: z.number({ coerce: true }),
  DATABASE_URL: z.string()
<<<<<<< HEAD
=======
  AWESOME: z.string().default("awesome"),
  TELEGRAM_BOT_TOKEN: z.string()
>>>>>>> f22edf2 (Initial commit)
=======
>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)
});

export const env = envSchema.parse(process.env);
