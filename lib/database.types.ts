export interface CampaignEntry {
  id: string;
  name: string;
  mobile: string;
  email: string;
  emirate: string;
  eid: string;
  receipt: string;
  lan: string; // language (ar/en)
  selected: boolean;
  info: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      campaign_entries: {
        Row: CampaignEntry;
        Insert: Omit<CampaignEntry, "id" | "created_at" | "updated_at">;
        Update: Partial<
          Omit<CampaignEntry, "id" | "created_at" | "updated_at">
        >;
      };
    };
  };
}
