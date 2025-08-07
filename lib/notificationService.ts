import { Alert } from "react-native";
import { ReminderService } from "./reminderService";

export class NotificationService {
	private static checkInterval: NodeJS.Timeout | null = null;
	private static isChecking = false;

	// Start checking for due reminders every minute
	static startReminderChecking() {
		console.log("🔔 Starting reminder checking service...");

		if (this.checkInterval) {
			clearInterval(this.checkInterval);
		}

		// Check immediately
		this.checkDueReminders();

		// Then check every minute
		this.checkInterval = setInterval(() => {
			this.checkDueReminders();
		}, 60000); // 60 seconds

		console.log("✅ Reminder checking service started");
	}

	// Stop checking for reminders
	static stopReminderChecking() {
		console.log("🔕 Stopping reminder checking service...");

		if (this.checkInterval) {
			clearInterval(this.checkInterval);
			this.checkInterval = null;
		}
		this.isChecking = false;

		console.log("✅ Reminder checking service stopped");
	}

	// Check for due reminders and show alerts
	private static async checkDueReminders() {
		if (this.isChecking) return;

		this.isChecking = true;
		console.log("🔍 Checking for due reminders...");

		try {
			const dueReminders = await ReminderService.getDueReminders();
			console.log(`📋 Found ${dueReminders?.length || 0} due reminders`);

			if (dueReminders && dueReminders.length > 0) {
				console.log("🔔 Showing alerts for due reminders");
				// Show alert for each due reminder
				dueReminders.forEach((reminder) => {
					this.showReminderAlert(reminder);
				});
			}
		} catch (error) {
			console.error("❌ Exception checking due reminders:", error);
		} finally {
			this.isChecking = false;
		}
	}

	// Show alert for a due reminder
	private static showReminderAlert(reminder: any) {
		const title = reminder.note.title || "Untitled Note";
		const reminderTime = new Date(
			reminder.reminder_date
		).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});

		Alert.alert(
			"🔔 Reminder",
			`"${title}"\n\nReminder was set for ${reminderTime}`,
			[
				{
					text: "Dismiss",
					style: "cancel",
					onPress: () => {
						// Mark reminder as completed when dismissed
						ReminderService.markReminderCompleted(reminder.id);
					},
				},
				{
					text: "Snooze 5 min",
					onPress: () => {
						// Update reminder to 5 minutes from now
						const newDate = new Date(
							Date.now() + 5 * 60 * 1000
						).toISOString();
						ReminderService.updateReminder(reminder.id, {
							reminder_date: newDate,
						});
					},
				},
			],
			{ cancelable: true }
		);
	}

	// Manually check for due reminders (useful for testing)
	static async checkNow() {
		console.log("🧪 Manual reminder check triggered");
		await this.checkDueReminders();
	}

	// Test function to create a reminder for immediate testing
	static async createTestReminder() {
		console.log("🧪 Creating test reminder...");
		// This would need to be implemented based on your needs
		Alert.alert("Test", "This is a test reminder alert!");
	}
}
