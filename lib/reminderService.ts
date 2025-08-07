import { supabase } from "./supabase.Client";
import { Database } from "./database.types";

type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
type ReminderInsert = Database["public"]["Tables"]["reminders"]["Insert"];
type ReminderUpdate = Database["public"]["Tables"]["reminders"]["Update"];

export class ReminderService {
	// Create a new reminder for a note
	static async createReminder(
		noteId: string,
		reminderDate: string
	): Promise<Reminder | null> {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("reminders")
				.insert({
					note_id: noteId,
					user_id: user.id,
					reminder_date: reminderDate,
					is_completed: false,
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Error creating reminder:", error);
			return null;
		}
	}

	// Get reminder for a specific note
	static async getReminderForNote(noteId: string): Promise<Reminder | null> {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("reminders")
				.select("*")
				.eq("note_id", noteId)
				.eq("user_id", user.id)
				.eq("is_completed", false)
				.order("reminder_date", { ascending: true })
				.limit(1)
				.single();

			if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows found
			return data;
		} catch (error) {
			console.error("Error getting reminder for note:", error);
			return null;
		}
	}

	// Update reminder
	static async updateReminder(
		reminderId: string,
		updates: ReminderUpdate
	): Promise<Reminder | null> {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("reminders")
				.update({
					...updates,
					updated_at: new Date().toISOString(),
				})
				.eq("id", reminderId)
				.eq("user_id", user.id)
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Error updating reminder:", error);
			return null;
		}
	}

	// Delete reminder
	static async deleteReminder(reminderId: string): Promise<boolean> {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { error } = await supabase
				.from("reminders")
				.delete()
				.eq("id", reminderId)
				.eq("user_id", user.id);

			if (error) throw error;
			return true;
		} catch (error) {
			console.error("Error deleting reminder:", error);
			return false;
		}
	}

	// Delete reminder by note ID
	static async deleteReminderForNote(noteId: string): Promise<boolean> {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { error } = await supabase
				.from("reminders")
				.delete()
				.eq("note_id", noteId)
				.eq("user_id", user.id);

			if (error) throw error;
			return true;
		} catch (error) {
			console.error("Error deleting reminder for note:", error);
			return false;
		}
	}

	// Get all due reminders (for notifications)
	static async getDueReminders(): Promise<
		(Reminder & { note: { title: string } })[]
	> {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const now = new Date().toISOString();
			console.log(`🕐 Checking for reminders due before: ${now}`);

			const { data, error } = await supabase
				.from("reminders")
				.select(
					`
          *,
          note:notes(title)
        `
				)
				.eq("user_id", user.id)
				.eq("is_completed", false)
				.lte("reminder_date", now);

			if (error) throw error;

			console.log(`📊 Query returned ${data?.length || 0} reminders`);
			if (data && data.length > 0) {
				data.forEach((reminder) => {
					console.log(
						`⏰ Due reminder: ${reminder.note?.title} - ${reminder.reminder_date}`
					);
				});
			}

			return data || [];
		} catch (error) {
			console.error("Error getting due reminders:", error);
			return [];
		}
	}

	// Mark reminder as completed
	static async markReminderCompleted(reminderId: string): Promise<boolean> {
		try {
			const result = await this.updateReminder(reminderId, {
				is_completed: true,
			});
			return result !== null;
		} catch (error) {
			console.error("Error marking reminder as completed:", error);
			return false;
		}
	}

	// Get all reminders for user
	static async getUserReminders(): Promise<
		(Reminder & { note: { title: string } })[]
	> {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("reminders")
				.select(
					`
          *,
          note:notes(title)
        `
				)
				.eq("user_id", user.id)
				.order("reminder_date", { ascending: true });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error("Error getting user reminders:", error);
			return [];
		}
	}
}
