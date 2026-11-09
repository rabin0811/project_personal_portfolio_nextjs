import { Bracket } from "@/components/ui";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const dynamic = "force-dynamic";

export default function AdminGalleryPage() {
  return (
    <div>
      <Bracket>gallery manager</Bracket>
      <h1 className="mt-3 font-display text-2xl font-bold">Gallery</h1>
      <div className="mt-6">
        <GalleryManager />
      </div>
    </div>
  );
}
