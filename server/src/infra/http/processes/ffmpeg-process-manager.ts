import { type ChildProcess, spawn } from "node:child_process";

import fs from "node:fs";
import path from "node:path";
import { env } from "../../../config/env.ts";
import type { StreamConfig } from "../../../core/entities/active-stream-entities.ts";

export class FfmpegProcessManager {
  public activeProcesses = new Map<string, ChildProcess>();

  spawn(
    streamConfig: StreamConfig,
    onClose: (code: number | null) => void
  ): ChildProcess {
    const { streamName } = streamConfig;
    const args = this.buildFfmpegArgs(streamConfig);

    console.log(
      `Iniciando FFmpeg para '${streamName}': ${env.FFMPEG_PATH} ${args.join(
        " "
      )}`
    );

    const ffmpegProcess = spawn(env.FFMPEG_PATH, args);
    this.activeProcesses.set(streamName, ffmpegProcess);

    ffmpegProcess.stderr.on("data", (data) =>
      console.log(`[FFMPEG - ${streamName}]: ${data.toString()}`)
    );

    ffmpegProcess.on("close", (code) => {
      this.activeProcesses.delete(streamName);
      onClose(code);
    });

    return ffmpegProcess;
  }

  kill(pid: number, streamName: string): boolean {
    try {
      // Tenta matar o processo pelo PID
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

  private buildFfmpegArgs(streamConfig: StreamConfig): string[] {
    // ... Lógica do buildFfmpegArgs exatamente como na versão anterior
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
