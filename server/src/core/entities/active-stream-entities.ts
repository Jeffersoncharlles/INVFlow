export interface StreamConfig {
  sourceUrl: string;
  streamName: string;
  resolution: "1080p" | "720p" | "480p" | "360p";
  bitrate: string;
  codec: "h264" | "h265";
  hwAccel: "cpu" | "nvidia" | "intel";
  logoEnabled: boolean;
}

export interface ActiveStream extends StreamConfig {
  pid: number;
}
