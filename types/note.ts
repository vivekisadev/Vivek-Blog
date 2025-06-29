export interface Note {
  id: string;
  content: string;
  date: string;
}

export interface NotesData {
  notes: Note[];
  total: number;
  totalPages: number;
}