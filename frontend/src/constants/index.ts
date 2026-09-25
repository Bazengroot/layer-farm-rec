// ── Application Constants ─────────────────────────────────────────────────────

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'LFRMS';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.1.0';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
export const DEFAULT_LOCALE = (import.meta.env.VITE_DEFAULT_LOCALE as 'en' | 'id') || 'id';

// ── Poultry Domain Constants ──────────────────────────────────────────────────

/** Standard layer breeds commonly used in Indonesia */
export const COMMON_BREEDS = ['Isa Brown', 'Lohmann Brown', 'Hy-Line Brown', 'Bovans Brown', 'Dekalb', 'Other'];

/** Minimum laying age in weeks (Sumatran standard) */
export const MIN_LAYING_AGE_WEEKS = 17;

/** Standard peak production target (%) */
export const PEAK_PRODUCTION_TARGET_PCT = 90;

/** Warning threshold for mortality rate (%) */
export const MORTALITY_WARNING_PCT = 0.5;

/** Critical threshold for mortality rate (%) */
export const MORTALITY_CRITICAL_PCT = 1.0;

// ── Routes ───────────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  // Farm Management
  FARMS: '/farms',
  FARMS_NEW: '/farms/new',
  FARMS_DETAIL: '/farms/:id',
  SITES: '/sites',
  HOUSES: '/houses',
  // Flock Management
  FLOCKS: '/flocks',
  FLOCKS_NEW: '/flocks/new',
  FLOCKS_DETAIL: '/flocks/:id',
  PLACEMENTS: '/placements',
  // Daily Recording
  DAILY_RECORDING: '/daily-recording',
  // Egg Production
  EGG_PRODUCTION: '/egg-production',
  EGG_GRADING: '/egg-grading',
  EGG_QUALITY: '/egg-quality',
  EGG_INVENTORY: '/egg-inventory',
  // Feed Management
  FEED_MANAGEMENT: '/feed-management',
  FEED_REQUEST: '/feed-management/request',
  FEED_RECEIVING: '/feed-management/receiving',
  FEED_INVENTORY: '/feed-management/inventory',
  FEED_CONSUMPTION: '/feed-management/consumption',
  // Health
  HEALTH: '/health-management',
  MEDICATIONS: '/health-management/medications',
  VACCINATIONS: '/health-management/vaccinations',
  BODY_WEIGHT: '/health-management/body-weight',
  // Reports
  REPORTS: '/reports',
  KPI_DASHBOARD: '/kpi',
  // Admin
  MASTER_DATA: '/master-data',
  SETTINGS: '/settings',
  USERS: '/users',
  AUDIT_LOG: '/audit-log',
} as const;

// ── Permission Codes ──────────────────────────────────────────────────────────

export const PERMISSIONS = {
  VIEW_FARM: 'view_farm',
  MANAGE_FARM: 'manage_farm',
  VIEW_FLOCK: 'view_flock',
  MANAGE_FLOCK: 'manage_flock',
  CREATE_RECORDING: 'create_recording',
  EDIT_RECORDING: 'edit_recording',
  APPROVE_RECORDING: 'approve_recording',
  VIEW_REPORTS: 'view_reports',
  MANAGE_USERS: 'manage_users',
  MANAGE_MASTER_DATA: 'manage_master_data',
  VIEW_AUDIT_LOG: 'view_audit_log',
} as const;

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS];
