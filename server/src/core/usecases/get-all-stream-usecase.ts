import type { ActiveStream } from "../entities/active-stream-entities.ts";
import type { IStreamRepository } from "../repositories/IStream-repository.ts";

export class GetAllStreamsUseCase {
  constructor(private streamRepo: IStreamRepository) {}
  async execute(): Promise<ActiveStream[]> {
    return this.streamRepo.findAll();
  }
}
