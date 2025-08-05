// app/reminder.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ReminderPage() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>All Tasks With Reminders</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: "#fff",
		fontSize: 30,
	},
});
