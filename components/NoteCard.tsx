import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Database } from "../lib/database.types";
import Checkbox from "expo-checkbox";

type Note = Database["public"]["Tables"]["notes"]["Row"];

interface NoteCardProps {
	note: Note;
	noteType?: string;
	onDelete: (noteId: string) => void;
	onValueChange: (id: string, completed: boolean) => void;
	isFirst?: boolean;
}

export default function NoteCard({
	note,
	noteType,
	onDelete,
	onValueChange,
	isFirst = false,
}: NoteCardProps) {
	const getNoteTypeColor = (selectedNoteType: string) => {
		switch (selectedNoteType) {
			case "MyDay":
				return "#6200ee";
			case "Important":
				return "#f44336";
			case "Assignments":
				return "#2196f3";
			case "Tasks":
				return "#ff9800";
			default:
				return "#666";
		}
	};
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return (
			date.toLocaleDateString() +
			" " +
			date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})
		);
	};

	return (
		<View
			style={[
				styles.noteCard,
				isFirst && styles.firstCard,
				{ borderLeftColor: getNoteTypeColor(noteType) },
			]}
		>

			<View style={styles.noteHeader}>
				<Checkbox
                    value={note.completed}
                    onValueChange={() =>
                        onValueChange(note.id, note.completed ?? false)
                    }
                />
				<Text
					style={[
						styles.noteTypeBadge,
						{ backgroundColor: getNoteTypeColor(noteType) },
						styles.noteTypeText,
					]}
				>
					{note.note_type}
				</Text>
				<TouchableOpacity
					style={styles.deleteButton}
					onPress={() => onDelete(note.id)}
				>
					<Text style={styles.deleteButtonText}>×</Text>
				</TouchableOpacity>
			</View>
			{
				note.title ? (
					<Text style={styles.noteTitle}>{note.title}</Text>
				) : (
					<Text style={styles.noteContent}>Untitled Note</Text>
				)
			}
			<Text style={styles.noteContent}>{note.content}</Text>
			<Text style={[styles.noteDate, styles.noteFooter]}>
				{formatDate(note.created_at)}
			</Text>
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
	noteTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
		marginBottom: 8,
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
});
