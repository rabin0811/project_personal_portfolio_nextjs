export type ProjectWithImages = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  liveUrl: string | null;
  repoUrl: string | null;
  techTags: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  screenshots: { id: string; projectId: string; url: string; order: number }[];
};
