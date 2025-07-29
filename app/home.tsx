import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Alert,
} from "react-native";
import { useRouter } from "expo-router";
import SettingsButton from "../components/SettingsButton";
import UserHeader from "../components/UserHeader";
import { useAuth } from "../lib/AuthContext";

export const sections = [
	{ label: "My Day", route: "myday", count: 0 },
	{ label: "Important", route: "important", count: 0 },
	{ label: "Assignments", route: "assignments", count: 0 },
	{ label: "Tasks", route: "tasks", count: 0 },
	{ label: "All Notes", route: "allnotes", count: 0 },
];

export default function HomePage() {
	const router = useRouter();
	const { user, signOut } = useAuth();

	const handleLogout = async () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Logout",
				style: "destructive",
				onPress: async () => {
					await signOut();
					router.replace("/login");
				},
			},
		]);
	};

	const username =
		user?.user_metadata?.username || user?.email?.split("@")[0] || "User";
	const userEmail = user?.email || "";

	return (
		<View style={styles.container}>
			<UserHeader username={username} email={userEmail} />
			<ScrollView style={styles.menu}>
				{sections.map((item, index) => (
					<TouchableOpacity
						key={index}
						style={styles.menuItem}
						onPress={() => router.push(`/${item.route}`)}
					>
						<Text style={styles.menuText}>{item.label}</Text>
						<Text style={styles.count}>
							{item.count === 0
								? "0"
								: String(item.count).padStart(2, "0")}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>

			<SettingsButton variant="circle" onPress={handleLogout} />

			<TouchableOpacity
				style={styles.newNote}
				onPress={() => router.push("/newnote")}
			>
				<Text style={styles.newNoteText}>+ New Note</Text>
			</TouchableOpacity>
		</View>
	);
}

export const updateSectionCount = (route: string, increase: number) => {
	const section = sections.find((s) => s.route === route);
	if (section) {
		section.count = section.count + increase;
	}
	const allNotesSection = sections.find((s) => s.route === "allnotes");
	if (allNotesSection) {
		allNotesSection.count = allNotesSection.count + increase;
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
		padding: 16,
		paddingTop: 50,
		justifyContent: "space-between",
	},
	menu: {
		flexGrow: 1,
	},
	menuItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#2e2e2e",
		padding: 15,
		borderRadius: 8,
		marginBottom: 12,
	},
	menuText: {
		color: "#fff",
		fontWeight: "600",
	},
	count: {
		color: "#fff",
		fontWeight: "600",
	},
	newNote: {
		backgroundColor: "#2e2e2e",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	newNoteText: {
		color: "#fff",
		fontWeight: "600",
	},
});
