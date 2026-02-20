"use client";

import SettingsScreen from "./settings-screen";
import AuditScreen from "./audit-screen";

export default function DashboardRouter({
  view,
  profile,
}: {
  view: string;
  profile: any;
}) {
  if (view === "settings") {
    return <SettingsScreen profile={profile} />;
  }

  if (view === "audit") {
    return <AuditScreen profile={profile} />;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold">
        CoffeeOS Dashboard
      </h1>
      <p className="mt-4 text-neutral-400">
        Active profile: {profile?.name || "None"}
      </p>
    </div>
  );
}