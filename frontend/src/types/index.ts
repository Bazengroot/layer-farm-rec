// ── Domain Types ─────────────────────────────────────────────────────────────

export type UUID = string;

export interface Organization {
  id: UUID;
  organization_code: string;
  organization_name: string;
  legal_name?: string;
  timezone: string;
  country: string;
  address?: string;
  phone?: string;
  email?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: UUID;
  organization_id: UUID;
  farm_code: string;
  farm_name: string;
  farm_type: FarmType;
  location?: string;
  province?: string;
  city?: string;
  address?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type FarmType =
  | 'Layer Farm'
  | 'Pullet Farm'
  | 'Breeder Farm'
  | 'Hatchery'
  | 'Feedmill'
  | 'Other';

export interface Site {
  id: UUID;
  farm_id: UUID;
  site_code: string;
  site_name: string;
  site_manager_id?: UUID;
  address?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface House {
  id: UUID;
  site_id: UUID;
  house_code: string;
  house_name: string;
  house_type: HouseType;
  capacity: number;
  cage_system: CageSystem;
  floor_area_m2: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type HouseType =
  | 'Open House'
  | 'Closed House'
  | 'Environmentally Controlled House'
  | 'Pullets House'
  | 'Layer House';

export type CageSystem =
  | 'Conventional Cage'
  | 'Enriched Cage'
  | 'Aviary'
  | 'Floor System'
  | 'Other';

export interface Flock {
  id: UUID;
  organization_id: UUID;
  farm_id: UUID;
  site_id: UUID;
  house_id: UUID;
  flock_code: string;
  flock_name?: string;
  breed?: string;
  strain?: string;
  source_supplier?: string;
  placement_date: string;
  placement_age_weeks?: number;
  initial_population?: number;
  current_population?: number;
  sex?: string;
  flock_status: FlockStatus;
  production_cycle: ProductionCycle;
  expected_end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type FlockStatus = 'Planned' | 'Active' | 'Transferred' | 'Closed' | 'Archived';
export type ProductionCycle = 'Pullet' | 'Rearing' | 'Laying' | 'Spent Hen';

// ── User / Auth Types ─────────────────────────────────────────────────────────

export interface Profile {
  id: UUID;
  auth_uid: UUID;
  organization_id: UUID;
  full_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  roles?: Role[];
}

export interface Role {
  id: UUID;
  code: string;
  name: string;
  description?: string;
}

export interface Permission {
  id: UUID;
  code: string;
  description?: string;
}

// ── Daily Recording Types ─────────────────────────────────────────────────────

export type RecordStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Correction Requested';

export interface DailyFlockRecord {
  id: UUID;
  organization_id: UUID;
  farm_id: UUID;
  site_id: UUID;
  house_id: UUID;
  flock_id: UUID;
  record_date: string;
  status: RecordStatus;
  recorder_profile_id?: UUID;
  created_at: string;
  updated_at: string;
}

// ── KPI Types ─────────────────────────────────────────────────────────────────

export interface KpiSummary {
  flock_id: UUID;
  date: string;
  age_weeks: number;
  hen_day_production_pct: number;
  hen_housed_production_pct: number;
  mortality_rate_pct: number;
  fcr: number;
  egg_mass_g: number;
  feed_intake_g: number;
}

// ── Shared Utility Types ──────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
}

export interface SelectOption {
  value: string;
  label: string;
}
