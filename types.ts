import type React from 'react';

export interface Step {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export interface Message {
  id: number;
  created_at: string;
  text: string;
  user_id: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          created_at: string
          id: number
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          text?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
