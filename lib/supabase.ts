import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-key";

if (
  !process.env.EXPO_PUBLIC_SUPABASE_URL ||
  (!process.env.EXPO_PUBLIC_SUPABASE_KEY &&
    !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)
) {
  console.warn(
    "[SpendSight] Missing Supabase env vars. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY in your .env file."
  );
}

// Plain anon client — not used much in Welth since almost everything is private,
// but kept around for any public/unauthenticated reads later.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authenticated client — pass this a getToken function from Clerk's useAuth().
// This attaches the Clerk JWT to every Supabase request so RLS can identify the user
// via auth.jwt()->>'sub'.
export function createClerkSupabaseClient(
  getToken: () => Promise<string | null>
) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
      return getToken();
    },
  });
}
