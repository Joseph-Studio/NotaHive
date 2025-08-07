import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface AppHeaderProps {
	compact?: boolean;
}

export default function AppHeader({ compact = false }: AppHeaderProps) {
	return (
		<View style={styles.header}>
			<Text style={[styles.title, compact && styles.titleCompact]}>
				Welcome{"\n"}To
			</Text>
			<Image
				source={require("../assets/NotaHiveLogo2.png")}
				style={[styles.image, compact && styles.imageCompact]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		alignItems: "center",
		marginTop: 60,
		marginBottom: 20,
	},

	title: {
		fontSize: 48,
		color: "#fff",
		textAlign: "center",
		fontFamily: "Cochin",
		fontWeight: "bold",
		marginBottom: 20,
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
	},
	titleCompact: {
		fontSize: 40,
		marginBottom: 20,
	},
	image: {
		width: 400,
		height: 400,
	},
	imageCompact: {
		width: 320,
		height: 320,
	},
});
