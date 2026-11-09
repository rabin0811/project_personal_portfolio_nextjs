"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  publishedAt: string | null;
};

export function BlogManager() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/blog");
      const json = (await response.json()) as { posts?: Post[]; error?: string };
      if (!response.ok) throw new Error(json.error ?? "Failed to load");
      setPosts(json.posts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function togglePublish(post: Post) {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: post.status === "published" ? "unpublish" : "publish" }),
    });
    void load();
  }

  async function remove(post: Post) {
    if (!confirm(`Delete post "${post.title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
    void load();
  }

  if (error) return <p className="font-mono text-xs text-signal">✗ {error}</p>;
  if (!posts) return <p className="font-mono text-xs text-mute">loading…</p>;

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center gap-3 border border-line p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold">{post.title}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
                /blog/{post.slug} · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "no date"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 font-mono text-xs">
              <span className={`uppercase ${post.status === "published" ? "text-signal" : "text-mute"}`}>
                {post.status}
              </span>
              <button type="button" onClick={() => togglePublish(post)} className="text-mute hover:text-ink">
                {post.status === "published" ? "unpublish" : "publish"}
              </button>
              <Link href={`/admin/blog/${post.id}`} className="text-signal hover:underline">edit</Link>
              <button type="button" onClick={() => remove(post)} className="text-mute hover:text-signal">✕</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Link href="/admin/blog/new" className="inline-block border border-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] hover:bg-ink hover:text-paper">
          + new entry
        </Link>
      </div>
    </div>
  );
}
