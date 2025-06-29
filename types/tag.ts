export interface TagProps {
  tag: string;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
}

export interface TagsProps {
  tags: string[];
  className?: string;
  onTagClick?: (tag: string) => void;
  interactive?: boolean;
}