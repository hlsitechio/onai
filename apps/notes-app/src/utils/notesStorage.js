// Notes storage utility for local storage operations

export const getNotes = () => {
  try {
    return JSON.parse(localStorage.getItem('notes') || '[]');
  } catch (error) {
    console.error('Error reading notes from local storage:', error);
    return [];
  }
};

export const saveNote = (note) => {
  try {
    const notes = getNotes();
    const existingNoteIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingNoteIndex >= 0) {
      // Update existing note
      notes[existingNoteIndex] = { ...notes[existingNoteIndex], ...note, last_modified: new Date().toISOString() };
    } else {
      // Add new note
      notes.push({
        ...note,
        id: note.id || Date.now().toString(),
        created_at: note.created_at || new Date().toISOString(),
        last_modified: new Date().toISOString()
      });
    }
    
    localStorage.setItem('notes', JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error saving note to local storage:', error);
    return false;
  }
};

export const deleteNote = (noteId) => {
  try {
    const notes = getNotes().filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error deleting note from local storage:', error);
    return false;
  }
};

export const getNoteById = (noteId) => {
  try {
    return getNotes().find(note => note.id === noteId) || null;
  } catch (error) {
    console.error('Error getting note by ID:', error);
    return null;
  }
};
