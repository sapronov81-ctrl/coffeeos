"use client";

import { useSearchParams } from "next/navigation";

export default function ChatScreen() {
  const params = useSearchParams();
  const query = params.get("query");

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl mb-6">Chat Mode</h2>
      <div className="bg-neutral-900 p-4 rounded-xl">
        <p className="text-neutral-400">User Query:</p>
        <p>{query}</p>
      </div>
    </div>
  );
}