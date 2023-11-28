import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import React from "react";
import { format } from "date-fns";
import { EntryColumn } from "@/components/columns";
import CardShow from "@/components/cardShow";
import DataTable from "@/components/table";

const Dashboard = async () => {
  const entries = await prismadb.iphone.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  const formattedEntries: EntryColumn[] = entries.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    mobile: item.mobile,
    emirate: item.emirate,
    eid: item.eid,
    reciept: item.receipt,
    lan: item.lan,
    createdAt: format(item.createdAt, "MMMM do yyyy"),
  }));

  const formattedEnglish = formattedEntries.reduce((acc, entry) => {
    if (entry.lan === "en") {
      acc.push(entry);
    }
    return acc;
  }, [] as EntryColumn[]);

  const formattedArabic = formattedEntries.reduce((acc, entry) => {
    if (entry.lan === "ar") {
      acc.push(entry);
    }
    return acc;
  }, [] as EntryColumn[]);

  return (
    <div>
      <Navbar />
      <div className="flex">
        <div className="left w-40 border-r h-[100vh] p-4">BTS Dashboard</div>
        <div className="right flex-1 h-[100vh] p-4">
          {/* card */}
          <div className="flex justify-start">
            <CardShow title="Total Entries" entries={formattedEntries} />
            <CardShow title="En Entries" entries={formattedEnglish} />
            <CardShow title="Ar Entries" entries={formattedArabic} />
          </div>
          {/* card */}
          {/* data table */}
          <div className="mt-4">
            <DataTable data={formattedEntries} />
          </div>
          {/* data table */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
