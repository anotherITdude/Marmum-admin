"use client";
import React from "react";
import { columns, EntryColumn } from "./columns";
import { DataTable } from "./ui/datatable";
import { Button } from "@/components/ui/button";
import saveAs from "file-saver";
import ExcelJS from "exceljs";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface TableProps {
  data: EntryColumn[];
  allData: EntryColumn[];
}

const Table: React.FC<TableProps> = ({ data, allData }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BTS");

    // Define your data and header row
    const excelData = allData.map((item) => [
      item.name,
      item.mobile,
      item.email,
      item.emirate,
      item.eid,
      item.createdAt,
      item.lan,
      item.reciept,
    ]);
    const headerRow = [
      "Name",
      "Mobile",
      "Email",
      "Emirate",
      "EId",
      "Entry Date",
      "Language",
      "Image",
    ];

    // Add the header row to the worksheet
    worksheet.addRow(headerRow);

    // Add the data rows to the worksheet
    excelData.forEach((row) => worksheet.addRow(row));

    // Generate a buffer with the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Save the buffer as a file using file-saver
      saveAs(new Blob([buffer]), `Marmum_BTS_export.xlsx`);
    });
  };

  return (
    <div>
      <div className="flex justify-end  mb-4">
        <Button variant="default" size="sm" onClick={exportToExcel}>
          {`Export to Excel (${allData?.length || 0} entries)`}
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
      {/* <div className="flex items-center justify-end space-x-2 py-4">
       

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div> */}
    </div>
  );
};

export default Table;
