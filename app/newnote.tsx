"use client";
import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TextInput,
	TouchableOpacity,
	Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import SettingsButton from "../components/SettingsButton";
import BackButton from "../components/BackButton";
import UserHeader from "../components/UserHeader";
import globalStyles from "../styles/globalStyles";
import NoteTypeDropdown, { NoteType } from "../components/NoteType";
import { NotesService } from "../lib/notesService";
import { useAuth } from "../lib/AuthContext";

export default function NewNotes() {
	const { username } = useLocalSearchParams();
	const { user } = useAuth();
	const [text, setText] = useState("");
	const [editing, setEditing] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const inputRef = React.useRef<TextInput>(null);
	const [selectedNoteType, setSelectedNoteType] = useState<NoteType>("MyDay");

	const handleSaveNote = async () => {
		if (text.trim() === "") {
			Alert.alert("Error", "Please enter some text before saving.");
			return;
		}

		if (!user?.id) {
			Alert.alert(
				"Error",
				"User not authenticated. Please log in again."
			);
			return;
		}

		setIsSaving(true);
		try {
			const { data, error } = await NotesService.createNote(
				user.id,
				text.trim(),
				selectedNoteType
			);

			if (error) {
				console.error("Error saving note:", error);
				Alert.alert("Error", "Failed to save note. Please try again.");
				return;
			}

			if (data) {
				console.log("Note saved successfully:", data);
				Alert.alert("Success", `Note saved as ${selectedNoteType}!`);
				setText("");
				setEditing(true);
				inputRef.current && inputRef.current.focus();
			}
		} catch (error) {
			console.error("Exception saving note:", error);
			Alert.alert(
				"Error",
				"An unexpected error occurred. Please try again."
			);
		} finally {
			setIsSaving(false);
		}
	};

	const handleClearNote = () => {
		setText("");
		setEditing(true);
		inputRef.current && inputRef.current.focus();
	};

	return (
		<View style={globalStyles.container}>
			      <UserHeader />

			<SafeAreaView style={globalStyles.content}>
				<Text style={styles.label}>New Note</Text>
				<TextInput
					ref={inputRef}
					style={styles.input}
					placeholder="Type here..."
					value={text}
					onChangeText={setText}
					multiline={true}
					autoFocus
					onSubmitEditing={() => {
						setEditing(false);
						inputRef.current && inputRef.current.blur();
					}}
					onKeyPress={({ nativeEvent }) => {
						if (nativeEvent.key === "Enter") {
							setEditing(false);
							inputRef.current && inputRef.current.blur();
						}
					}}
				/>
				<NoteTypeDropdown
					selectedNoteType={selectedNoteType}
					setSelectedNoteType={setSelectedNoteType}
				/>
			</SafeAreaView>

			<View style={styles.footer}>
				<TouchableOpacity
					style={[
						styles.saveButton,
						isSaving && styles.disabledButton,
					]}
					onPress={handleSaveNote}
					disabled={isSaving}
				>
					<Text style={styles.buttonText}>
						{isSaving ? "Saving..." : "Save Note"}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.clearButton}
					onPress={handleClearNote}
					disabled={isSaving}
				>
					<Text style={styles.buttonText}>Clear Note</Text>
				</TouchableOpacity>
			</View>

			<BackButton
				onPress={() =>
					router.push({ pathname: `./home`, params: { username } })
				}
				variant="circle"
			/>
			<SettingsButton
				variant="circle"
				onPress={() => console.log("Settings from New Notes")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	label: {
		fontSize: 30,
		marginBottom: 10,
		color: "white",
		fontFamily: "serif",
	},
	input: {
		height: "50%",
		width: "100%",
		borderColor: "gray",
		borderWidth: 1,
		padding: 10,
		textAlignVertical: "top",
		color: "white",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingInline: 30,
		paddingBottom: 20,
		backgroundColor: "#121212",
	},
	saveButton: {
		padding: 10,
		backgroundColor: "#6200ee",
		borderRadius: 5,
		flex: 1,
		marginRight: 10,
	},
	clearButton: {
		padding: 10,
		backgroundColor: "#f50057",
		borderRadius: 5,
		flex: 1,
		marginLeft: 10,
	},
	disabledButton: {
		backgroundColor: "#666",
	},
	buttonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "600",
	},
});
