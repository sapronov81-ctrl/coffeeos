import { supabaseAdmin } from "@/lib/db/supabase-server";
import { createClient } from "@supabase/supabase-js";

export interface ActiveProfile {
  id: string;
  name: string;
  machine_model: string | null;
  grinder_model: string | null;
  water_tds: number | null;
  pump_pressure: number | null;
  boiler_type: string | null;
  preinfusion_available: boolean;
}

export async function getActiveProfileFromToken(
  token: string
): Promise<ActiveProfile | null> {
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser(token);

  if (!user) return null;

  const { data } = await supabaseAdmin
    .from("coffee_shop_profiles")
    .select("*")
    .eq("owner_id", user.id)
    .eq("is_active", true)
    .single();

  if (!data) return null;

  return data as ActiveProfile;
}