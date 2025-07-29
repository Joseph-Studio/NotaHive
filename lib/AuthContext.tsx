import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase.Client";

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
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signUp = async (
		email: string,
		password: string,
		username: string
	) => {
		try {
			console.log("Starting signup process for:", { email, username });

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
				// Create profile record with the actual user ID
				console.log(
					"Attempting to create profile for user:",
					data.user.id
				);

				const { data: profileData, error: profileError } =
					await supabase
						.from("profiles")
						.insert({
							email,
							username,
							id: data.user.id,
						})
						.select();

				if (profileError) {
					console.error("Profile creation error details:", {
						message: profileError.message,
						code: profileError.code,
						details: profileError.details,
						hint: profileError.hint,
					});
					// Don't return error here since user was created successfully
					// The trigger should handle profile creation as backup
					console.log(
						"User created but profile creation failed. Trigger should handle this."
					);
				} else {
					console.log("Profile created successfully:", profileData);
				}
			}

			// Return success even if profile creation failed (trigger will handle it)
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
