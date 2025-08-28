import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  BASE_URL: z.url(),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().trim().min(1),
});

export const env = envSchema.parse(process.env);
