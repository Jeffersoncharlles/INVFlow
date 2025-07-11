export class GetConfigOptionsUseCase {
  async execute() {
    return {
      resolutions: ["1080p", "720p", "480p", "360p"],
      bitrates: ["5000k", "4000k", "2800k", "1500k", "800k"],
      codecs: ["h264", "h265"],
      hwAccels: ["cpu", "nvidia", "intel"],
    };
  }
}
