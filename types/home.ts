import { PostsData } from "./post"

export interface HomeContentProps {
  initialData: {
    posts: PostsData;
    tags: Array<{ tag: string; count: number }>;
  };
}