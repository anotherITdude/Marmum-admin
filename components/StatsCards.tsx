"use client";

import React from "react";
import { EntryColumn } from "./columns";

interface StatsCardsProps {
  totalEntries: EntryColumn[];
  englishEntries: EntryColumn[];
  arabicEntries: EntryColumn[];
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalEntries,
  englishEntries,
  arabicEntries,
}) => {
  // Calculate entry changes (today vs yesterday)
  const calculateDailyEntryChange = (
    entries: EntryColumn[],
    entryType: string = "entries",
  ) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const todayEntries = entries.filter((entry) => {
      try {
        if (!entry.createdAt) return false;
        const entryDate = new Date(entry.createdAt);
        const entryDateOnly = new Date(
          entryDate.getFullYear(),
          entryDate.getMonth(),
          entryDate.getDate(),
        );
        return entryDateOnly.getTime() === today.getTime();
      } catch {
        return false;
      }
    }).length;

    const yesterdayEntries = entries.filter((entry) => {
      try {
        if (!entry.createdAt) return false;
        const entryDate = new Date(entry.createdAt);
        const entryDateOnly = new Date(
          entryDate.getFullYear(),
          entryDate.getMonth(),
          entryDate.getDate(),
        );
        return entryDateOnly.getTime() === yesterday.getTime();
      } catch {
        return false;
      }
    }).length;

    const difference = todayEntries - yesterdayEntries;
    const sign = difference > 0 ? "+" : difference < 0 ? "" : "";

    if (difference === 0) {
      return `Same as yesterday`;
    }

    return `${sign}${Math.abs(difference)} ${entryType} since yesterday`;
  };

  const totalChange = calculateDailyEntryChange(totalEntries, "entries");
  const englishChange = calculateDailyEntryChange(
    englishEntries,
    "English entries",
  );
  const arabicChange = calculateDailyEntryChange(
    arabicEntries,
    "Arabic entries",
  );
  const todayChange = calculateDailyEntryChange(totalEntries, "entries");

  const stats = [
    {
      name: "Total Entries",
      value: totalEntries.length,
      change: totalChange,
      changeType: totalChange.startsWith("+")
        ? "increase"
        : totalChange.startsWith("-")
        ? "decrease"
        : "neutral",
      tooltip: "Today vs yesterday",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      name: "English Entries",
      value: englishEntries.length,
      change: englishChange,
      changeType: englishChange.startsWith("+")
        ? "increase"
        : englishChange.startsWith("-")
        ? "decrease"
        : "neutral",
      tooltip: "Today vs yesterday",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      ),
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      name: "Arabic Entries",
      value: arabicEntries.length,
      change: arabicChange,
      changeType: arabicChange.startsWith("+")
        ? "increase"
        : arabicChange.startsWith("-")
        ? "decrease"
        : "neutral",
      tooltip: "Today vs yesterday",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      ),
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      name: "Today's Entries",
      value: getTodayEntries(totalEntries),
      change: todayChange,
      changeType: todayChange.startsWith("+")
        ? "increase"
        : todayChange.startsWith("-")
        ? "decrease"
        : "neutral",
      tooltip: "Today vs yesterday",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
    },
  ];

  return (
    <div className="mb-8">
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden">
        <div className="flex space-x-4 overflow-x-auto pb-4 px-1">
          {stats.map((stat, index) => (
            <div
              key={stat.name}
              className={`flex-shrink-0 w-72 relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50`}
              title={stat.tooltip}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} text-white shadow-lg flex-shrink-0`}
                  >
                    {stat.icon}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={`text-xs font-medium px-3 py-2 rounded-lg inline-block ${
                      stat.changeType === "increase"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : stat.changeType === "decrease"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
              </div>

              {/* Animated counter */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50`}
            title={stat.tooltip}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} text-white shadow-lg flex-shrink-0`}
                >
                  {stat.icon}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>

                <div
                  className={`text-xs font-medium px-3 py-2 rounded-lg inline-block ${
                    stat.changeType === "increase"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : stat.changeType === "decrease"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </div>

            {/* Animated counter */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get today's entries
function getTodayEntries(entries: EntryColumn[]): number {
  const today = new Date().toDateString();
  return entries.filter((entry) => {
    try {
      if (!entry.createdAt) return false;
      const entryDate = new Date(entry.createdAt).toDateString();
      return entryDate === today;
    } catch {
      return false;
    }
  }).length;
}

export default StatsCards;
