import { supabase } from "./supabase.Client";

// Define the Reminder type to match the components
export interface Reminder {
	id: string;
	user_id: string;
	title: string;
	description?: string;
	due_date: string; // ISO string format
	is_completed: boolean;
	created_at: string;
	updated_at: string;
}

export interface ReminderInsert {
	id?: string;
	user_id: string;
	title: string;
	description?: string;
	due_date: string;
	is_completed?: boolean;
	created_at?: string;
	updated_at?: string;
}

export interface ReminderUpdate {
	id?: string;
	title?: string;
	description?: string;
	due_date?: string;
	is_completed?: boolean;
	updated_at?: string;
}

export class RemindersService {
	// Create a new reminder
	static async createReminder(
		userId: string,
		title: string,
		description: string | undefined,
		dueDate: Date
	): Promise<{ data: Reminder | null; error: any }> {
		try {
			const { data, error } = await supabase
				.from("reminders")
				.insert({
					user_id: userId,
					title: title,
					description: description,
					due_date: dueDate.toISOString(),
					is_completed: false,
				})
				.select()
				.single();

			if (error) {
				console.error("Error creating reminder:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception creating reminder:", error);
			return { data: null, error };
		}
	}

	// Get all reminders for a user
	static async getUserReminders(
		userId: string
	): Promise<{ data: Reminder[] | null; error: any }> {
		try {
			const { data, error } = await supabase
				.from("reminders")
				.select("*")
				.eq("user_id", userId)
				.order("due_date", { ascending: true });

			if (error) {
				console.error("Error fetching user reminders:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception fetching user reminders:", error);
			return { data: null, error };
		}
	}

	// Get reminders by status
	static async getUserRemindersByStatus(
		userId: string,
		completed: boolean
	): Promise<{ data: Reminder[] | null; error: any }> {
		try {
			const { data, error } = await supabase
				.from("reminders")
				.select("*")
				.eq("user_id", userId)
				.eq("is_completed", completed)
				.order("due_date", { ascending: true });

			if (error) {
				console.error("Error fetching reminders by status:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception fetching reminders by status:", error);
			return { data: null, error };
		}
	}

	// Get overdue reminders
	static async getOverdueReminders(
		userId: string
	): Promise<{ data: Reminder[] | null; error: any }> {
		try {
			const now = new Date().toISOString();
			const { data, error } = await supabase
				.from("reminders")
				.select("*")
				.eq("user_id", userId)
				.eq("is_completed", false)
				.lt("due_date", now)
				.order("due_date", { ascending: true });

			if (error) {
				console.error("Error fetching overdue reminders:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception fetching overdue reminders:", error);
			return { data: null, error };
		}
	}

	// Get reminders due today
	static async getTodayReminders(
		userId: string
	): Promise<{ data: Reminder[] | null; error: any }> {
		try {
			const today = new Date();
			const startOfDay = new Date(
				today.setHours(0, 0, 0, 0)
			).toISOString();
			const endOfDay = new Date(
				today.setHours(23, 59, 59, 999)
			).toISOString();

			const { data, error } = await supabase
				.from("reminders")
				.select("*")
				.eq("user_id", userId)
				.eq("is_completed", false)
				.gte("due_date", startOfDay)
				.lte("due_date", endOfDay)
				.order("due_date", { ascending: true });

			if (error) {
				console.error("Error fetching today's reminders:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception fetching today's reminders:", error);
			return { data: null, error };
		}
	}

	// Update reminder completion status
	static async toggleReminderCompletion(
		reminderId: string,
		isCompleted: boolean
	): Promise<{ data: Reminder | null; error: any }> {
		try {
			const { data, error } = await supabase
				.from("reminders")
				.update({
					is_completed: isCompleted,
					updated_at: new Date().toISOString(),
				})
				.eq("id", reminderId)
				.select()
				.single();

			if (error) {
				console.error("Error updating reminder completion:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception updating reminder completion:", error);
			return { data: null, error };
		}
	}

	// Update reminder details
	static async updateReminder(
		reminderId: string,
		updates: ReminderUpdate
	): Promise<{ data: Reminder | null; error: any }> {
		try {
			const { data, error } = await supabase
				.from("reminders")
				.update({
					...updates,
					updated_at: new Date().toISOString(),
				})
				.eq("id", reminderId)
				.select()
				.single();

			if (error) {
				console.error("Error updating reminder:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception updating reminder:", error);
			return { data: null, error };
		}
	}

	// Delete a reminder
	static async deleteReminder(reminderId: string): Promise<{ error: any }> {
		try {
			const { error } = await supabase
				.from("reminders")
				.delete()
				.eq("id", reminderId);

			if (error) {
				console.error("Error deleting reminder:", error);
				return { error };
			}

			return { error: null };
		} catch (error) {
			console.error("Exception deleting reminder:", error);
			return { error };
		}
	}

	// Get reminder statistics
	static async getReminderStats(userId: string): Promise<{
		total: number;
		completed: number;
		overdue: number;
		dueToday: number;
		error: any;
	}> {
		try {
			// Get all reminders
			const { data: allReminders, error: allError } =
				await this.getUserReminders(userId);
			if (allError || !allReminders) {
				return {
					total: 0,
					completed: 0,
					overdue: 0,
					dueToday: 0,
					error: allError,
				};
			}

			// Get overdue reminders
			const { data: overdueReminders, error: overdueError } =
				await this.getOverdueReminders(userId);
			if (overdueError) {
				return {
					total: 0,
					completed: 0,
					overdue: 0,
					dueToday: 0,
					error: overdueError,
				};
			}

			// Get today's reminders
			const { data: todayReminders, error: todayError } =
				await this.getTodayReminders(userId);
			if (todayError) {
				return {
					total: 0,
					completed: 0,
					overdue: 0,
					dueToday: 0,
					error: todayError,
				};
			}

			const completed = allReminders.filter((r) => r.is_completed).length;

			return {
				total: allReminders.length,
				completed,
				overdue: overdueReminders?.length || 0,
				dueToday: todayReminders?.length || 0,
				error: null,
			};
		} catch (error) {
			console.error("Exception getting reminder stats:", error);
			return { total: 0, completed: 0, overdue: 0, dueToday: 0, error };
		}
	}
}
