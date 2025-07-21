import { useQuery } from "@tanstack/react-query";
import { env } from "@/env";

type StreamsAPIResponse = {
  sourceUrl: string;
  streamName: string;
  resolution: string;
  bitrate: string;
  codec: string;
  hwAccel: string;
  logoEnabled: boolean;
  pid: number;
  playlistUrl: string;
}[];

export const useStreams = () => {
  return useQuery({
    queryKey: ["streams"],
    queryFn: async () => {
      const response = await fetch(`${env.VITE_BASE_URL_API}/api/streams`);
      const result: StreamsAPIResponse = await response.json();
      return result;
    },
  });
};
