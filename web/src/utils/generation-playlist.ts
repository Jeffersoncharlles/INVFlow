import type { TypeStream } from "@/http/types/streams";

const generationPlaylistM3U8 = (streams: TypeStream[]) => {
  return [
    "#EXTM3U",
    ...streams.map(
      (streamName, playlistUrl) => `#EXTINF:-1,${streamName}\n${playlistUrl}`
    ),
  ].join("\n");
};

export { generationPlaylistM3U8 };
