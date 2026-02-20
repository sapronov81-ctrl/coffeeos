import { supabaseAdmin } from "@/lib/db/supabase-server";
import { getProfileLimit } from "@/lib/subscriptions/profile-limits";
import { CoffeeShopProfile } from "@/types/profile";

/**
 * Получить все профили пользователя
 */
export async function getUserProfiles(
  userId: string
): Promise<CoffeeShopProfile[]> {
  const { data, error } = await supabaseAdmin
    .from("coffee_shop_profiles")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch profiles");
  }

  return data as CoffeeShopProfile[];
}

/**
 * Создать новый профиль с проверкой лимита
 */
export async function createProfile(
  userId: string,
  name: string
): Promise<void> {
  if (!name || name.trim().length === 0) {
    throw new Error("Profile name is required");
  }

  // Получаем пользователя
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("subscription_level")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    throw new Error("User not found");
  }

  const profileLimit = getProfileLimit(user.subscription_level);

  // Считаем профили
  const { count, error: countError } = await supabaseAdmin
    .from("coffee_shop_profiles")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId);

  if (countError) {
    throw new Error("Failed to check profile count");
  }

  const currentCount = count ?? 0;

  if (currentCount >= profileLimit) {
    throw new Error("Profile limit reached for your subscription plan");
  }

  const isFirstProfile = currentCount === 0;

  const { error: insertError } = await supabaseAdmin
    .from("coffee_shop_profiles")
    .insert({
      owner_id: userId,
      name: name.trim(),
      is_active: isFirstProfile,
    });

  if (insertError) {
    throw new Error("Profile creation failed");
  }
}

/**
 * Активировать профиль
 */
export async function activateProfile(
  userId: string,
  profileId: string
): Promise<void> {
  // Деактивируем все
  await supabaseAdmin
    .from("coffee_shop_profiles")
    .update({ is_active: false })
    .eq("owner_id", userId);

  // Активируем выбранный
  const { error } = await supabaseAdmin
    .from("coffee_shop_profiles")
    .update({ is_active: true })
    .eq("id", profileId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error("Activation failed");
  }
}

/**
 * Удалить профиль
 */
export async function deleteProfile(
  userId: string,
  profileId: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("coffee_shop_profiles")
    .delete()
    .eq("id", profileId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error("Delete failed");
  }
}