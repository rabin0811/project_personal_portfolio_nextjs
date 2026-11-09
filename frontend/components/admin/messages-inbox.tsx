"use client";

import { useCallback, useEffect, useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesInbox() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/messages");
      const json = (await response.json()) as { messages?: Message[]; error?: string };
      if (!response.ok) throw new Error(json.error ?? "Failed to load");
      setMessages(json.messages ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleRead(message: Message) {
    await fetch(`/api/admin/messages/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !message.read }),
    });
    void load();
  }

  async function remove(message: Message) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages/${message.id}`, { method: "DELETE" });
    void load();
  }

  if (error) return <p className="font-mono text-xs text-signal">✗ {error}</p>;
  if (!messages) return <p className="font-mono text-xs text-mute">loading…</p>;

  return (
    <ul className="flex flex-col gap-2">
      {messages.length === 0 && (
        <li className="border border-dashed border-line p-6 text-center font-mono text-xs text-mute">
          No messages yet.
        </li>
      )}
      {messages.map((message) => (
        <li key={message.id} className={`border p-4 ${message.read ? "border-line" : "border-ink"}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.12em]">
              <span className="text-signal">{message.name}</span>
              <span className="text-mute"> · {message.email}</span>
            </p>
            <p className="font-mono text-[10px] uppercase text-mute">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
          <p className="mt-2 whitespace-pre-line text-sm text-mute">{message.message}</p>
          <div className="mt-3 flex gap-4 font-mono text-xs">
            <button type="button" onClick={() => toggleRead(message)} className="text-mute hover:text-ink">
              mark {message.read ? "unread" : "read"}
            </button>
            <button type="button" onClick={() => remove(message)} className="text-mute hover:text-signal">
              delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
