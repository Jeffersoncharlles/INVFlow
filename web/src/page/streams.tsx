import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import StreamList from "@/components/stream-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStream } from "@/http/useStream";

const createStreamsSchema = z.object({
  sourceUrl: z.string(),
  streamName: z.string(),
  resolution: z.literal(["1080p", "720p", "480p", "360p"]),
  bitrate: z.string(),
  codec: z.literal(["h264", "h265"]),
  hwAccel: z.string(),
  logoEnabled: z.boolean(),
});

//       bitrates: ["5000k", "4000k", "2800k", "1500k", "800k"],
//       hwAccels: ["cpu", "nvidia", "intel"],

type CreateStreamFormData = z.infer<typeof createStreamsSchema>;

const Streams = () => {
  const { mutateAsync: createStreams } = useStream();

  const createStreamForm = useForm<CreateStreamFormData>({
    resolver: zodResolver(createStreamsSchema),
    defaultValues: {
      streamName: "",
      sourceUrl: "",
      resolution: "720p",
      bitrate: "",
      codec: "h264",
      hwAccel: "",
      logoEnabled: false,
    },
  });

  const handleCreateStreamsSubmit = async (data: CreateStreamFormData) => {
    await createStreams(data);
  };

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-2">
          {[...new Array(4)].map((_i, idx) => (
            <div
              key={`first-array-de_io-2${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                idx
              }`}
              className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
        <div className="flex flex-1 gap-2">
          <Card className="h-full w-full bg-neutral-900">
            <CardHeader>
              <CardTitle>Add Streams</CardTitle>
              <CardDescription>your add streams here</CardDescription>
              <CardContent>
                <Form {...createStreamForm}>
                  <form
                    onSubmit={createStreamForm.handleSubmit(
                      handleCreateStreamsSubmit
                    )}
                  >
                    <FormField
                      control={createStreamForm.control}
                      name="sourceUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Url Stream</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createStreamForm.control}
                      name="streamName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Stream</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createStreamForm.control}
                      name="bitrate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bitrate</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 mt-2 mb-2">
                      <FormField
                        control={createStreamForm.control}
                        name="codec"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Codecs</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="codec" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="h264">h264</SelectItem>
                                  <SelectItem value="h265">h265</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createStreamForm.control}
                        name="resolution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Codecs</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Resolution" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1080p">1080p</SelectItem>
                                  <SelectItem value="720p">720p</SelectItem>
                                  <SelectItem value="480p">480p</SelectItem>
                                  <SelectItem value="360p">360p</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit">Criar Stream</Button>
                  </form>
                </Form>
                {/* <div
                  key={`second-array-d_imo-2`}
                  className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-700"
                ></div> */}
              </CardContent>
            </CardHeader>
          </Card>
          <Card className="h-full w-full bg-neutral-900">
            <CardHeader>
              <CardTitle>Stream list</CardTitle>
              <CardDescription>your here list streams your add</CardDescription>
              <CardContent>
                <StreamList />
              </CardContent>
            </CardHeader>
          </Card>
          {/* {[...new Array(2)].map((_i, idx) => (
            <div
              key={`second-array-d_imo-2${idx}`}
              className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))} */}
        </div>
      </div>
    </div>
  );
};
export default Streams;
