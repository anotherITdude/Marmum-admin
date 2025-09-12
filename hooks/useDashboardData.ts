"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CampaignEntry } from "@/lib/database.types";

interface DashboardData {
  allEntries: CampaignEntry[];
  latestEntries: CampaignEntry[];
  englishEntries: CampaignEntry[];
  arabicEntries: CampaignEntry[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    allEntries: [],
    latestEntries: [],
    englishEntries: [],
    arabicEntries: [],
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      // Fetch all entries with pagination
      let allEntries: CampaignEntry[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data: batchData, error } = await supabase
          .from("campaign_entries")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, from + batchSize - 1);

        if (error) {
          throw error;
        }

        if (batchData && batchData.length > 0) {
          allEntries = allEntries.concat(batchData);
          from += batchSize;

          if (batchData.length < batchSize) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      // Process the data
      const latestEntries = allEntries.slice(0, 30);
      const englishEntries = allEntries.filter(
        (entry) => entry.lan === "en" || entry.lan === "english",
      );
      const arabicEntries = allEntries.filter(
        (entry) => entry.lan === "ar" || entry.lan === "arabic",
      );

      setData({
        allEntries,
        latestEntries,
        englishEntries,
        arabicEntries,
        loading: false,
        error: null,
      });

      console.log(`Successfully fetched ${allEntries.length} total entries`);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error.message === "Connection closed."
            ? "Database connection lost. Please check your internet connection and try again."
            : "Failed to load dashboard data. Please try refreshing the page.",
      }));
    }
  };

  const retry = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { ...data, retry };
}
