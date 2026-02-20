import { cookies } from "next/headers";
import DashboardRouter from "./components/dashboard-router";
import { getActiveProfileFromToken } from "@/lib/profiles/get-active-profile";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  // 1️⃣ unwrap searchParams (Next 16 requirement)
  const params = await searchParams;

  // 2️⃣ unwrap cookies (Next 16 requirement)
  const cookieStore = await cookies();

  const token = cookieStore.get("sb-access-token")?.value;

  let profile = null;

  if (token) {
    profile = await getActiveProfileFromToken(token);
  }

  const view = params?.view ?? "chat";

  return (
    <DashboardRouter
      view={view}
      profile={profile}
    />
  );
}