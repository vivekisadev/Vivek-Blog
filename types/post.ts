export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags: string[];
}

export interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  content: string;
}

export interface PostsData {
  posts: Post[];
  total: number;
  totalPages: number;
}

export interface PostsByYear {
  [year: string]: Post[];
}