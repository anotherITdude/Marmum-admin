"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";


export type EntryColumn = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  lan: string;
  emirate: string;
  eid: string;
  reciept: string;
  createdAt?: string
};

export const columns: ColumnDef<EntryColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "email",
    header: "email",
  },
  {
    accessorKey: "emirate",
    header: "Emirate",
  },
  {
    accessorKey: "eid",
    header: "EId",
  },
  {
    accessorKey: "lan",
    header: "Language",
  },
  {
    accessorKey: "createdAt",
    header: "Entry Date",
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "reciept",
    header: "Reciept",
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          <a target="_blank" href={row.getValue("reciept")}>
            <Image
              alt={row.getValue("name")}
              width={100}
              placeholder="blur"
              height={100}
              src={row.getValue("reciept")}
              className="max-h-20 w-auto m-auto"
            />
          </a>
        </div>
      );
    },
  },
];
