import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import SettingsButton from "../components/SettingsButton";
import UserHeader from "../components/UserHeader";
import NoteCard from "../components/NoteCard";
import globalStyles from "../styles/globalStyles";
import BackButton from "../components/BackButton";
import { NotesService } from "../lib/notesService";
import { useAuth } from "../lib/AuthContext";
import { Database } from "../lib/database.types";

type Note = Database["public"]["Tables"]["notes"]["Row"];

export default function MyDay() {
	const { username } = useLocalSearchParams();
	const { user } = useAuth();
	const [notes, setNotes] = useState<Note[]>([]);
	const [loading, setLoading] = useState(true);

	const loadNotes = async () => {
		if (!user?.id) return;

		try {
			const { data, error } = await NotesService.getUserNotesByType(
				user.id,
				"MyDay"
			);

			if (error) {
				console.error("Error loading MyDay notes:", error);
				Alert.alert("Error", "Failed to load notes. Please try again.");
				return;
			}

			if (data) {
				setNotes(data);
			}
		} catch (error) {
			console.error("Exception loading MyDay notes:", error);
			Alert.alert("Error", "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	// Load notes
	useEffect(() => {
		loadNotes();
	}, [user]);

	// Refresh notes when screen comes into focus
	useFocusEffect(
		React.useCallback(() => {
			loadNotes();
		}, [user?.id])
	);

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
							const { error } = await NotesService.deleteNote(
								noteId
							);

							if (error) {
								console.error("Error deleting note:", error);
								Alert.alert(
									"Error",
									"Failed to delete note. Please try again."
								);
								return;
							}

							setNotes((prevNotes) =>
								prevNotes.filter((note) => note.id !== noteId)
							);
							Alert.alert(
								"Success",
								"Note deleted successfully!"
							);
						} catch (error) {
							console.error("Exception deleting note:", error);
							Alert.alert(
								"Error",
								"An unexpected error occurred."
							);
						}
					},
				},
			]
		);
	};

	const handleToggleCompleted = async (
		noteId: string,
		currentValue: boolean
	) => {
		try {
			const { data, error } = await NotesService.updateNoteCompleted(
				noteId,
				!currentValue
			);
			if (error) {
				console.error("Error updating note completion:", error);
				Alert.alert(
					"Error",
					"Failed to update note. Please try again."
				);
				return;
			}
			setNotes((prevNotes) =>
				prevNotes.map((note) =>
					note.id === noteId
						? { ...note, completed: !currentValue }
						: note
				)
			);
		} catch (error) {
			console.error("Exception updating note completion:", error);
			Alert.alert("Error", "An unexpected error occurred.");
		}
	};

	// Handle reminder setting for notes
	const handleReminderSet = async (
		noteId: string,
		reminderDate: string | null
	) => {
		try {
			// Update local state to reflect the change
			loadNotes(); // Reload notes to get the updated reminder status
		} catch (error) {
			console.error("Error handling reminder:", error);
			Alert.alert("Error", "An unexpected error occurred.");
		}
	};

	return (
		<View style={globalStyles.container}>
			<UserHeader />

			<View style={globalStyles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>My Day Notes</Text>
					<Text style={styles.subtitle}>
						{notes.length} note{notes.length !== 1 ? "s" : ""}
					</Text>
				</View>

				{loading ? (
					<View style={styles.centerContainer}>
						<Text style={styles.loadingText}>Loading notes...</Text>
					</View>
				) : notes.length === 0 ? (
					<View style={styles.centerContainer}>
						<Text style={styles.emptyText}>
							No My Day notes yet
						</Text>
						<Text style={styles.emptySubtext}>
							Create your first note to get started!
						</Text>
					</View>
				) : (
					<ScrollView
						style={styles.notesContainer}
						showsVerticalScrollIndicator={false}
					>
						{notes.map((note, index) => (
							<NoteCard
								key={note.id}
								note={note}
								noteType={note.note_type}
								onDelete={handleDeleteNote}
								onValueChange={() =>
									handleToggleCompleted(
										note.id,
										note.completed ?? false
									)
								}
								onReminderSet={handleReminderSet}
								isFirst={index === 0}
							/>
						))}
					</ScrollView>
				)}
			</View>

			<View style={styles.buttonContainer}>
				<BackButton
					onPress={() =>
						router.push({
							pathname: `./home`,
							params: { username },
						})
					}
					variant="circle"
				/>
				<View style={styles.rightButtons}>
					<SettingsButton
						variant="circle"
						onPress={() => console.log("Settings from My Day")}
					/>
				</View>
			</View>
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
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	rightButtons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
});
