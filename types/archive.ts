import { PostsByYear } from "./post"

export interface ArchiveContentProps {
  initialData: {
    postsByYear: PostsByYear;
    tags: Array<{ tag: string; count: number }>;
  };
}