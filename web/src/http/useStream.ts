import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@/env";

type StreamAPIResponse = {
  message: string;
  playlistUrl: string;
};

type StreamAPIRequest = {
  sourceUrl: string;
  streamName: string;
  resolution: string;
  bitrate: string;
  codec: string;
  hwAccel: string;
  logoEnabled: boolean;
};

const useStream = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: StreamAPIRequest) => {
      const response = await fetch(`${env.BASE_URL_API}/api/streams/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result: StreamAPIResponse = await response.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stream"],
      });
    },
  });
};

export { useStream };
