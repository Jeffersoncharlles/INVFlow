import staticPlugin from "@fastify/static";
import type { FastifyInstance } from "fastify";
import { env } from "../../../config/env.ts";

export async function registerFrontend(server: FastifyInstance) {
  server.register(staticPlugin, {
    root: env.FRONTEND_DIST_DIR,
    prefix: "/",
    wildcard: false,
  });

  server.register(staticPlugin, {
    root: env.FRONTEND_DIST_DIR_ASSETS,
    prefix: "/assets/",
    decorateReply: false, // This prevents the decorator conflict
  });

  server.setNotFoundHandler((_req, reply) => {
    reply.type("text/html").sendFile("index.html");
  });
}
