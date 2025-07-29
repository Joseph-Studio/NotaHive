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
		};
	};
};
