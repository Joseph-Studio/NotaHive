import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReminderCard from "./ReminderCard";

interface Reminder {
	id: string;
	title: string;
	description?: string;
	dueDate: Date;
	isCompleted: boolean;
	createdAt: Date;
}

interface ReminderListProps {
	reminders: Reminder[];
	onToggleComplete: (id: string, completed: boolean) => void;
	onEdit?: (id: string) => void;
	onDelete: (id: string) => void;
	onAddReminder?: () => void;
	showCompleted?: boolean;
}

export default function ReminderList({
	reminders,
	onToggleComplete,
	onEdit,
	onDelete,
	onAddReminder,
	showCompleted = true,
}: ReminderListProps) {
	const [sortBy, setSortBy] = useState<"dueDate" | "created">("dueDate");
	const [showCompletedLocal, setShowCompletedLocal] = useState(showCompleted);

	const filteredReminders = reminders.filter((reminder) =>
		showCompletedLocal ? true : !reminder.isCompleted
	);

	const sortedReminders = [...filteredReminders].sort((a, b) => {
		switch (sortBy) {
			case "dueDate":
				return a.dueDate.getTime() - b.dueDate.getTime();
			case "created":
				return b.createdAt.getTime() - a.createdAt.getTime();
			default:
				return 0;
		}
	});

	const renderSortButton = (
		type: "dueDate" | "created",
		label: string,
		icon: string
	) => (
		<TouchableOpacity
			style={[
				styles.sortButton,
				sortBy === type && styles.activeSortButton,
			]}
			onPress={() => setSortBy(type)}
		>
			<Ionicons
				name={icon as any}
				size={16}
				color={sortBy === type ? "#6200ee" : "#888"}
			/>
			<Text
				style={[
					styles.sortButtonText,
					sortBy === type && styles.activeSortButtonText,
				]}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);

	const renderReminder = ({
		item,
		index,
	}: {
		item: Reminder;
		index: number;
	}) => (
		<ReminderCard
			id={item.id}
			title={item.title}
			description={item.description}
			dueDate={item.dueDate}
			isCompleted={item.isCompleted}
			onToggleComplete={onToggleComplete}
			onEdit={onEdit}
			onDelete={onDelete}
			isFirst={index === 0}
		/>
	);

	const getStats = () => {
		const total = reminders.length;
		const completed = reminders.filter((r) => r.isCompleted).length;
		const overdue = reminders.filter(
			(r) => !r.isCompleted && r.dueDate < new Date()
		).length;
		const dueToday = reminders.filter((r) => {
			const today = new Date();
			const reminderDate = r.dueDate;
			return (
				!r.isCompleted &&
				reminderDate.toDateString() === today.toDateString()
			);
		}).length;

		return { total, completed, overdue, dueToday };
	};

	const stats = getStats();

	if (reminders.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Ionicons name="alarm-outline" size={64} color="#666" />
				<Text style={styles.emptyTitle}>No Reminders Yet</Text>
				<Text style={styles.emptySubtitle}>
					Create your first reminder to get started!
				</Text>
				{onAddReminder && (
					<TouchableOpacity
						style={styles.addButton}
						onPress={onAddReminder}
					>
						<Ionicons name="add" size={24} color="white" />
						<Text style={styles.addButtonText}>Add Reminder</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Stats Section */}
			<View style={styles.statsContainer}>
				<View style={styles.statItem}>
					<Text style={styles.statNumber}>{stats.total}</Text>
					<Text style={styles.statLabel}>Total</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={[styles.statNumber, { color: "#4caf50" }]}>
						{stats.completed}
					</Text>
					<Text style={styles.statLabel}>Done</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={[styles.statNumber, { color: "#f44336" }]}>
						{stats.overdue}
					</Text>
					<Text style={styles.statLabel}>Overdue</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={[styles.statNumber, { color: "#ff9800" }]}>
						{stats.dueToday}
					</Text>
					<Text style={styles.statLabel}>Today</Text>
				</View>
			</View>

			{/* Controls Section */}
			<View style={styles.controlsContainer}>
				<View style={styles.sortContainer}>
					<Text style={styles.sortLabel}>Sort by:</Text>
					<View style={styles.sortButtons}>
						{renderSortButton(
							"dueDate",
							"Due Date",
							"time-outline"
						)}
						{renderSortButton(
							"created",
							"Created",
							"calendar-outline"
						)}
					</View>
				</View>

				<TouchableOpacity
					style={[
						styles.toggleButton,
						showCompletedLocal && styles.activeToggleButton,
					]}
					onPress={() => setShowCompletedLocal(!showCompletedLocal)}
				>
					<Ionicons
						name={showCompletedLocal ? "eye" : "eye-off"}
						size={16}
						color={showCompletedLocal ? "#6200ee" : "#888"}
					/>
					<Text
						style={[
							styles.toggleButtonText,
							showCompletedLocal && styles.activeToggleButtonText,
						]}
					>
						Completed
					</Text>
				</TouchableOpacity>
			</View>

			{/* Reminders List */}
			<FlatList
				data={sortedReminders}
				renderItem={renderReminder}
				keyExtractor={(item) => item.id}
				style={styles.list}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.listContent}
			/>

			{/* Add Button */}
			{onAddReminder && (
				<TouchableOpacity
					style={styles.floatingAddButton}
					onPress={onAddReminder}
				>
					<Ionicons name="add" size={28} color="white" />
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
		backgroundColor: "#121212",
	},
	emptyTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
		marginTop: 16,
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 16,
		color: "#888",
		textAlign: "center",
		marginBottom: 32,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		backgroundColor: "#1e1e1e",
		paddingVertical: 16,
		marginHorizontal: 16,
		marginTop: 8,
		marginBottom: 16,
		borderRadius: 12,
	},
	statItem: {
		alignItems: "center",
	},
	statNumber: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	statLabel: {
		fontSize: 12,
		color: "#888",
		marginTop: 4,
	},
	controlsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		marginBottom: 16,
	},
	sortContainer: {
		flex: 1,
	},
	sortLabel: {
		color: "#888",
		fontSize: 12,
		marginBottom: 8,
	},
	sortButtons: {
		flexDirection: "row",
		gap: 8,
	},
	sortButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		backgroundColor: "#2a2a2a",
		gap: 4,
	},
	activeSortButton: {
		backgroundColor: "#e8eaf6",
	},
	sortButtonText: {
		fontSize: 12,
		color: "#888",
	},
	activeSortButtonText: {
		color: "#6200ee",
		fontWeight: "600",
	},
	toggleButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 16,
		backgroundColor: "#2a2a2a",
		gap: 4,
	},
	activeToggleButton: {
		backgroundColor: "#e8eaf6",
	},
	toggleButtonText: {
		fontSize: 12,
		color: "#888",
	},
	activeToggleButtonText: {
		color: "#6200ee",
		fontWeight: "600",
	},
	list: {
		flex: 1,
	},
	listContent: {
		paddingHorizontal: 16,
		paddingBottom: 100,
	},
	addButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#6200ee",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 24,
		gap: 8,
	},
	addButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	floatingAddButton: {
		position: "absolute",
		bottom: 20,
		right: 20,
		backgroundColor: "#6200ee",
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
});
