"use client";

import { format } from "date-fns";
import { EntryColumn } from "@/components/columns";
import StatsCards from "@/components/StatsCards";
import EntryChart from "@/components/EntryChart";
import DataTable from "@/components/table";
import { CampaignEntry } from "@/lib/database.types";
import DashboardActions from "@/components/DashboardActions";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardSkeleton } from "@/components/SkeletonLoader";

export default function DashboardPage() {
  const {
    allEntries,
    latestEntries,
    englishEntries,
    arabicEntries,
    loading,
    error,
    retry,
  } = useDashboardData();

  // Format the latest 30 entries
  const formattedLatestEntries: EntryColumn[] = latestEntries
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

  // Format all entries
  const formattedTotalEntries: EntryColumn[] = allEntries
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

  const formattedEnglish = formattedTotalEntries.filter(
    (entry) => entry.lan === "en" || entry.lan === "english",
  );
  const formattedArabic = formattedTotalEntries.filter(
    (entry) => entry.lan === "ar" || entry.lan === "arabic",
  );

  // Show loading skeleton
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto text-center p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Dashboard
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
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Welcome back! Here&apos;s what&apos;s happening with your campaign
              today.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex-shrink-0">
            <DashboardActions entries={formattedTotalEntries} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards
        totalEntries={formattedTotalEntries}
        englishEntries={formattedEnglish}
        arabicEntries={formattedArabic}
      />

      {/* Chart Section */}
      <EntryChart entries={formattedTotalEntries} />

      {/* Latest Entries Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
              Latest Entries
            </h3>
            <p className="text-sm text-gray-600">
              Most recent 30 campaign entries
            </p>
          </div>

          {/* View All Link */}
          <a
            href="/entries"
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 w-full md:w-auto"
          >
            <span>View All Entries</span>
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>

        <div className="overflow-hidden">
          <DataTable
            allData={formattedTotalEntries}
            data={formattedLatestEntries}
          />
        </div>
      </div>
    </div>
  );
}
