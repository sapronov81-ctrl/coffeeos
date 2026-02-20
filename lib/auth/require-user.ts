import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function requireUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("sb-access-token")?.value;

  if (!token) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  return user;
}