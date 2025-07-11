import type { FastifyInstance } from "fastify";
import type { StreamController } from "../controllers/stream-controller.ts";

export async function streamRoutes(
  server: FastifyInstance,
  opts: { controller: StreamController }
) {
  const { controller } = opts;
  server.get("/api/streams", controller.list.bind(controller));
  server.post("/api/streams/start", controller.start.bind(controller));
  server.post("/api/streams/stop", controller.stop.bind(controller));
}
