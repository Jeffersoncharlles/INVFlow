"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TypeStream } from "@/http/types/streams";

export const StreamColumns: ColumnDef<TypeStream>[] = [
  {
    accessorKey: "streamName",
    header: "Nome",
    cell: ({ row: { original: Stream } }) => <p>{Stream.streamName}</p>,
  },
  {
    accessorKey: "codec",
    header: "Tipo",
    cell: ({ row: { original: Stream } }) => <p>{Stream.codec}</p>,
  },
  {
    accessorKey: "bitrate",
    header: "Bitrate",
    cell: ({ row: { original: Stream } }) => <p>{Stream.bitrate}bps</p>,
  },
  {
    accessorKey: "playlistUrl",
    header: "URL",
    cell: ({ row: { original: Stream } }) => (
      <div className="space-x-1">
        <p>{Stream.playlistUrl}</p>
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row: { original: Stream } }) => (
      <div className="space-x-1">
        <p>actions start </p>
        <p>actions stop </p>
      </div>
    ),
  },
];
