export interface Post {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
}

export interface PostsData {
  posts: Post[];
  total: number;
  totalPages: number;
}

export interface PostsByYear {
  [year: string]: Post[];
}