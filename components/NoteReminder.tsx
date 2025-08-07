import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Alert,
	StyleSheet,
	Modal,
	Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ReminderService } from "../lib/reminderService";
import DateTimePicker from "@react-native-community/datetimepicker";

interface NoteReminderProps {
	noteId: string;
	onReminderSet?: (noteId: string, reminderDate: string | null) => void;
}

export default function NoteReminder({
	noteId,
	onReminderSet,
}: NoteReminderProps) {
	const [hasReminder, setHasReminder] = useState(false);
	const [reminderDate, setReminderDate] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// Date/Time picker states
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState(new Date());

	useEffect(() => {
		loadReminder();
	}, [noteId]);

	const loadReminder = async () => {
		try {
			const reminder = await ReminderService.getReminderForNote(noteId);
			if (reminder) {
				setHasReminder(true);
				setReminderDate(reminder.reminder_date);
			} else {
				setHasReminder(false);
				setReminderDate(null);
			}
		} catch (error) {
			console.error("Error loading reminder:", error);
		}
	};

	const showTimePickerAlert = () => {
		const now = new Date();

		const quickOptions = [
			{ label: "15 minutes", minutes: 15 },
			{ label: "30 minutes", minutes: 30 },
			{ label: "1 hour", minutes: 60 },
			{ label: "2 hours", minutes: 120 },
			{ label: "Tomorrow 9 AM", minutes: -2 },
			{ label: "Pick Date & Time", minutes: -1 },
		];

		Alert.alert("Set Reminder", "When would you like to be reminded?", [
			...quickOptions.map((option) => ({
				text: option.label,
				onPress: () => {
					if (option.minutes === -1) {
						// Start with date picker
						setSelectedDate(new Date());
						setSelectedTime(new Date());
						setShowDatePicker(true);
					} else if (option.minutes === -2) {
						const tomorrow = new Date();
						tomorrow.setDate(tomorrow.getDate() + 1);
						tomorrow.setHours(9, 0, 0, 0);
						setReminderFunction(tomorrow.toISOString());
					} else {
						const reminderTime = new Date(
							now.getTime() + option.minutes * 60000
						);
						setReminderFunction(reminderTime.toISOString());
					}
				},
			})),
			{ text: "Cancel", style: "cancel" },
		]);
	};

	const onDateChange = (event: any, date?: Date) => {
		if (Platform.OS === "android") {
			setShowDatePicker(false);
		}

		if (date) {
			setSelectedDate(date);
			if (Platform.OS === "android") {
				// On Android, immediately show time picker after date selection
				setShowTimePicker(true);
			}
		} else if (Platform.OS === "android") {
			// User cancelled date picker on Android
			setShowDatePicker(false);
		}
	};

	const onTimeChange = (event: any, time?: Date) => {
		if (Platform.OS === "android") {
			setShowTimePicker(false);
		}

		if (time) {
			setSelectedTime(time);

			if (Platform.OS === "android") {
				// On Android, combine date and time and set reminder
				const combinedDateTime = new Date(selectedDate);
				combinedDateTime.setHours(
					time.getHours(),
					time.getMinutes(),
					0,
					0
				);

				// Check if it's in the past
				if (combinedDateTime <= new Date()) {
					Alert.alert(
						"Past Time",
						"The selected time is in the past. Would you like to set it for the next day?",
						[
							{ text: "Cancel", style: "cancel" },
							{
								text: "Set for Next Day",
								onPress: () => {
									combinedDateTime.setDate(
										combinedDateTime.getDate() + 1
									);
									setReminderFunction(
										combinedDateTime.toISOString()
									);
								},
							},
						]
					);
				} else {
					setReminderFunction(combinedDateTime.toISOString());
				}
			}
		} else if (Platform.OS === "android") {
			// User cancelled time picker on Android
			setShowTimePicker(false);
		}
	};

	const confirmDateTime = () => {
		// For iOS, we combine the selected date and time
		const combinedDateTime = new Date(selectedDate);
		combinedDateTime.setHours(
			selectedTime.getHours(),
			selectedTime.getMinutes(),
			0,
			0
		);

		setShowDatePicker(false);
		setShowTimePicker(false);

		// Check if it's in the past
		if (combinedDateTime <= new Date()) {
			Alert.alert(
				"Past Time",
				"The selected time is in the past. Would you like to set it for the next day?",
				[
					{ text: "Cancel", style: "cancel" },
					{
						text: "Set for Next Day",
						onPress: () => {
							combinedDateTime.setDate(
								combinedDateTime.getDate() + 1
							);
							setReminderFunction(combinedDateTime.toISOString());
						},
					},
				]
			);
		} else {
			setReminderFunction(combinedDateTime.toISOString());
		}
	};

	const cancelDateTimePicker = () => {
		setShowDatePicker(false);
		setShowTimePicker(false);
	};

	const setReminderFunction = async (dateTime: string) => {
		setLoading(true);
		try {
			const reminder = await ReminderService.createReminder(
				noteId,
				dateTime
			);
			if (reminder) {
				setHasReminder(true);
				setReminderDate(dateTime);
				onReminderSet?.(noteId, dateTime);
			} else {
				Alert.alert("Error", "Failed to set reminder");
			}
		} catch (error) {
			console.error("Error setting reminder:", error);
			Alert.alert("Error", "Failed to set reminder");
		} finally {
			setLoading(false);
		}
	};

	const removeReminder = async () => {
		setLoading(true);
		try {
			const success = await ReminderService.deleteReminderForNote(noteId);
			if (success) {
				setHasReminder(false);
				setReminderDate(null);
				onReminderSet?.(noteId, null);
			} else {
				Alert.alert("Error", "Failed to remove reminder");
			}
		} catch (error) {
			console.error("Error removing reminder:", error);
			Alert.alert("Error", "Failed to remove reminder");
		} finally {
			setLoading(false);
		}
	};

	const formatReminderTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const today = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		);
		const reminderDay = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		);

		const time = date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
		const timeWithAmPm = date.toLocaleTimeString([], {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});

		if (reminderDay.getTime() === today.getTime()) {
			return `Today at ${timeWithAmPm}`;
		} else if (reminderDay.getTime() === today.getTime() + 86400000) {
			return `Tomorrow at ${timeWithAmPm}`;
		} else if (reminderDay.getTime() === today.getTime() - 86400000) {
			return `Yesterday at ${timeWithAmPm}`;
		} else {
			const daysDiff = Math.floor(
				(reminderDay.getTime() - today.getTime()) /
					(1000 * 60 * 60 * 24)
			);
			if (daysDiff > 0 && daysDiff <= 7) {
				const dayName = date.toLocaleDateString([], {
					weekday: "long",
				});
				return `${dayName} at ${timeWithAmPm}`;
			} else {
				return `${date.toLocaleDateString()} at ${timeWithAmPm}`;
			}
		}
	};

	if (hasReminder && reminderDate) {
		return (
			<View style={styles.reminderContainer}>
				<View style={styles.reminderInfo}>
					<Feather name="bell" size={16} color="#FF6B6B" />
					<Text style={styles.reminderText}>
						{formatReminderTime(reminderDate)}
					</Text>
				</View>
				<TouchableOpacity
					onPress={removeReminder}
					disabled={loading}
					style={styles.removeButton}
				>
					<Feather name="x" size={16} color="#666" />
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View>
			<TouchableOpacity
				onPress={showTimePickerAlert}
				disabled={loading}
				style={styles.addReminderButton}
			>
				<Feather name="bell" size={16} color="#888" />
				<Text style={styles.addReminderText}>Add reminder</Text>
			</TouchableOpacity>

			{/* Date Picker Modal for iOS */}
			{Platform.OS === "ios" && showDatePicker && (
				<Modal transparent={true} animationType="slide">
					<View style={styles.modalOverlay}>
						<View style={styles.pickerContainer}>
							<View style={styles.pickerHeader}>
								<TouchableOpacity
									onPress={cancelDateTimePicker}
								>
									<Text style={styles.cancelButton}>
										Cancel
									</Text>
								</TouchableOpacity>
								<Text style={styles.pickerTitle}>
									Select Date & Time
								</Text>
								<TouchableOpacity onPress={confirmDateTime}>
									<Text style={styles.confirmButton}>
										Done
									</Text>
								</TouchableOpacity>
							</View>

							<DateTimePicker
								value={selectedDate}
								mode="date"
								display="spinner"
								onChange={onDateChange}
								minimumDate={new Date()}
								style={styles.picker}
							/>

							<DateTimePicker
								value={selectedTime}
								mode="time"
								display="spinner"
								onChange={(event, time) => {
									if (time) setSelectedTime(time);
								}}
								style={styles.picker}
							/>
						</View>
					</View>
				</Modal>
			)}

			{/* Android Date Picker */}
			{Platform.OS === "android" && showDatePicker && (
				<DateTimePicker
					value={selectedDate}
					mode="date"
					display="default"
					onChange={onDateChange}
					minimumDate={new Date()}
				/>
			)}

			{/* Android Time Picker */}
			{Platform.OS === "android" && showTimePicker && (
				<DateTimePicker
					value={selectedTime}
					mode="time"
					display="default"
					onChange={onTimeChange}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	reminderContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#FFF5F5",
		padding: 8,
		borderRadius: 6,
		marginTop: 8,
		borderLeftWidth: 3,
		borderLeftColor: "#FF6B6B",
	},
	reminderInfo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	reminderText: {
		marginLeft: 6,
		fontSize: 12,
		color: "#FF6B6B",
		fontWeight: "500",
	},
	removeButton: {
		padding: 4,
	},
	addReminderButton: {
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
		marginTop: 8,
	},
	addReminderText: {
		marginLeft: 6,
		fontSize: 12,
		color: "#888",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	pickerContainer: {
		backgroundColor: "white",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingBottom: 20,
	},
	pickerHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
	},
	pickerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
	},
	cancelButton: {
		fontSize: 16,
		color: "#666",
	},
	confirmButton: {
		fontSize: 16,
		color: "#007AFF",
		fontWeight: "600",
	},
	picker: {
		height: 120,
	},
});
