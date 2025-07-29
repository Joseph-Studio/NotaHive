import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../lib/AuthContext";

export default function UserHeader() {
	const { user } = useAuth();

	const username =
		user?.user_metadata?.username || user?.email?.split("@")[0] || "User";
	const email = user?.email || `${username}@example.com`;
	const initial = username?.[0]?.toUpperCase() ?? "U";

	return (
		<View style={styles.profile}>
			<View style={styles.avatar}>
				<Text style={styles.avatarText}>{initial}</Text>
			</View>
			<View>
				<Text style={styles.name}>{username} ⌄</Text>
				<Text style={styles.email}>{email}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	profile: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 30,
	},
	avatar: {
		backgroundColor: "#d81b60",
		borderRadius: 30,
		width: 50,
		height: 50,
		marginRight: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	avatarText: {
		color: "#fff",
		fontWeight: "bold",
	},
	name: {
		color: "#fff",
		fontWeight: "700",
	},
	email: {
		color: "#bbb",
		fontSize: 12,
	},
});
