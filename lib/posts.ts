import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  id: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  tags?: string[];
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

export async function getAllPosts(): Promise<Post[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id,
        title: data.title,
        date: data.date,
        content,
        excerpt: data.excerpt || content.slice(0, 200) + '...',
        tags: data.tags || [],
      };
    });

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
