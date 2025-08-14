"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { EntryColumn } from "./columns";

interface EntryChartProps {
  entries: EntryColumn[];
}

const EntryChart: React.FC<EntryChartProps> = ({ entries }) => {
  // Process data from August 10 to September 30, 2025
  const chartData = React.useMemo(() => {
    const chartDays = [];
    const startDate = new Date(2025, 7, 10); // August 10, 2025 (month is 0-indexed)
    const endDate = new Date(2025, 8, 30); // September 30, 2025

    // Calculate days from August 10 to September 30, 2025
    const daysDiff =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;

    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const monthDay = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Count entries for this day
      const dayEntries = entries.filter((entry) => {
        try {
          if (!entry.createdAt) return false;
          const entryDate = new Date(entry.createdAt);
          return entryDate.toISOString().split("T")[0] === dateStr;
        } catch {
          return false;
        }
      });

      // Count by language (check both possible values)
      const englishCount = dayEntries.filter(
        (e) => e.lan === "en" || e.lan === "english",
      ).length;
      const arabicCount = dayEntries.filter(
        (e) => e.lan === "ar" || e.lan === "arabic",
      ).length;

      chartDays.push({
        date: dateStr,
        day: dayName,
        displayDate: monthDay,
        total: dayEntries.length,
        english: englishCount,
        arabic: arabicCount,
      });
    }

    return chartDays;
  }, [entries]);

  // Calculate max value for Y-axis with some padding
  const maxValue = React.useMemo(() => {
    const maxEntries = Math.max(...chartData.map((day) => day.total));
    return Math.ceil(maxEntries * 1.2); // Add 20% padding above max value
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{data.displayDate}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Total: <span className="font-semibold">{data.total}</span>
            </p>
            <p className="text-sm text-emerald-600">
              <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
              English: <span className="font-semibold">{data.english}</span>
            </p>
            <p className="text-sm text-purple-600">
              <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              Arabic: <span className="font-semibold">{data.arabic}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Entry Trends</h3>
          <p className="text-sm text-gray-600">
            Daily entries from August 10 to September 30, 2025
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-gray-600">English</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Arabic</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        {/* @ts-ignore */}
        <ResponsiveContainer width="100%" height="100%">
          {/* @ts-ignore */}
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="englishGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="arabicGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            {/* @ts-ignore */}
            <XAxis
              dataKey="displayDate"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            {/* @ts-ignore */}
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, maxValue]}
            />
            {/* @ts-ignore */}
            <Tooltip content={CustomTooltip} />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#totalGradient)"
            />
            <Area
              type="monotone"
              dataKey="english"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#englishGradient)"
            />
            <Area
              type="monotone"
              dataKey="arabic"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#arabicGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {chartData.reduce((sum, day) => sum + day.total, 0)}
          </p>
          <p className="text-sm text-gray-600">Total (Aug 10 - Sep 30)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {(() => {
              const totalEntries = chartData.reduce(
                (sum, day) => sum + day.total,
                0,
              );
              const daysWithEntries = chartData.filter(
                (day) => day.total > 0,
              ).length;
              return daysWithEntries > 0
                ? Math.round(totalEntries / daysWithEntries)
                : 0;
            })()}
          </p>
          <p className="text-sm text-gray-600">Avg per day</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {Math.max(...chartData.map((day) => day.total))}
          </p>
          <p className="text-sm text-gray-600">Peak day</p>
        </div>
      </div>
    </div>
  );
};

export default EntryChart;
