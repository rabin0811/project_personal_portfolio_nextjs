import { getPrisma } from "@/lib/db";
import { site } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const prisma = await getPrisma();
  const [projects, posts] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      select: { slug: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "published", publishedAt: { not: null } },
      select: { slug: true },
    }),
  ]);

  const base = site.url;
  const staticRoutes = ["", "/about", "/work", "/gallery", "/blog", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    }),
  );

  return [
    ...staticRoutes,
    ...projects.map((project) => ({
      url: `${base}/work/${project.slug}`,
      lastModified: new Date(),
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(),
    })),
  ];
}
