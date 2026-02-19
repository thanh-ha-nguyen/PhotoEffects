import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/persistence/schema.ts",
  out: "./src/persistence/drizzle",
  dialect: "sqlite",
  driver: "expo",
});
