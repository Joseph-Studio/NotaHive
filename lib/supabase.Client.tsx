import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Get environment variables from Expo configuration
const supabaseUrl =
	Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
	"YOUR_SUPABASE_URL";
const supabaseAnonKey =
	Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
	"YOUR_SUPABASE_ANON_KEY";

export const supabase: SupabaseClient = createClient(
	supabaseUrl,
	supabaseAnonKey,
	{
		auth: {
			// Enable auto refresh of tokens
			autoRefreshToken: true,
			// Persist session in storage
			persistSession: true,
			// Detect session in URL
			detectSessionInUrl: false,
		},
	}
);
