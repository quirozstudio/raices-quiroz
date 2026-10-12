export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      life_journeys: {
        Row: {
          owner_id: string;
          answers: Json;
          current_step: number;
          summary: string | null;
          completed: boolean;
          updated_at: string;
        };
        Insert: {
          owner_id: string;
          answers?: Json;
          current_step?: number;
          summary?: string | null;
          completed?: boolean;
          updated_at?: string;
        };
        Update: Partial<{
          owner_id: string;
          answers: Json;
          current_step: number;
          summary: string | null;
          completed: boolean;
          updated_at: string;
        }>;
        Relationships: [];
      };
      memories: {
        Row: {
          id: string;
          owner_id: string;
          story_id: string | null;
          name: string;
          object_path: string;
          mime_type: string;
          size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          story_id?: string | null;
          name: string;
          object_path: string;
          mime_type: string;
          size: number;
          created_at?: string;
        };
        Update: Partial<{
          id: string;
          owner_id: string;
          story_id: string | null;
          name: string;
          object_path: string;
          mime_type: string;
          size: number;
          created_at: string;
        }>;
        Relationships: [];
      };
      people: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          email: string;
          group_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          email: string;
          group_name?: string;
          created_at?: string;
        };
        Update: Partial<{
          id: string;
          owner_id: string;
          name: string;
          email: string;
          group_name: string;
          created_at: string;
        }>;
        Relationships: [];
      };
      stories: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          content: string;
          prompt: string | null;
          status: string;
          privacy: string;
          share_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title?: string;
          content?: string;
          prompt?: string | null;
          status?: string;
          privacy?: string;
          share_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<{
          id: string;
          owner_id: string;
          title: string;
          content: string;
          prompt: string | null;
          status: string;
          privacy: string;
          share_token: string | null;
          created_at: string;
          updated_at: string;
        }>;
        Relationships: [];
      };
      story_access: {
        Row: { story_id: string; person_id: string; owner_id: string };
        Insert: { story_id: string; person_id: string; owner_id: string };
        Update: Partial<{ story_id: string; person_id: string; owner_id: string }>;
        Relationships: [];
      };
      story_chapters: {
        Row: {
          id: string;
          story_id: string;
          owner_id: string;
          title: string;
          content: string;
          chapter_order: number;
          period_label: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          owner_id: string;
          title?: string;
          content?: string;
          chapter_order?: number;
          period_label?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<{
          id: string;
          story_id: string;
          owner_id: string;
          title: string;
          content: string;
          chapter_order: number;
          period_label: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        }>;
        Relationships: [];
      };
      story_versions: {
        Row: {
          id: string;
          story_id: string;
          chapter_id: string | null;
          owner_id: string;
          title: string;
          content: string;
          change_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          chapter_id?: string | null;
          owner_id: string;
          title?: string;
          content?: string;
          change_reason?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          id: string;
          story_id: string;
          chapter_id: string | null;
          owner_id: string;
          title: string;
          content: string;
          change_reason: string | null;
          created_at: string;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
