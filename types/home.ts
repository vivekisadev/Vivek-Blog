import { PostMeta, NoteMeta } from "@/types/post"

export interface HomeContentProps {
  initialData: {
    posts: PostMeta[];
    allPosts: PostMeta[];
    notes: NoteMeta[];
    tags: Array<{ tag: string; count: number }>;
    currentPage: number;
    totalPages: number;
  };
}