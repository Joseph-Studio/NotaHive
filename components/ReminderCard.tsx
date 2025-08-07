import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReminderCardProps {
	id: string;
	title: string;
	description?: string;
	dueDate: Date;
	isCompleted: boolean;
	onToggleComplete: (id: string, completed: boolean) => void;
	onEdit?: (id: string) => void;
	onDelete: (id: string) => void;
	isFirst?: boolean;
}

export default function ReminderCard({
	id,
	title,
	description,
	dueDate,
	isCompleted,
	onToggleComplete,
	onEdit,
	onDelete,
	isFirst = false,
}: ReminderCardProps) {
	const getPriorityColor = (selectedNoteType: string) => {
		return "#6200ee"; // Default purple color
	};

	const formatDueDate = (date: Date) => {
		const now = new Date();
		const diffTime = date.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 0) {
			return "Overdue";
		} else if (diffDays === 0) {
			return "Due today";
		} else if (diffDays === 1) {
			return "Due tomorrow";
		} else {
			return `Due in ${diffDays} days`;
		}
	};

	const getDueDateStyle = () => {
		const now = new Date();
		const diffTime = dueDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 0) {
			return styles.overdue;
		} else if (diffDays === 0) {
			return styles.dueToday;
		} else if (diffDays <= 3) {
			return styles.dueSoon;
		}
		return styles.dueNormal;
	};

	const handleDelete = () => {
		Alert.alert(
			"Delete Reminder",
			"Are you sure you want to delete this reminder?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: () => onDelete(id),
				},
			]
		);
	};

	return (
		<View
			style={[
				styles.reminderCard,
				isFirst && styles.firstCard,
				{ borderLeftColor: getPriorityColor("") },
				isCompleted && styles.completedCard,
			]}
		>
			<View style={styles.reminderHeader}>
				<TouchableOpacity
					style={[
						styles.checkboxContainer,
						isCompleted && styles.checkboxCompleted,
					]}
					onPress={() => onToggleComplete(id, !isCompleted)}
				>
					{isCompleted && (
						<Ionicons name="checkmark" size={16} color="white" />
					)}
				</TouchableOpacity>

				<Text
					style={[
						styles.priorityBadge,
						{ backgroundColor: getPriorityColor("") },
					]}
				>
					REMINDER
				</Text>

				<View style={styles.actionButtons}>
					{onEdit && (
						<TouchableOpacity
							style={styles.editButton}
							onPress={() => onEdit(id)}
						>
							<Ionicons name="pencil" size={16} color="#2196f3" />
						</TouchableOpacity>
					)}
					<TouchableOpacity
						style={styles.deleteButton}
						onPress={handleDelete}
					>
						<Ionicons name="trash" size={16} color="#f50057" />
					</TouchableOpacity>
				</View>
			</View>

			<Text
				style={[
					styles.reminderTitle,
					isCompleted && styles.completedText,
				]}
			>
				{title}
			</Text>

			{description && (
				<Text
					style={[
						styles.reminderDescription,
						isCompleted && styles.completedText,
					]}
				>
					{description}
				</Text>
			)}

			<View style={styles.reminderFooter}>
				<Text style={[styles.dueDate, getDueDateStyle()]}>
					{formatDueDate(dueDate)}
				</Text>
				<Text style={styles.timestamp}>
					{dueDate.toLocaleDateString()} at{" "}
					{dueDate.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	reminderCard: {
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
	completedCard: {
		opacity: 0.7,
		backgroundColor: "#1a1a1a",
	},
	reminderHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	checkboxContainer: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#666",
		backgroundColor: "transparent",
		justifyContent: "center",
		alignItems: "center",
	},
	checkboxCompleted: {
		backgroundColor: "#4caf50",
		borderColor: "#4caf50",
	},
	priorityBadge: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
		color: "white",
		fontSize: 12,
		fontWeight: "600",
		textAlign: "center",
		minWidth: 60,
	},
	actionButtons: {
		flexDirection: "row",
		gap: 8,
	},
	editButton: {
		backgroundColor: "#e3f2fd",
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	deleteButton: {
		backgroundColor: "#fce4ec",
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	reminderTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
		marginBottom: 8,
	},
	reminderDescription: {
		color: "#ccc",
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 16,
	},
	completedText: {
		textDecorationLine: "line-through",
		color: "#888",
	},
	reminderFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	dueDate: {
		fontSize: 12,
		fontWeight: "600",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	overdue: {
		backgroundColor: "#f44336",
		color: "white",
	},
	dueToday: {
		backgroundColor: "#ff9800",
		color: "white",
	},
	dueSoon: {
		backgroundColor: "#2196f3",
		color: "white",
	},
	dueNormal: {
		backgroundColor: "#4caf50",
		color: "white",
	},
	timestamp: {
		color: "#888",
		fontSize: 11,
		fontWeight: "500",
	},
});
