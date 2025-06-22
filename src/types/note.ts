
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

export interface NoteCategory {
  value: string;
  label: string;
  color: string;
}

export interface NoteFilters {
  category?: string;
  tags?: string[];
  searchTerm?: string;
  isFavorite?: boolean;
}
