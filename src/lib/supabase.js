import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://filvdjekfcgszgzkezwc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbHZkamVrZmNnc3pnemtlendjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODQ5NDcsImV4cCI6MjA4MTA2MDk0N30.9OzYcon1C1ISLQqrgTDLs6SUtbYQVtNyIq6toQQBXxc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
