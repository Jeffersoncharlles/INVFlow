import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetConfigOptionsUseCase } from "../../../core/usecases/get-config-usecase.ts";

export class ConfigController {
  constructor(private getConfigOptionsUseCase: GetConfigOptionsUseCase) {}

  async getOptions(_req: FastifyRequest, reply: FastifyReply) {
    const options = await this.getConfigOptionsUseCase.execute();
    reply.send(options);
  }
}
