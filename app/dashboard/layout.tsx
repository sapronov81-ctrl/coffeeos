import { cookies } from "next/headers";
import { ActiveProfileProvider } from "@/context/active-profile-context";
import { getActiveProfileFromToken } from "@/lib/profiles/get-active-profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // В Next 16 cookies() — асинхронный
  const cookieStore = await cookies();

  const token = cookieStore.get("sb-access-token")?.value;

  let profile = null;

  if (token) {
    profile = await getActiveProfileFromToken(token);
  }

  return (
    <ActiveProfileProvider profile={profile}>
      {children}
    </ActiveProfileProvider>
  );
}