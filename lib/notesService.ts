import { supabase } from "./supabase.Client";
import { Database } from "./database.types";

type Note = Database["public"]["Tables"]["notes"]["Row"];
type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"];
type NoteUpdate = Database["public"]["Tables"]["notes"]["Update"];

export class NotesService {
	// Create a new note
	static async createNote(
userId: string, title: string, content: string, noteType: NoteInsert["note_type"], completedNote: boolean	): Promise<{ data: Note | null; error: any }> {
		try {
			const { data, error } = await supabase
				.from("notes")
				.insert({
					user_id: userId,
					title: title,
					content: content,
					note_type: noteType,
					completed: completedNote
				})
				.select()
				.single();

			if (error) {
				console.error("Error creating note:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception creating note:", error);
			return { data: null, error };
		}
	}

	// Get all notes for a user
	static async getUserNotes(
		userId: string
	): Promise<{ data: Note[] | null; error: any }> {
		try {
			const { data, error } = await supabase
				.from("notes")
				.select("*")
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching user notes:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception fetching user notes:", error);
			return { data: null, error };
		}
	}

	// Get notes by type for a user
	static async getUserNotesByType(
		userId: string,
		noteType: Note["note_type"]
	): Promise<{ data: Note[] | null; error: any }> {
		try {
			const { data, error } = await supabase
				.from("notes")
				.select("*")
				.eq("user_id", userId)
				.eq("note_type", noteType)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching notes by type:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception fetching notes by type:", error);
			return { data: null, error };
		}
	}

	// Update a note
	static async updateNote(
		noteId: string,
		updates: Partial<NoteUpdate>
	): Promise<{ data: Note | null; error: any }> {
		try {
			const { data, error } = await supabase
				.from("notes")
				.update(updates)
				.eq("id", noteId)
				.select()
				.single();

			if (error) {
				console.error("Error updating note:", error);
				return { data: null, error };
			}

			return { data, error: null };
		} catch (error) {
			console.error("Exception updating note:", error);
			return { data: null, error };
		}
	}

	static async updateNoteCompleted(noteId: string, completed: boolean) {
    return supabase
        .from('notes')
        .update({ completed })
        .eq('id', noteId)
        .single();
	}

	// Delete a note
	static async deleteNote(noteId: string): Promise<{ error: any }> {
		try {
			const { error } = await supabase
				.from("notes")
				.delete()
				.eq("id", noteId);

			if (error) {
				console.error("Error deleting note:", error);
				return { error };
			}

			return { error: null };
		} catch (error) {
			console.error("Exception deleting note:", error);
			return { error };
		}
	}

	// Get note counts by type for a user
	static async getNoteCountsByType(
		userId: string
	): Promise<{ data: Record<string, number> | null; error: any }> {
		try {
			const { data, error } = await supabase
				.from("notes")
				.select("note_type")
				.eq("user_id", userId);

			if (error) {
				console.error("Error fetching note counts:", error);
				return { data: null, error };
			}

			const counts: Record<string, number> = {
				MyDay: 0,
				Important: 0,
				Assignments: 0,
				Tasks: 0,
			};

			data?.forEach((note) => {
				counts[note.note_type] = (counts[note.note_type] || 0) + 1;
			});

			return { data: counts, error: null };
		} catch (error) {
			console.error("Exception fetching note counts:", error);
			return { data: null, error };
		}
	}
}
