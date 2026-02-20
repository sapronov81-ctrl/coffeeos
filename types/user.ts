// types/user.ts

export type UserRole = "owner" | "barista";

export type SubscriptionLevel =
  | "trial"
  | "basic"
  | "pro"
  | "premium";

export interface User {
  id: string;
  role: UserRole;
  subscription_level: SubscriptionLevel;
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  created_at: string;
}
