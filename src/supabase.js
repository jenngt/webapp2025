import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tcaazwprvktvpnkrhnec.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYWF6d3Bydmt0dnBua3JobmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4ODgwMDMsImV4cCI6MjA1MTQ2NDAwM30.yIekVvur3R1cbu52e8z6jO8yQM59FPqpmbWIWNhULjs";
export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
