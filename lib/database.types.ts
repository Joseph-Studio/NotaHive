export type Database = {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					email: string;
					username: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					email: string;
					username: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					username?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			notes: {
				Row: {
					id: string;
					user_id: string;
					title: string;
					content: string;
					note_type: "MyDay" | "Important" | "Assignments" | "Tasks";
					created_at: string;
					updated_at: string;
					completed: boolean;
				};
				Insert: {
					id?: string;
					user_id: string;
					title: string;
					content: string;
					note_type: "MyDay" | "Important" | "Assignments" | "Tasks";
					created_at?: string;
					updated_at?: string;
					completed: boolean;
				};
				Update: {
					id?: string;
					user_id?: string;
					title?: string;
					content?: string;
					note_type?: "MyDay" | "Important" | "Assignments" | "Tasks";
					created_at?: string;
					updated_at?: string;
					completed: boolean;
				};
			};
		};
	};
};
