export interface Database {
  public: {
    Tables: {
      meal_entries: {
        Row: {
          id: string;
          created_at: string;
          date: string;
          meal_type: string;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          date: string;
          meal_type: string;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          date?: string;
          meal_type?: string;
          image_url?: string | null;
        };
      };
      meal_items: {
        Row: {
          id: string;
          meal_entry_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          meal_entry_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          meal_entry_id?: string;
          name?: string;
          created_at?: string;
        };
      };
    };
  };
}