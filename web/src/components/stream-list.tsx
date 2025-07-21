import { useStreams } from "@/http/useStreams";
import { StreamColumns } from "./tables/columns";
import { DataTable } from "./tables/data-table";
import { ScrollArea } from "./ui/scroll-area";

const StreamList = () => {
  const { data: streams } = useStreams();

  return (
    <ScrollArea className="h-screen">
      <DataTable columns={StreamColumns} data={streams || []} />
    </ScrollArea>
  );
};
export default StreamList;
