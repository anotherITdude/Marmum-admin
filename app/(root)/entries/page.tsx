"use client";

import { format } from "date-fns";
import { EntryColumn } from "@/components/columns";
import DataTable from "@/components/table";
import { CampaignEntry } from "@/lib/database.types";
import { useEntriesData } from "@/hooks/useEntriesData";
import { EntriesPageSkeleton } from "@/components/SkeletonLoader";

const AllEntriesPage = () => {
  const { allEntries, loading, error, retry } = useEntriesData();

  // Format all entries
  const formattedEntries: EntryColumn[] = allEntries
    .map((item: CampaignEntry) => {
      try {
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          mobile: item.mobile,
          emirate: item.emirate,
          eid: item.eid,
          receipt: item.receipt,
          lan: item.lan,
          createdAt: format(new Date(item.created_at), "MMMM dd yyyy"),
        };
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean) as EntryColumn[];

  // Show loading skeleton
  if (loading) {
    return <EntriesPageSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto text-center p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Entries
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={retry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              All Entries
            </h1>
            <p className="text-gray-600">
              Complete list of all campaign entries ({formattedEntries.length}{" "}
              total)
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">
                {formattedEntries.length}
              </p>
              <p className="text-sm text-blue-700">Total Entries</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 text-center border border-emerald-200">
              <p className="text-2xl font-bold text-emerald-600">
                {formattedEntries.filter((e) => e.lan === "en").length}
              </p>
              <p className="text-sm text-emerald-700">English</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
              <p className="text-2xl font-bold text-purple-600">
                {formattedEntries.filter((e) => e.lan === "ar").length}
              </p>
              <p className="text-sm text-purple-700">Arabic</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Entry Details
          </h2>
          <p className="text-sm text-gray-600">
            View, sort, and export all campaign entries
          </p>
        </div>

        <DataTable allData={formattedEntries} data={formattedEntries} />
      </div>
    </div>
  );
};

export default AllEntriesPage;
