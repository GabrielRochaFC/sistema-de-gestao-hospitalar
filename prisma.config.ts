import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  migrations: {
    seed: "tsx --env-file .env prisma/seed.ts",
  },
});
