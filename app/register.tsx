import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from "react-native";
import AppHeader from "../components/AppHeader";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SettingsButton from "../components/SettingsButton";
import { useAuth } from "../lib/AuthContext";

export default function RegisterScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [username, setUsername] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const { signUp } = useAuth();

	const handleRegister = async () => {
		if (!email || !password || !confirmPassword || !username) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return;
		}

		if (password.length < 6) {
			Alert.alert("Error", "Password must be at least 6 characters long");
			return;
		}

		setLoading(true);
		try {
			const { error } = await signUp(email, password, username);

			if (error) {
				Alert.alert("Registration Failed", error.message);
			} else {
				Alert.alert(
					"Registration Successful! 🎉",
					"Your account has been created successfully. Please check your email to verify your account before signing in.",
					[{ text: "OK", onPress: () => router.replace("/login") }]
				);
			}
		} catch (error) {
			console.error("Registration error:", error);
			Alert.alert(
				"Error",
				"An unexpected error occurred. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<AppHeader compact />

			<View style={styles.card}>
				<View style={styles.headerRow}>
					<TouchableOpacity onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color="#000" />
					</TouchableOpacity>
					<Text style={styles.signUpTitle}>Sign up</Text>
					<SettingsButton
						onPress={() => console.log("Register settings")}
					/>
				</View>

				<Text style={styles.label}>Username</Text>
				<View style={styles.inputWrapper}>
					<Feather
						name="user"
						size={20}
						color="#888"
						style={styles.inputIcon}
					/>
					<TextInput
						style={styles.input}
						placeholder="Enter your username"
						value={username}
						onChangeText={setUsername}
						autoCapitalize="none"
					/>
				</View>

				<Text style={styles.label}>Email</Text>
				<View style={styles.inputWrapper}>
					<Feather
						name="mail"
						size={20}
						color="#888"
						style={styles.inputIcon}
					/>
					<TextInput
						style={styles.input}
						placeholder="Enter your email"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				</View>

				<Text style={styles.label}>Password</Text>
				<View style={styles.inputWrapper}>
					<Feather
						name="lock"
						size={20}
						color="#888"
						style={styles.inputIcon}
					/>
					<TextInput
						style={styles.input}
						placeholder="Enter your password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry={!showPassword}
						autoCapitalize="none"
					/>
					<TouchableOpacity
						onPress={() => setShowPassword(!showPassword)}
					>
						<Feather
							name={showPassword ? "eye-off" : "eye"}
							size={20}
							color="#888"
							style={styles.eyeIcon}
						/>
					</TouchableOpacity>
				</View>

				<Text style={styles.label}>Confirm Password</Text>
				<View style={styles.inputWrapper}>
					<Feather
						name="lock"
						size={20}
						color="#888"
						style={styles.inputIcon}
					/>
					<TextInput
						style={styles.input}
						placeholder="Confirm your password"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry={!showConfirmPassword}
						autoCapitalize="none"
					/>
					<TouchableOpacity
						onPress={() =>
							setShowConfirmPassword(!showConfirmPassword)
						}
					>
						<Feather
							name={showConfirmPassword ? "eye-off" : "eye"}
							size={20}
							color="#888"
							style={styles.eyeIcon}
						/>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					style={[
						styles.registerBtn,
						loading && styles.registerBtnDisabled,
					]}
					onPress={handleRegister}
					disabled={loading}
				>
					<Text style={styles.registerBtnText}>
						{loading ? "Creating account..." : "Create Account"}
					</Text>
				</TouchableOpacity>

				<Text style={styles.loginText}>
					Already have an account?{" "}
					<Text
						style={styles.loginLink}
						onPress={() => router.replace("/login")}
					>
						Sign in
					</Text>
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#320b86",
	},
	card: {
		flex: 1,
		backgroundColor: "#eee",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		padding: 25,
		justifyContent: "flex-start",
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	signUpTitle: {
		fontSize: 22,
		fontWeight: "700",
	},
	label: {
		marginTop: 10,
		fontWeight: "600",
		marginBottom: 4,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ccc",
		paddingHorizontal: 10,
		marginBottom: 12,
	},
	inputIcon: {
		marginRight: 6,
	},
	eyeIcon: {
		marginLeft: 6,
	},
	input: {
		flex: 1,
		paddingVertical: 10,
		fontSize: 16,
	},
	registerBtn: {
		backgroundColor: "#000",
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 20,
	},
	registerBtnDisabled: {
		backgroundColor: "#ccc",
		opacity: 0.7,
	},
	registerBtnText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	loginText: {
		marginTop: 20,
		textAlign: "center",
		color: "#777",
		fontSize: 14,
	},
	loginLink: {
		fontWeight: "bold",
		color: "#000",
	},
});
