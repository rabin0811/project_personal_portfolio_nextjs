import { Bracket } from "@/components/ui";
import { BlogManager } from "@/components/admin/blog-manager";

export const dynamic = "force-dynamic";

export default function AdminBlogPage() {
  return (
    <div>
      <Bracket>blog manager</Bracket>
      <h1 className="mt-3 font-display text-2xl font-bold">Blog</h1>
      <div className="mt-6">
        <BlogManager />
      </div>
    </div>
  );
}
