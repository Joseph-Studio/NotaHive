import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
	Platform,
	Modal,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import SettingsButton from "../components/SettingsButton";
import UserHeader from "../components/UserHeader";
import globalStyles from "../styles/globalStyles";
import BackButton from "../components/BackButton";
import { NotesService } from "../lib/notesService";
import { useAuth } from "../lib/AuthContext";
import { Database } from "../lib/database.types";
import DateTimePicker from "@react-native-community/datetimepicker";

type Note = Database["public"]["Tables"]["notes"]["Row"];

export default function Important() {
	const { username } = useLocalSearchParams();
	const { user } = useAuth();
	const [notes, setNotes] = useState<Note[]>([]);
	const [loading, setLoading] = useState(true);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
	const [tempDate, setTempDate] = useState<Date>(new Date());

	const loadNotes = async () => {
		if (!user?.id) return;

		try {
			const { data, error } = await NotesService.getUserNotesByType(
				user.id,
				"Important"
			);

			if (error) {
				console.error("Error loading Important notes:", error);
				Alert.alert("Error", "Failed to load notes. Please try again.");
				return;
			}

			if (data) {
				setNotes(data);
			}
		} catch (error) {
			console.error("Exception loading Important notes:", error);
			Alert.alert("Error", "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteNote = async (noteId: string) => {
		Alert.alert(
			"Delete Note",
			"Are you sure you want to delete this note?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							const { error } = await NotesService.deleteNote(noteId);
							if (error) {
								console.error("Error deleting note:", error);
								Alert.alert("Error", "Failed to delete note. Please try again.");
								return;
							}
							setNotes((prevNotes) =>
								prevNotes.filter((note) => note.id !== noteId)
							);
							Alert.alert("Success", "Note deleted successfully!");
						} catch (error) {
							console.error("Exception deleting note:", error);
							Alert.alert("Error", "An unexpected error occurred.");
						}
					},
				},
			]
		);
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === "android") {
			setShowDatePicker(false);
			if (selectedDate && selectedNoteId) {
				console.log("Reminder set for:", selectedDate, "Note ID:", selectedNoteId);
				setSelectedNoteId(null);
			}
		} else {
			if (selectedDate) {
				setTempDate(selectedDate);
			}
		}
	};

	const handleConfirmIOSReminder = () => {
		if (selectedNoteId && tempDate) {
			console.log("iOS Reminder set for:", tempDate, "Note ID:", selectedNoteId);
			setSelectedNoteId(null);
			setShowDatePicker(false);
		}
	};

	useEffect(() => {
		loadNotes();
	}, [user?.id]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return (
			date.toLocaleDateString() +
			" " +
			date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
		);
	};

	return (
		<View style={globalStyles.container}>
			<UserHeader />

			<View style={globalStyles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>Important Notes</Text>
					<Text style={styles.subtitle}>
						{notes.length} important note{notes.length !== 1 ? "s" : ""}
					</Text>
				</View>

				{loading ? (
					<View style={styles.centerContainer}>
						<Text style={styles.loadingText}>Loading important notes...</Text>
					</View>
				) : notes.length === 0 ? (
					<View style={styles.centerContainer}>
						<Text style={styles.emptyText}>No important notes yet</Text>
						<Text style={styles.emptySubtext}>
							Mark notes as important to see them here!
						</Text>
					</View>
				) : (
					<ScrollView
						style={styles.notesContainer}
						showsVerticalScrollIndicator={false}
					>
						{notes.map((note, index) => (
							<View
								key={note.id}
								style={[
									styles.noteCard,
									index === 0 && styles.firstCard,
								]}
							>
								<View style={styles.noteHeader}>
									<View style={styles.noteTypeBadge}>
										<Text style={styles.noteTypeText}>Important</Text>
									</View>

									<TouchableOpacity
										style={styles.remindButton}
										onPress={() => {
											setSelectedNoteId(note.id);
											setTempDate(new Date());
											setShowDatePicker(true);
										}}
									>
										<Text style={styles.remindButtonText}>⏰</Text>
									</TouchableOpacity>

									<TouchableOpacity
										style={styles.deleteButton}
										onPress={() => handleDeleteNote(note.id)}
									>
										<Text style={styles.deleteButtonText}>×</Text>
									</TouchableOpacity>
								</View>

								<Text style={styles.noteContent}>{note.content}</Text>
								<View style={styles.noteFooter}>
									<Text style={styles.noteDate}>
										{formatDate(note.created_at)}
									</Text>
								</View>
							</View>
						))}
					</ScrollView>
				)}
			</View>

			{/* Android Date Picker */}
			{showDatePicker && Platform.OS === "android" && (
				<DateTimePicker
					value={new Date()}
					mode="date"
					display="default"
					onChange={handleDateChange}
				/>
			)}

			{/* iOS Date Picker Modal */}
			{Platform.OS === "ios" && (
				<Modal visible={showDatePicker} transparent animationType="slide">
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<DateTimePicker
								value={tempDate}
								mode="date"
								display="spinner"
								onChange={handleDateChange}
								style={{ backgroundColor: "white" }}
							/>
							<TouchableOpacity
								style={styles.iosConfirmButton}
								onPress={handleConfirmIOSReminder}
							>
								<Text style={styles.iosConfirmButtonText}>Confirm</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			)}

			<BackButton
				onPress={() =>
					router.push({ pathname: `./home`, params: { username } })
				}
				variant="circle"
			/>
			<SettingsButton
				variant="circle"
				onPress={() => console.log("Settings from Important")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		marginBottom: 24,
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "white",
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 14,
		color: "#888",
		fontWeight: "500",
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	loadingText: {
		color: "white",
		textAlign: "center",
		fontSize: 16,
		fontWeight: "500",
	},
	emptyText: {
		color: "white",
		textAlign: "center",
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 8,
	},
	emptySubtext: {
		color: "#888",
		textAlign: "center",
		fontSize: 14,
		lineHeight: 20,
	},
	notesContainer: {
		flex: 1,
	},
	noteCard: {
		backgroundColor: "#2a2a2a",
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		borderLeftWidth: 4,
		borderLeftColor: "#f44336",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	firstCard: {
		marginTop: 8,
	},
	noteHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	noteTypeBadge: {
		backgroundColor: "#f44336",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
	},
	noteTypeText: {
		color: "white",
		fontSize: 12,
		fontWeight: "600",
		textTransform: "uppercase",
	},
	noteContent: {
		color: "white",
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 16,
		fontWeight: "400",
	},
	noteFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	noteDate: {
		color: "#888",
		fontSize: 12,
		fontWeight: "500",
	},
	deleteButton: {
		backgroundColor: "#f50057",
		width: 28,
		height: 28,
		borderRadius: 14,
		justifyContent: "center",
		alignItems: "center",
	},
	deleteButtonText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		lineHeight: 20,
	},
	remindButton: {
		backgroundColor: "#4caf50",
		width: 28,
		height: 28,
		borderRadius: 14,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 8,
	},
	remindButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
	},
	modalContent: {
		backgroundColor: "white",
		marginHorizontal: 20,
		borderRadius: 10,
		padding: 16,
	},
	iosConfirmButton: {
		marginTop: 10,
		backgroundColor: "#007AFF",
		borderRadius: 8,
		paddingVertical: 10,
	},
	iosConfirmButtonText: {
		color: "white",
		textAlign: "center",
		fontSize: 16,
		fontWeight: "600",
	},
});
