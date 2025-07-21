import z from "zod";

const envSchema = z.object({
  MODE: z.enum(["development", "test", "production"]),
  VITE_APP_TITLE: z.string().min(1),
  VITE_BASE_URL_API: z.string(),
});

export const env = envSchema.parse(import.meta.env);
