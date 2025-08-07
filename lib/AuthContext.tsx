import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase.Client";
import { UserService } from "./userService";
import { NotificationService } from "./notificationService";

interface AuthContextType {
	user: User | null;
	session: Session | null;
	loading: boolean;
	signUp: (
		email: string,
		password: string,
		username: string
	) => Promise<{ error: any }>;
	signIn: (username: string, password: string) => Promise<{ error: any }>;
	signOut: () => Promise<void>;
	resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	// Diagnostic function to check database setup
	const checkDatabaseSetup = async () => {
		try {
			console.log("🔍 Checking database setup...");

			// Check if profiles table exists and is accessible
			const { data, error } = await supabase
				.from("profiles")
				.select("count")
				.limit(1);

			if (error) {
				console.error("❌ Profiles table error:", error);
				if (error.code === "PGRST116") {
					console.error(
						"❌ Profiles table does not exist! Run the SQL setup script."
					);
				} else if (error.code === "42501") {
					console.error("❌ Permission denied! Check RLS policies.");
				}
			} else {
				console.log("✅ Profiles table is accessible");
			}
		} catch (err) {
			console.error("❌ Database setup check failed:", err);
		}
	};

	useEffect(() => {
		// Check database setup on app start
		checkDatabaseSetup();

		// Get initial session
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);

			// Ensure profile exists for current user
			if (session?.user) {
				await ensureUserProfile(session.user);
				// Start notification service for initial session
				NotificationService.startReminderChecking();
			}

			setLoading(false);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);

			// Ensure profile exists when user signs in
			if (session?.user) {
				await ensureUserProfile(session.user);
				// Start notification service when user is authenticated
				NotificationService.startReminderChecking();
			} else {
				// Stop notification service when user logs out
				NotificationService.stopReminderChecking();
			}

			setLoading(false);
		});

		return () => {
			subscription.unsubscribe();
			// Stop notification service when component unmounts
			NotificationService.stopReminderChecking();
		};
	}, []);

	// Helper function to ensure user profile exists
	const ensureUserProfile = async (user: User) => {
		try {
			// Check if user is confirmed/verified before trying to access profile
			if (!user.email_confirmed_at && !user.confirmed_at) {
				console.log("User not yet confirmed, skipping profile check");
				return;
			}

			const profile = await UserService.getUserProfile(user.id);
			if (!profile) {
				console.log(
					"Profile not found for user, attempting to create..."
				);
				const success = await UserService.ensureProfileExists(
					user.id,
					user.email || "",
					user.user_metadata?.username ||
						`user_${user.id.substring(0, 8)}`
				);
				if (success) {
					console.log(
						"Profile created successfully for existing user"
					);
				} else {
					console.warn("Failed to create profile for existing user");
				}
			}
		} catch (error) {
			// Only log as error if it's not a "no rows returned" error
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === "PGRST116"
			) {
				console.log(
					"User profile not yet accessible (user may not be confirmed)"
				);
			} else {
				console.error("Error ensuring user profile:", error);
			}
		}
	};

	const signUp = async (
		email: string,
		password: string,
		username: string
	) => {
		try {
			console.log("Starting signup process for:", { email, username });

			// First, check if username already exists using UserService
			const usernameExists = await UserService.checkUsernameExists(
				username
			);
			if (usernameExists) {
				return { error: { message: "Username already exists" } };
			}

			// Create the user in Supabase Auth
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						username,
					},
				},
			});

			if (error) {
				console.error("Auth signup error:", error);
				return { error };
			}

			console.log("Auth signup successful, user ID:", data.user?.id);

			if (data.user) {
				// Wait a moment for the trigger to potentially create the profile
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Use UserService to ensure profile exists
				// Note: This might fail for unconfirmed users, which is expected
				try {
					const profileExists = await UserService.ensureProfileExists(
						data.user.id,
						email,
						username
					);

					if (profileExists) {
						console.log("User profile ensured successfully");
					} else {
						console.log(
							"Profile creation may be delayed until email confirmation"
						);
					}
				} catch (profileError) {
					console.log(
						"Profile creation delayed (user not yet confirmed)"
					);
				}
			}

			return { error: null };
		} catch (error) {
			console.error("SignUp error:", error);
			return {
				error: { message: "Registration failed. Please try again." },
			};
		}
	};

	const signIn = async (username: string, password: string) => {
		try {
			// First, look up the email by username
			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("email")
				.eq("username", username)
				.single();

			if (profileError || !profileData) {
				return { error: { message: "Username not found" } };
			}

			// Now sign in with the email
			const { error } = await supabase.auth.signInWithPassword({
				email: profileData.email,
				password,
			});

			return { error };
		} catch (error) {
			return {
				error: {
					message:
						"Login failed. Please check your username and password.",
				},
			};
		}
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	const resetPassword = async (email: string) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: "yourapp://reset-password",
		});
		return { error };
	};

	const value = {
		user,
		session,
		loading,
		signUp,
		signIn,
		signOut,
		resetPassword,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
