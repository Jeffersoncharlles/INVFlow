import { useQuery } from "@tanstack/react-query";

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
      const response = await fetch("http://localhost:3333/api/streams");
      const result: StreamsAPIResponse = await response.json();
      return result;
    },
  });
};
