
export const getSortedAndFilteredNotes = (
  notes: Record<string, string>,
  searchQuery: string,
  sortOrder: 'newest' | 'oldest' | 'alphabetical',
  filterType: 'all' | 'recent' | 'favorites',
  customNoteNames: Record<string, string>,
  formatNoteId: (id: string) => string
) => {
  let filteredNotes = notes;
  
  // Apply search filter
  if (searchQuery) {
    filteredNotes = Object.fromEntries(
      Object.entries(notes).filter(([noteId, content]) => {
        const customName = customNoteNames[noteId] || '';
        const formattedId = formatNoteId(noteId);
        const query = searchQuery.toLowerCase();
        return (
          customName.toLowerCase().includes(query) ||
          formattedId.toLowerCase().includes(query) ||
          content.toLowerCase().includes(query)
        );
      })
    );
  }

  // Apply type filter
  if (filterType === 'recent') {
    const recentCutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago
    filteredNotes = Object.fromEntries(
      Object.entries(filteredNotes).filter(([noteId]) => {
        const timestamp = Number(noteId);
        return !isNaN(timestamp) && timestamp > recentCutoff;
      })
    );
  } else if (filterType === 'favorites') {
    // For now, consider notes with custom names as "favorites"
    // In a real app, this would check a favorites flag in the database
    filteredNotes = Object.fromEntries(
      Object.entries(filteredNotes).filter(([noteId]) => {
        return customNoteNames[noteId] && customNoteNames[noteId].trim() !== '';
      })
    );
  }

  // Apply sorting
  const notesArray = Object.entries(filteredNotes);
  if (sortOrder === 'newest') {
    notesArray.sort(([a], [b]) => Number(b) - Number(a));
  } else if (sortOrder === 'oldest') {
    notesArray.sort(([a], [b]) => Number(a) - Number(b));
  } else if (sortOrder === 'alphabetical') {
    notesArray.sort(([a, contentA], [b, contentB]) => {
      const titleA = customNoteNames[a] || contentA.split('\n')[0] || '';
      const titleB = customNoteNames[b] || contentB.split('\n')[0] || '';
      return titleA.localeCompare(titleB);
    });
  }

  return Object.fromEntries(notesArray);
};
