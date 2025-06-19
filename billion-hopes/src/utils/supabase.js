import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahvxqultshujgtmbkjpy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1amd0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNDc3NzAsImV4cCI6MjAyNTgyMzc3MH0.Hs_Qw_Ib_Hs_Qw_Ib_Hs_Qw_Ib_Hs_Qw_Ib';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 