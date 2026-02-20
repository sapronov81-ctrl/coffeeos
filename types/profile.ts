export interface CoffeeShopProfile {
  id: string;
  owner_id: string;
  name: string;
  machine_model: string | null;
  grinder_model: string | null;
  water_tds: number | null;
  pump_pressure: number | null;
  boiler_type: string | null;
  preinfusion_available: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}