import { CircleIcon } from "lucide-react";

type BadgeStreamsProps = {
  stream: "h264" | "h265" | "h271";
};

const BadgeTransaction = ({ stream }: BadgeStreamsProps) => {
  return (
    <Badge className="border border-white bg-muted text-sm font-bold text-white hover:bg-muted">
      <CircleIcon className="mr-2 size-2 fill-white" />
      H264
    </Badge>
  );
};

export default BadgeTransaction;
