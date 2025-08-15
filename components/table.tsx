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
      item.receipt,
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>{data.length} entries displayed</span>
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={exportToExcel}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="hidden sm:inline">
            Export to Excel ({allData?.length || 0} entries)
          </span>
          <span className="sm:hidden">Export ({allData?.length || 0})</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Table;
