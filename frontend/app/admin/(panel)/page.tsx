import Link from "next/link";
import { getPrisma } from "@/lib/db";
import { Bracket } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const prisma = await getPrisma();
  const [projectCount, draftCount, publishedCount, galleryCount, unreadCount] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count({ where: { status: "draft" } }),
    prisma.blogPost.count({ where: { status: "published" } }),
    prisma.galleryImage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);
  const recentMessages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const tiles = [
    { label: "projects", value: projectCount, href: "/admin/projects" },
    { label: "posts published", value: publishedCount, href: "/admin/blog" },
    { label: "drafts", value: draftCount, href: "/admin/blog" },
    { label: "gallery photos", value: galleryCount, href: "/admin/gallery" },
    { label: "unread messages", value: unreadCount, href: "/admin/messages" },
  ];

  return (
    <div>
      <Bracket>dashboard</Bracket>
      <h1 className="mt-3 font-display text-2xl font-bold">Overview</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="border border-line p-4 transition-colors hover:border-ink">
            <p className="font-display text-3xl font-bold">{tile.value}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-mute">{tile.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Bracket>latest messages</Bracket>
        <ul className="mt-4 flex flex-col gap-2">
          {recentMessages.length === 0 && (
            <li className="border border-dashed border-line p-4 font-mono text-xs text-mute">
              No messages yet.
            </li>
          )}
          {recentMessages.map((message) => (
            <li key={message.id} className="border border-line p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.15em]">
                  <span className="text-signal">{message.name}</span>
                  <span className="text-mute"> · {message.email}</span>
                </p>
                <span className={`font-mono text-[10px] uppercase ${message.read ? "text-mute" : "text-signal"}`}>
                  {message.read ? "read" : "unread"}
                </span>
              </div>
              <p className="mt-2 text-sm text-mute">{message.message}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
