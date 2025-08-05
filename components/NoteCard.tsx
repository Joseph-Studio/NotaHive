import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Database } from "../lib/database.types";
import Checkbox from "expo-checkbox";

type Note = Database["public"]["Tables"]["notes"]["Row"];

interface NoteCardProps {
	note: Note;
	onDelete: (noteId: string) => void;
	onValueChange: (id: string, completed: boolean) => void;
	isFirst?: boolean;
	accentColor?: string;
}

export default function NoteCard({
	note,
	onDelete,
	onValueChange,
	isFirst = false,
	accentColor = "#6200ee",
}: NoteCardProps) {
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
				{ borderLeftColor: accentColor },
			]}
		>

			<View style={styles.noteFooter}>
				<Checkbox
                    value={note.completed}
                    onValueChange={() =>
                        onValueChange(note.id, note.completed ?? false)
                    }
                />
				<TouchableOpacity
					style={styles.deleteButton}
					onPress={() => onDelete(note.id)}
				>
					<Text style={styles.deleteButtonText}>×</Text>
				</TouchableOpacity>
			</View>
			<Text style={styles.noteContent}>{note.content}</Text>
			<Text style={styles.noteDate}>
					{formatDate(note.created_at)}
				</Text>
		</View>
	);
}

const styles = StyleSheet.create({
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
	noteContent: {
		color: "white",
		fontSize: 16,
		lineHeight: 24,
		fontWeight: "400",
		marginBottom: 16,
	},
	noteTypeBadge: {
		backgroundColor: "#ff9800",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
	},
	noteFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 20,
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
