import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.PROJECT_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.API_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: number;
  title: string;
  description: string;
  day_number?: number;
  project_date?: string;
  tech_stack: string[];
  live_link?: string;
  github_link?: string;
  image_url?: string;
  created_at: string;
}
