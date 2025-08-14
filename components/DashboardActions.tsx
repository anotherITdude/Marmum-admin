"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { EntryColumn } from "./columns";
import saveAs from "file-saver";
import ExcelJS from "exceljs";

interface DashboardActionsProps {
  entries: EntryColumn[];
}

const DashboardActions: React.FC<DashboardActionsProps> = ({ entries }) => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh the current page data
      router.refresh();

      // Add a small delay to show the loading state
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setIsRefreshing(false);
    }
  };

  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Campaign Entries");

      // Define your data and header row
      const excelData = entries.map((item) => [
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
        "Receipt URL",
      ];

      // Add the header row to the worksheet
      worksheet.addRow(headerRow);

      // Style the header row
      const headerRowRef = worksheet.getRow(1);
      headerRowRef.font = { bold: true };
      headerRowRef.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE6F3FF" },
      };

      // Add the data rows to the worksheet
      excelData.forEach((row) => worksheet.addRow(row));

      // Auto-size columns
      worksheet.columns.forEach((column) => {
        column.width = 15;
      });

      // Generate a buffer with the Excel file
      const buffer = await workbook.xlsx.writeBuffer();

      // Save the buffer as a file using file-saver
      const timestamp = new Date().toISOString().split("T")[0];
      saveAs(new Blob([buffer]), `Marmum_Campaign_Entries_${timestamp}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting data. Please try again.");
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={exportToExcel}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2"
      >
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
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>Export Data ({entries.length} entries)</span>
      </button>

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
      </button>
    </div>
  );
};

export default DashboardActions;
