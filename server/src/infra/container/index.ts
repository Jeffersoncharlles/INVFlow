import { GetAllStreamsUseCase } from "../../core/usecases/get-all-stream-usecase.ts";
import { GetConfigOptionsUseCase } from "../../core/usecases/get-config-usecase.ts";
import { RestartStreamsUseCase } from "../../core/usecases/restart-streams-usecase.ts";
import { StartStreamUseCase } from "../../core/usecases/start-stream-usercase.ts";
import { StopStreamUseCase } from "../../core/usecases/stop-stream-usecase.ts";
import { ConfigController } from "../http/controllers/config-controller.ts";
import { StreamController } from "../http/controllers/stream-controller.ts";
import { FfmpegProcessManager } from "../http/processes/ffmpeg-process-manager.ts";
import { JsonStreamRepository } from "../http/repositories/json-stream-repository.ts";

// Infrastructure
const streamRepository = new JsonStreamRepository();
const ffmpegProcessManager = new FfmpegProcessManager();

// Use Cases
const getConfigOptionsUseCase = new GetConfigOptionsUseCase();
const getAllStreamsUseCase = new GetAllStreamsUseCase(streamRepository);
const startStreamUseCase = new StartStreamUseCase(
  streamRepository,
  ffmpegProcessManager
);
const stopStreamUseCase = new StopStreamUseCase(
  streamRepository,
  ffmpegProcessManager
);

export const restartStreamsUseCase = new RestartStreamsUseCase(
  streamRepository,
  ffmpegProcessManager
);

// Controllers
export const configController = new ConfigController(getConfigOptionsUseCase);
export const streamController = new StreamController(
  getAllStreamsUseCase,
  startStreamUseCase,
  stopStreamUseCase
);
