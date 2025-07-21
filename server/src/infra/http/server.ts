import cors from "@fastify/cors";
import staticPlugin from "@fastify/static";
import fastify from "fastify";
import { env } from "../../config/env.ts";

import { configController, streamController } from "../container/index.ts";
// import { registerFrontend } from "./frontend/register-frontend.ts";
import { configRoutes } from "./routes/config-routes.ts";
import { streamRoutes } from "./routes/stream-routes.ts";

export function createServer() {
  const server = fastify({ logger: true });

  server.register(cors);
  server.register(staticPlugin, { root: env.STREAMS_DIR, prefix: "/live/" });
  // 2. Função para reiniciar os streams existentes

  // Registra as rotas passando os controllers instanciados
  server.register(configRoutes, { controller: configController });
  server.register(streamRoutes, { controller: streamController });

  server.get("/helpers", async () => ({
    message: "API de Streaming FFmpeg está online",
  }));

  // registerFrontend(server);

  return server;
}
