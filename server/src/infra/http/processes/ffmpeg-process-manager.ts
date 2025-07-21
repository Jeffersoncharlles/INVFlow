import { type ChildProcess, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { env } from "../../../config/env.ts";
import type { StreamConfig } from "../../../core/entities/active-stream-entities.ts";

type ProgressData = {
  frame: number;
  fps: number;
  bitrate: string;
  time: string;
  speed: string;
};

export class FfmpegProcessManager {
  public activeProcesses = new Map<string, ChildProcess>();

  spawn(
    streamConfig: StreamConfig,
    onClose: (code: number | null) => void,
    onProgress?: (progress: ProgressData) => void
  ): { process: ChildProcess } {
    const { streamName } = streamConfig;
    const args = this.buildFfmpegArgs(streamConfig);

    console.log(
      `Iniciando FFmpeg para '${streamName}': ${env.FFMPEG_PATH} ${args.join(
        " "
      )}`
    );

    const ffmpegProcess = spawn(env.FFMPEG_PATH, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    this.activeProcesses.set(streamName, ffmpegProcess);

    ffmpegProcess.stderr.setEncoding("utf8");
    ffmpegProcess.stderr.on("data", (chunk) => {
      const lines = chunk.toString().split("\n");

      for (const line of lines) {
        const clean = line.trim();
        if (!clean) continue;

        console.log(`[FFMPEG STDERR - ${streamName}]: ${clean}`);

        // 🔍 Detectar linha de progresso (ex: "frame= 236 ...")
        if (clean.startsWith("frame=") && onProgress) {
          const match = clean.match(
            /frame=\s*(\d+)\s+fps=\s*([\d.]+)\s+.*?bitrate=\s*([\d.kbits/s]+)\s+.*?time=([\d:.]+)\s+.*?speed=\s*([\d.]+)x/
          );

          if (match) {
            const [, frame, fps, bitrate, time, speed] = match;
            onProgress({
              frame: parseInt(frame, 10),
              fps: parseFloat(fps),
              bitrate,
              time,
              speed,
            });
          }
        }
      }
    });

    ffmpegProcess.on("close", (code) => {
      this.activeProcesses.delete(streamName);
      console.log(`[FFMPEG CLOSED - ${streamName}] Código de saída: ${code}`);
      onClose(code);
    });

    ffmpegProcess.on("error", (err) => {
      console.error(`[FFMPEG ERRO - ${streamName}]:`, err);
    });

    return { process: ffmpegProcess };
  }

  kill(pid: number, streamName: string): boolean {
    try {
      process.kill(pid, "SIGTERM");
      console.log(
        `Sinal de parada enviado para o processo PID ${pid} do stream '${streamName}'.`
      );
      return true;
    } catch (_e) {
      console.warn(
        `Não foi possível parar o processo PID ${pid}. Pode já ter sido finalizado.`
      );
      return false;
    }
  }

  isProcessRunning(pid: number): boolean {
    try {
      // O sinal 0 não faz nada, mas lança um erro se o processo não existir.
      // É uma forma padrão no Node.js de checar a existência de um processo.
      process.kill(pid, 0);
      return true;
    } catch (_e) {
      // O erro (geralmente 'ESRCH') indica que o processo não foi encontrado.
      return false;
    }
  }

  private buildFfmpegArgs(streamConfig: StreamConfig): string[] {
    const {
      sourceUrl,
      streamName,
      resolution,
      bitrate,
      codec,
      hwAccel,
      logoEnabled,
    } = streamConfig;
    const outputDir = path.join(env.STREAMS_DIR, streamName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const scaleMap = {
      "1080p": "1920:1080",
      "720p": "-2:720",
      "480p": "-2:480",
      "360p": "-2:360",
    };
    const scaleFilter = scaleMap[resolution] || "-2:720";

    let codecArgs: string[] = [];
    switch (hwAccel) {
      case "nvidia":
        codecArgs =
          codec === "h265"
            ? ["-c:v", "hevc_nvenc", "-preset", "p5"]
            : ["-c:v", "h264_nvenc", "-preset", "p5"];
        break;
      case "intel":
        codecArgs =
          codec === "h265"
            ? ["-c:v", "hevc_qsv", "-preset", "medium"]
            : ["-c:v", "h264_qsv", "-preset", "medium"];
        break;
      default:
        codecArgs =
          codec === "h265"
            ? ["-c:v", "libx265", "-preset", "veryfast"]
            : ["-c:v", "libx264", "-preset", "veryfast"];
        break;
    }

    const baseArgs = ["-i", sourceUrl];
    const videoFilterArgs: string[] = [];
    const useLogo = logoEnabled && fs.existsSync(env.LOGO_PATH);

    if (useLogo) {
      baseArgs.push("-i", env.LOGO_PATH);
      videoFilterArgs.push(
        "-filter_complex",
        `[0:v]scale=${scaleFilter}[scaled];[scaled][1:v]overlay=10:10`
      );
    } else {
      videoFilterArgs.push("-vf", `scale=${scaleFilter}`);
      if (logoEnabled)
        console.warn(
          `Logo habilitada, mas '${env.LOGO_PATH}' não foi encontrado.`
        );
    }

    return [
      ...baseArgs,
      ...videoFilterArgs,
      ...codecArgs,
      "-b:v",
      bitrate || "2800k",
      "-maxrate",
      "4000k",
      "-bufsize",
      "5600k",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "copy",
      "-hls_time",
      "4",
      "-hls_list_size",
      "5",
      "-hls_flags",
      "delete_segments",
      "-hls_segment_filename",
      path.join(outputDir, "segment%03d.ts"),
      path.join(outputDir, "index.m3u8"),
    ];
  }
}
