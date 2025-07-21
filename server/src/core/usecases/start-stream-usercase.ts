import type { FfmpegProcessManager } from "../../infra/http/processes/ffmpeg-process-manager.ts";
import type {
  ActiveStream,
  StreamConfig,
} from "../entities/active-stream-entities.ts";
import type { IStreamRepository } from "../repositories/IStream-repository.ts";

type ProgressData = {
  frame: number;
  fps: number;
  bitrate: string;
  time: string;
  speed: string;
};

export class StartStreamUseCase {
  constructor(
    private streamRepo: IStreamRepository,
    private processManager: FfmpegProcessManager
  ) {}

  async execute(streamConfig: StreamConfig): Promise<ActiveStream> {
    const existingStream = await this.streamRepo.findByName(
      streamConfig.streamName
    );
    if (existingStream) {
      throw new Error(
        `O stream '${streamConfig.streamName}' já está em execução.`
      );
    }

    const process = this.processManager.spawn(
      streamConfig,
      (code) => {
        console.log(
          `Processo para '${streamConfig.streamName}' finalizado com código ${code}. Limpando do DB.`
        );
        this.streamRepo.deleteByName(streamConfig.streamName);
      },
      (progress) => {
        console.log("Progresso:", progress);
        // Enviar via WebSocket? Registrar no Redis? Emitir evento para dashboard?
      }
    );

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const newStream: ActiveStream = {
      ...streamConfig,
      pid: process.process.pid!,
    };
    await this.streamRepo.save(newStream);
    return {
      ...newStream,
    };
  }
}
