# Notes Storage Setup Guide

This guide will help you set up note storage functionality in your NotaHive app using Supabase.

## Prerequisites

- Supabase project already set up (see `SUPABASE_SETUP.md`)
- Environment variables configured in `app.json`

## Step 1: Create the Notes Table

Run the following SQL script in your Supabase SQL editor:

```sql
-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  note_type TEXT NOT NULL CHECK (note_type IN ('MyDay', 'Important', 'Assignments', 'Tasks')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN NOT NULL
);

-- Create timestamp update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating timestamps
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_notes_updated_at'
  ) THEN
    CREATE TRIGGER update_notes_updated_at
      BEFORE UPDATE ON notes
      FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END $$;
```

## Step 2: Files Created/Modified

The following files have been created or modified to implement note storage:

### New Files:

- `lib/notesService.ts` - Service class for all note-related database operations
- `notes_table_setup.sql` - SQL script for creating the notes table
- `NOTES_SETUP.md` - This setup guide

### Modified Files:

- `lib/database.types.ts` - Added notes table type definitions
- `app/newnote.tsx` - Updated to save notes to Supabase
- `app/home.tsx` - Updated to load real note counts from Supabase
- `app/myday.tsx` - Updated to display actual MyDay notes with delete functionality

## Step 3: Features Implemented

### ✅ Note Creation

- Users can create notes with different types (MyDay, Important, Assignments, Tasks)
- Each note includes a `completed` status (Boolean, see `completedNote` in the app) to track if a note is finished
- Notes are automatically saved to Supabase with user authentication
- Real-time validation and error handling

### ✅ Note Display

- Home page shows real-time note counts for each category
- MyDay page displays actual notes with timestamps
- Notes are sorted by creation date (newest first)

### ✅ Note Management

- Users can mark notes as completed or not completed (using the `completed` field)
- Users can delete their own notes
- Confirmation dialogs for destructive actions
- Automatic UI updates after operations

### ✅ Security

- Row Level Security (RLS) policies ensure users can only access their own notes
- User authentication required for all operations
- Proper error handling and user feedback

## Step 4: Testing the Implementation

1. **Create a Note:**

   - Navigate to the "New Note" screen
   - Enter some text
   - Select a note type
   - Tap "Save Note"
   - You should see a success message

2. **View Note Counts:**

   - Return to the home screen
   - The note counts should update to reflect your new note
   - The "All Notes" count should include all your notes

3. **View Notes:**
   - Navigate to "My Day" (or any other category)
   - You should see your notes displayed with timestamps
   - Try deleting a note to test the delete functionality

## Step 5: Extending to Other Categories

To implement the same functionality for other note categories (Important, Assignments, Tasks), follow the same pattern as `myday.tsx`:

1. Update the respective page file (e.g., `important.tsx`, `assignments.tsx`, `tasks.tsx`)
2. Change the `noteType` parameter in `NotesService.getUserNotesByType()` to match the category
3. Use the `completed` field to filter or display completed/incomplete notes as needed
4. Update the title and styling as needed

## Troubleshooting

### Common Issues:

1. **"Table does not exist" error:**

   - Make sure you've run the SQL script in your Supabase SQL editor
   - Check that the table name is exactly `notes` (lowercase)

2. **"Permission denied" error:**

   - Verify that RLS policies are created correctly
   - Ensure the user is authenticated
   - Check that the `user_id` field matches the authenticated user's ID

3. **Notes not appearing:**

   - Check the browser console for errors
   - Verify that the note was actually saved (check Supabase dashboard)
   - Ensure the note type matches exactly (case-sensitive)

4. **Counts not updating:**
   - The home page should refresh automatically when you return to it
   - If not, try navigating away and back to the home screen

### Debug Tips:

- Check the browser console for detailed error messages
- Use the Supabase dashboard to verify data is being saved
- Test with a simple note first to isolate any issues

## Next Steps

Once the basic functionality is working, you might want to consider:

1. **Note Editing:** Add the ability to edit existing notes
2. **Search:** Implement note search functionality
3. **Categories:** Add custom note categories
4. **Sharing:** Allow users to share notes
5. **Offline Support:** Add offline note creation with sync when online
6. **Rich Text:** Support for formatted text, images, etc.

## Support

If you encounter any issues, check:

1. The browser console for error messages
2. The Supabase dashboard for database issues
3. The network tab for API call failures
4. This guide for common solutions
