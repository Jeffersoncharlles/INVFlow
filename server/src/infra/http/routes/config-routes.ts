import type { FastifyInstance } from "fastify";
import type { ConfigController } from "../controllers/config-controller.ts";

export async function configRoutes(
  server: FastifyInstance,
  opts: { controller: ConfigController }
) {
  const { controller } = opts;
  server.get("/api/config/options", controller.getOptions.bind(controller));
}
