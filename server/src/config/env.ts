import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import z from "zod";
import { getLocalIp } from "./config.ts"; // ou o caminho correto para a função

const ROOT_DIR = process.cwd();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().default(3000),
  SERVER_IP: z.string().default(getLocalIp()),

  // Caminhos validados com defaults
  ROOT_DIR: z.string().default(ROOT_DIR),
  UPLOAD_DIR: z.string().default(path.join(ROOT_DIR, "uploads")),
  PROCESSED_DIR: z.string().default(path.join(ROOT_DIR, "processed")),
  STREAMS_DIR: z.string().default(path.join(ROOT_DIR, "streams")),
  FFMPEG_PATH: z.string().default(path.join(ROOT_DIR, "bin", "ffmpeg")),
  LOGO_PATH: z.string().default(path.join(ROOT_DIR, "public", "logo.png")),
  DB_PATH: z.string().default(path.join(ROOT_DIR, "streams.json")),
});

export const env = envSchema.parse(process.env);

// Garante que os diretórios existem
const foldersToEnsure = [
  env.UPLOAD_DIR,
  env.PROCESSED_DIR,
  env.STREAMS_DIR,
  path.dirname(env.DB_PATH),
];

for (const folder of foldersToEnsure) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`📁 Criada pasta: ${folder}`);
  }
}
