import React from "react";
import { TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
	onPress?: () => void;
	variant?: "default" | "circle"; // default: plain, circle: blue circle
};

export default function ReminderButton({ onPress, variant = "circle" }: Props) {
	const handlePress = () => {
		if (onPress) {
			onPress();
		} else {
			// Default action: show alert that reminders feature is not available
			Alert.alert(
				"Reminders",
				"Reminders feature is not available in this version."
			);
		}
	};

	if (variant === "circle") {
		return (
			<TouchableOpacity
				onPress={handlePress}
				style={styles.circleWrapper}
			>
				<View style={styles.circle}>
					<Feather name="bell" size={20} color="#fff" />
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity onPress={handlePress} style={styles.plain}>
			<Feather name="bell" size={22} color="#6200ee" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	plain: {
		padding: 8,
	},
	circleWrapper: {
		alignSelf: "flex-end",
		marginBottom: 16,
		marginRight: 8,
	},
	circle: {
		backgroundColor: "#6200ee",
		borderRadius: 20,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
	},
});
