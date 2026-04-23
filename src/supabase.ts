// src/supabase.ts
import { createClient } from '@supabase/supabase-js';

// 1. Paste your Supabase URL and Anon Key here
const supabaseUrl = 'https://bfxabpmewuijhqfukeku.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeGFicG1ld3VpamhxZnVrZWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzNDAsImV4cCI6MjA5MDgwMjM0MH0.qSx96qprwcTsgoKi8Xb4N53_LcLvy4JIi2ncfZwkBTU';

// 2. Export it so your React pages can use it
export const supabase = createClient(supabaseUrl, supabaseKey);
