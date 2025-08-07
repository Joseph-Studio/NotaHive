import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export type NoteType = "Assignments" | "MyDay" | "Important" | "Tasks";

interface NoteTypeDropdownProps {
	selectedNoteType: NoteType;
	setSelectedNoteType: (type: NoteType) => void;
}

const NoteTypeDropdown: React.FC<NoteTypeDropdownProps> = ({
	selectedNoteType,
	setSelectedNoteType,
}) => {
	const handleTypeSwapping = (itemValue: string) => {
		setSelectedNoteType(itemValue as NoteType);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Select Category:</Text>
			<Picker
				selectedValue={selectedNoteType}
				mode="dropdown"
				style={styles.pickerStyle}
				itemStyle={styles.picker}
				onValueChange={(itemValue, itemIndex) =>
					handleTypeSwapping(itemValue as string)
				}
			>
				<Picker.Item label="My Day" value="MyDay" />
				<Picker.Item label="Important" value="Important" />
				<Picker.Item label="Assignments" value="Assignments" />
				<Picker.Item label="Tasks" value="Tasks" />
			</Picker>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingTop: 5,
		paddingBottom: 20,
		width: "100%",
	},
	label: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 2,
	},
	picker: {
		color: "white",
	},
	pickerStyle: {
		marginTop: -20,
		marginBottom: 0,
	},
	selectedText: {
		marginTop: 20,
		fontSize: 16,
		fontWeight: "bold",
		color: "white",
	},
});

export default NoteTypeDropdown;
