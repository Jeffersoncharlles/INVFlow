import type { FfmpegProcessManager } from "../../infra/http/processes/ffmpeg-process-manager.ts";
import type { IStreamRepository } from "../repositories/IStream-repository.ts";

export class RestartStreamsUseCase {
  constructor(
    private streamRepo: IStreamRepository,
    private processManager: FfmpegProcessManager
  ) {}

  async execute(): Promise<void> {
    console.log("🔄 Verificando streams para reiniciar...");
    const streamsToRestart = await this.streamRepo.findAll();

    if (streamsToRestart.length === 0) {
      console.log("✅ Nenhum stream para reiniciar.");
      return;
    }

    for (const stream of streamsToRestart) {
      const isRunning = this.processManager.isProcessRunning(stream.pid);

      if (isRunning) {
        console.log(
          `✅ Stream '${stream.streamName}' (PID: ${stream.pid}) já está em execução.`
        );
        continue;
      }

      console.log(`🔄 Reiniciando stream '${stream.streamName}'...`);
      try {
        const process = this.processManager.spawn(
          stream, // O objeto 'stream' do DB tem toda a configuração necessária
          (code) => {
            console.log(
              `Processo reiniciado para '${stream.streamName}' finalizado com código ${code}. Limpando do DB.`
            );
            this.streamRepo.deleteByName(stream.streamName);
          }
        );

        const updatedStream = { ...stream, pid: process.process.pid! };
        await this.streamRepo.save(updatedStream);
        console.log(
          `✅ Stream '${updatedStream.streamName}' reiniciado com sucesso com novo PID: ${updatedStream.pid}.`
        );
      } catch (error) {
        console.error(
          `❌ Falha ao reiniciar o stream '${stream.streamName}':`,
          error
        );
      }
    }
  }
}
