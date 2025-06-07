
export const getSortedAndFilteredNotes = (
  notes: Record<string, string>,
  searchQuery: string,
  sortOrder: 'newest' | 'oldest' | 'alphabetical',
  filterType: 'all' | 'recent' | 'favorites',
  customNoteNames: Record<string, string>,
  formatNoteId: (id: string) => string
) => {
  let filteredNotes = { ...notes };
  
  // Apply search filter
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredNotes = Object.fromEntries(
      Object.entries(notes).filter(([noteId, content]) => {
        const customName = customNoteNames[noteId] || '';
        const formattedId = formatNoteId(noteId);
        
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
    // Consider notes with custom names as "favorites"
    // Also include notes that are longer (more content = more important)
    filteredNotes = Object.fromEntries(
      Object.entries(filteredNotes).filter(([noteId, content]) => {
        const hasCustomName = customNoteNames[noteId] && customNoteNames[noteId].trim() !== '';
        const isLongNote = content.length > 500; // Notes longer than 500 characters
        const hasMultipleParagraphs = content.split('\n').length > 3; // Notes with multiple paragraphs
        
        return hasCustomName || isLongNote || hasMultipleParagraphs;
      })
    );
  }

  // Apply sorting
  const notesArray = Object.entries(filteredNotes);
  
  if (sortOrder === 'newest') {
    notesArray.sort(([a], [b]) => {
      const timestampA = Number(a);
      const timestampB = Number(b);
      // If both are valid timestamps, sort by timestamp
      if (!isNaN(timestampA) && !isNaN(timestampB)) {
        return timestampB - timestampA;
      }
      // If only one is valid, put the valid one first
      if (!isNaN(timestampA)) return -1;
      if (!isNaN(timestampB)) return 1;
      // If neither is valid, sort alphabetically
      return b.localeCompare(a);
    });
  } else if (sortOrder === 'oldest') {
    notesArray.sort(([a], [b]) => {
      const timestampA = Number(a);
      const timestampB = Number(b);
      // If both are valid timestamps, sort by timestamp
      if (!isNaN(timestampA) && !isNaN(timestampB)) {
        return timestampA - timestampB;
      }
      // If only one is valid, put the valid one first
      if (!isNaN(timestampA)) return -1;
      if (!isNaN(timestampB)) return 1;
      // If neither is valid, sort alphabetically
      return a.localeCompare(b);
    });
  } else if (sortOrder === 'alphabetical') {
    notesArray.sort(([a, contentA], [b, contentB]) => {
      const titleA = customNoteNames[a] || contentA.split('\n')[0]?.trim() || 'Untitled';
      const titleB = customNoteNames[b] || contentB.split('\n')[0]?.trim() || 'Untitled';
      return titleA.localeCompare(titleB, undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  return Object.fromEntries(notesArray);
};

// Helper function to get note statistics
export const getNotesStats = (
  notes: Record<string, string>,
  customNoteNames: Record<string, string>
) => {
  const totalNotes = Object.keys(notes).length;
  const notesWithCustomNames = Object.keys(notes).filter(id => 
    customNoteNames[id] && customNoteNames[id].trim() !== ''
  ).length;
  
  const recentCutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const recentNotes = Object.keys(notes).filter(id => {
    const timestamp = Number(id);
    return !isNaN(timestamp) && timestamp > recentCutoff;
  }).length;

  const totalWordCount = Object.values(notes).reduce((acc, content) => {
    return acc + content.split(/\s+/).filter(word => word.length > 0).length;
  }, 0);

  return {
    totalNotes,
    notesWithCustomNames,
    recentNotes,
    totalWordCount
  };
};
