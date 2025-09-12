"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CampaignEntry } from "@/lib/database.types";

interface EntriesData {
  allEntries: CampaignEntry[];
  loading: boolean;
  error: string | null;
}

export function useEntriesData() {
  const [data, setData] = useState<EntriesData>({
    allEntries: [],
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

      setData({
        allEntries,
        loading: false,
        error: null,
      });

      console.log(`Successfully fetched ${allEntries.length} total entries`);
    } catch (error: any) {
      console.error("Error fetching entries data:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error.message === "Connection closed."
            ? "Database connection lost. Please check your internet connection and try again."
            : "Failed to load entries data. Please try refreshing the page.",
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
