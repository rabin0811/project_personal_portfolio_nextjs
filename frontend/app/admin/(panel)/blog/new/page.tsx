import Link from "next/link";
import { Bracket } from "@/components/ui";
import { BlockEditor } from "@/components/admin/block-editor";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div>
      <Link href="/admin/blog" className="font-mono text-xs uppercase tracking-[0.15em] text-mute hover:text-signal">
        ‹ back
      </Link>
      <div className="mt-4">
        <Bracket>new entry</Bracket>
        <div className="mt-6">
          <BlockEditor post={null} />
        </div>
      </div>
    </div>
  );
}
