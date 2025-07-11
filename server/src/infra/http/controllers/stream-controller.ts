import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../../../config/env.ts";
import type { StreamConfig } from "../../../core/entities/active-stream-entities.ts";
import type { GetAllStreamsUseCase } from "../../../core/usecases/get-all-stream-usecase.ts";
import type { StartStreamUseCase } from "../../../core/usecases/start-stream-usercase.ts";
import type { StopStreamUseCase } from "../../../core/usecases/stop-stream-usecase.ts";

export class StreamController {
  constructor(
    private getAllStreamsUseCase: GetAllStreamsUseCase,
    private startStreamUseCase: StartStreamUseCase,
    private stopStreamUseCase: StopStreamUseCase
  ) {}

  async list(_req: FastifyRequest, reply: FastifyReply) {
    const streams = await this.getAllStreamsUseCase.execute();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const response = streams.map((s: any) => ({
      ...s,
      playlistUrl: `http://${env.SERVER_IP}:${env.PORT}/live/${s.streamName}/index.m3u8`,
    }));
    reply.send(response);
  }

  async start(
    req: FastifyRequest<{ Body: StreamConfig }>,
    reply: FastifyReply
  ) {
    try {
      const newStream = await this.startStreamUseCase.execute(req.body);
      reply.code(201).send({
        message: `Stream '${newStream.streamName}' iniciado com sucesso.`,
        playlistUrl: `http://${env.SERVER_IP}:${env.PORT}/live/${newStream.streamName}/index.m3u8`,
      });
    } catch (error: any) {
      reply.code(409).send({ message: error.message });
    }
  }

  async stop(
    req: FastifyRequest<{ Body: { streamName: string } }>,
    reply: FastifyReply
  ) {
    try {
      await this.stopStreamUseCase.execute(req.body.streamName);
      reply.send({
        message: `Stream '${req.body.streamName}' está sendo finalizado.`,
      });
    } catch (error: any) {
      reply.code(404).send({ message: error.message });
    }
  }
}
