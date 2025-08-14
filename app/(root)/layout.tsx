import Navbar from "@/components/navbar";
import { getSupabaseAdmin } from "@/lib/supabase";
import React from "react";
import { format } from "date-fns";
import { EntryColumn } from "@/components/columns";
import CardShow from "@/components/cardShow";
import DataTable from "@/components/table";
import { CampaignEntry } from "@/lib/database.types";

const Dashboard = async () => {
  // Fetch all entries from Supabase
  const supabaseAdmin = getSupabaseAdmin();
  const { data: allEntries, error: allEntriesError } = await supabaseAdmin
    .from("campaign_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (allEntriesError) {
    console.error("Error fetching entries:", allEntriesError);
    return <div>Error loading entries</div>;
  }

  const totalEntries = allEntries || [];

  // Get latest 30 entries
  const latestEntries = totalEntries.slice(0, 30);

  // Format the latest 30 entries
  const formattedLatestEntries: EntryColumn[] = latestEntries.map(
    (item: CampaignEntry) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      mobile: item.mobile,
      emirate: item.emirate,
      eid: item.eid,
      receipt: item.receipt,
      lan: item.lan,
      createdAt: format(new Date(item.created_at), "MMMM dd yyyy"),
    }),
  );

  // Format all entries (for the cards)
  const formattedTotalEntries: EntryColumn[] = totalEntries.map(
    (item: CampaignEntry) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      mobile: item.mobile,
      emirate: item.emirate,
      eid: item.eid,
      receipt: item.receipt,
      lan: item.lan,
      createdAt: format(new Date(item.created_at), "MMMM do yyyy"),
    }),
  );

  const formattedEnglish = formattedTotalEntries.reduce((acc, entry) => {
    if (entry.lan === "en") {
      acc.push(entry);
    }
    return acc;
  }, [] as EntryColumn[]);

  const formattedArabic = formattedTotalEntries.reduce((acc, entry) => {
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
            <CardShow title="Total Entries" entries={formattedTotalEntries} />
            <CardShow title="En Entries" entries={formattedEnglish} />
            <CardShow title="Ar Entries" entries={formattedArabic} />
          </div>
          {/* card */}
          {/* data table */}
          <div className="mt-4">
            <div className="text-center text-bold mt-14 mb-4">
              Showing Latest 30 entries
            </div>

            <DataTable
              allData={formattedTotalEntries}
              data={formattedLatestEntries}
            />
          </div>
          {/* data table */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
