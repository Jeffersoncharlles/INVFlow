import type { FfmpegProcessManager } from "../../infra/http/processes/ffmpeg-process-manager.ts";
import type { IStreamRepository } from "../repositories/IStream-repository.ts";

export class StopStreamUseCase {
  constructor(
    private streamRepo: IStreamRepository,
    private processManager: FfmpegProcessManager
  ) {}

  async execute(streamName: string): Promise<void> {
    const streamToStop = await this.streamRepo.findByName(streamName);
    if (!streamToStop) {
      throw new Error(`Stream '${streamName}' não encontrado.`);
    }

    const killed = this.processManager.kill(streamToStop.pid, streamName);
    // Se o processo não existia mais, removemos do DB imediatamente.
    if (!killed) {
      await this.streamRepo.deleteByName(streamName);
    }
  }
}
