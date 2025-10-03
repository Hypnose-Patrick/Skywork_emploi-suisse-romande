import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://whlgyzlbiopzycukmwwp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobGd5emxiaW9wenljdWttd3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MDMwODcsImV4cCI6MjA3Mzk3OTA4N30.lt8e4wm9Tv6NN3SeQlhLViTHqqPSJgyxI3zAo4iv85g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
