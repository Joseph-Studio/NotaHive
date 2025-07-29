import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AppHeader from "../components/AppHeader";

export default function LandingScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<AppHeader />

			<Text style={styles.subtitle}>
				Stay organized, never miss a note or assignment deadline again!
			</Text>

			<TouchableOpacity
				style={styles.button}
				onPress={() => router.replace("/login")}
			>
				<Text style={styles.buttonText}>Get Started</Text>
			</TouchableOpacity>

			<View style={styles.dots}>
				{[0, 1, 2, 3].map((_, i) => (
					<View key={i} style={styles.dot} />
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#320b86",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	subtitle: {
		color: "#fff",
		textAlign: "center",
		fontSize: 16,
		marginBottom: 30,
	},
	button: {
		backgroundColor: "#fff",
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 10,
		marginBottom: 30,
	},
	buttonText: {
		color: "#000",
		fontSize: 18,
		fontWeight: "600",
	},
	dots: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
	},
	dot: {
		width: 10,
		height: 10,
		backgroundColor: "#fff",
		borderRadius: 5,
		marginHorizontal: 5,
	},
});
