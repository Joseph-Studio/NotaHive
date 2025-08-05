import { supabase } from "./supabase.Client";

export interface UserProfile {
	id: string;
	email: string;
	username: string;
	created_at: string;
	updated_at: string;
}

export class UserService {
	/**
	 * Check if a username already exists
	 */
	static async checkUsernameExists(username: string): Promise<boolean> {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("username")
				.eq("username", username)
				.single();

			if (error && error.code !== "PGRST116") {
				console.error("Error checking username:", error);
				throw error;
			}

			return !!data;
		} catch (error) {
			console.error("Username check failed:", error);
			return false;
		}
	}

	/**
	 * Get user profile by ID
	 */
	static async getUserProfile(userId: string): Promise<UserProfile | null> {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) {
				// Don't log PGRST116 errors as they're expected for unconfirmed users
				if (error.code === "PGRST116") {
					console.log(
						"User profile not found (user may not be confirmed yet)"
					);
				} else {
					console.error("Error fetching user profile:", error);
				}
				return null;
			}

			return data;
		} catch (error) {
			console.error("Get user profile failed:", error);
			return null;
		}
	}

	/**
	 * Create or update user profile
	 */
	static async createOrUpdateProfile(
		userId: string,
		email: string,
		username: string
	): Promise<UserProfile | null> {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.upsert(
					{
						id: userId,
						email,
						username,
					},
					{
						onConflict: "id",
						ignoreDuplicates: false,
					}
				)
				.select()
				.single();

			if (error) {
				// Check if this is a permission error which might be expected for unconfirmed users
				if (error.code === "42501" || error.code === "PGRST116") {
					console.log(
						"Profile creation blocked - user may not be confirmed yet:",
						error.message
					);
				} else {
					console.error("Error creating/updating profile:", error);
				}
				return null;
			}

			return data;
		} catch (error) {
			// Check if this is a PGRST116 error (no rows returned) which is expected for unconfirmed users
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === "PGRST116"
			) {
				console.log(
					"Profile creation delayed - user not yet confirmed"
				);
			} else {
				console.error("Create/update profile failed:", error);
			}
			return null;
		}
	}

	/**
	 * Ensure user profile exists (fallback method)
	 */
	static async ensureProfileExists(
		userId: string,
		email: string,
		username: string
	): Promise<boolean> {
		try {
			// First check if profile exists
			const existingProfile = await this.getUserProfile(userId);

			if (existingProfile) {
				console.log("Profile already exists for user:", userId);
				return true;
			}

			// If not, create it
			console.log("Creating profile for user:", userId);
			const newProfile = await this.createOrUpdateProfile(
				userId,
				email,
				username
			);

			if (newProfile) {
				console.log("Profile created successfully:", newProfile);
				return true;
			} else {
				// Don't log as error since this might be expected for unconfirmed users
				console.log(
					"Profile creation may be delayed (user not yet confirmed):",
					userId
				);
				return false;
			}
		} catch (error) {
			// Check if this is a PGRST116 error (no rows returned) which is expected for unconfirmed users
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === "PGRST116"
			) {
				console.log(
					"Profile creation delayed - user not yet confirmed:",
					userId
				);
			} else {
				console.error("Ensure profile exists failed:", error);
			}
			return false;
		}
	}

	/**
	 * Update user profile
	 */
	static async updateProfile(
		userId: string,
		updates: Partial<Pick<UserProfile, "email" | "username">>
	): Promise<UserProfile | null> {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.update({
					...updates,
					updated_at: new Date().toISOString(),
				})
				.eq("id", userId)
				.select()
				.single();

			if (error) {
				console.error("Error updating profile:", error);
				return null;
			}

			return data;
		} catch (error) {
			console.error("Update profile failed:", error);
			return null;
		}
	}

	/**
	 * Delete user profile (use with caution)
	 */
	static async deleteProfile(userId: string): Promise<boolean> {
		try {
			const { error } = await supabase
				.from("profiles")
				.delete()
				.eq("id", userId);

			if (error) {
				console.error("Error deleting profile:", error);
				return false;
			}

			return true;
		} catch (error) {
			console.error("Delete profile failed:", error);
			return false;
		}
	}

	/**
	 * Get all profiles (admin function - use with proper permissions)
	 */
	static async getAllProfiles(): Promise<UserProfile[]> {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching all profiles:", error);
				return [];
			}

			return data || [];
		} catch (error) {
			console.error("Get all profiles failed:", error);
			return [];
		}
	}
}
