export interface NotesPaginationProps {
  initialNotes: Array<{
    id: string;
    content: string;
    date: string;
  }>;
  initialTotal: number;
  initialPage: number;
  totalPages: number;
}