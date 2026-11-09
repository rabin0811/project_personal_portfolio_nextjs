import { Bracket } from "@/components/ui";
import { MessagesInbox } from "@/components/admin/messages-inbox";

export const dynamic = "force-dynamic";

export default function AdminMessagesPage() {
  return (
    <div>
      <Bracket>inbox</Bracket>
      <h1 className="mt-3 font-display text-2xl font-bold">Contact messages</h1>
      <div className="mt-6">
        <MessagesInbox />
      </div>
    </div>
  );
}
