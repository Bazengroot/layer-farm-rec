# Database Migrations — LFRMS

This directory contains the complete set of PostgreSQL schema migration files for the **Layer Farm Recording & Management System (LFRMS)** designed for Supabase.

---

## 1. Migration Execution Order

Migrations are ordered with numeric prefixes (`001_` through `020_`) and must be executed in exact sequential order:

| Prefix | File | Purpose |
|---|---|---|
| `001_` | `001_extensions.sql` | Enable required extensions (`uuid-ossp`, `pgcrypto`) |
| `002_` | `002_schema.sql` | Core schema (Organizations, Farms, Sites, Houses, Flocks, Placements, Profiles, RBAC, Audit) |
| `003_` | `003_master_data.sql` | Master reference tables (Breed profiles, Suppliers, Customers, Equipment) |
| `004_` | `004_roles_and_permissions.sql` | System roles, granular permission definitions, and default role-permission matrix |
| `005_` | `005_daily_recording.sql` | Daily operational logging tables (Mortality, Culling, Environmental parameters) |
| `006_` | `006_daily_recording_rls.sql` | Row Level Security (RLS) policies for daily recording entities |
| `007_` | `007_egg_production.sql` | Egg collection, grading categories, and egg inventory tables |
| `008_` | `008_egg_grading.sql` | Detailed egg grading specifications and batch weight recordings |
| `009_` | `009_egg_quality.sql` | Egg quality tracking (Haugh unit, yolk color, shell strength, defects) |
| `010_` | `010_egg_inventory.sql` | Egg stock movements, sales dispatches, and warehouse reconciliations |
| `011_` | `011_egg_rls.sql` | Row Level Security policies for egg production and inventory |
| `012_` | `012_feed_master.sql` | Feed types, formulations, nutrient standards, and supplier catalogs |
| `012_` | `012_health_master.sql` | Disease catalog, vaccine master, medication formulary, and withdrawal periods |
| `013_` | `013_feed_requests.sql` | Feed purchase and transfer requisition workflows |
| `014_` | `014_feed_receiving.sql` | Feed intake, quality verification, moisture test, and weighbridge checks |
| `015_` | `015_feed_inventory.sql` | Feed silo / warehouse bin inventory balances and transactions |
| `016_` | `016_feed_issue.sql` | Feed issuance from storage to specific houses / silos |
| `017_` | `017_feed_consumption.sql` | Daily flock feed consumption recording and intake calculations |
| `018_` | `018_feed_rls.sql` | Row Level Security policies for feed management tables |
| `019_` | `019_daily_health_records.sql` | Daily health observations, treatments, veterinary visits, post-mortems |
| `020_` | `020_kpi_master.sql` | KPI definitions, formulas, and target benchmarks |
| `020_` | `020_kpi_functions.sql` | PL/pgSQL mathematical calculation functions (HD%, HH%, FCR, Egg Mass) |
| `020_` | `020_kpi_materialized_views.sql` | Performance materialized views for aggregate weekly and batch reporting |
| `020_` | `020_kpi_refresh_functions.sql` | Triggers and procedures for scheduled or event-driven view refreshes |
| `020_` | `020_kpi_rls.sql` | Row Level Security policies for KPI tables and views |
| `020_` | `020_kpi_permissions.sql` | RBAC permissions for accessing operational and executive reports |

---

## 2. Applying Migrations via Supabase CLI

```bash
# 1. Login to Supabase CLI
npx supabase login

# 2. Link your local repository to your remote Supabase project
npx supabase link --project-ref <YOUR_PROJECT_REF>

# 3. Apply all pending migrations to remote database
npx supabase db push

# 4. Optional: Run demo seed data
psql "<DATABASE_URL>" -f database/seeds/001_seed_demo_org.sql
```

---

## 3. Applying Migrations via Supabase Dashboard SQL Editor

If executing manually without Supabase CLI:
1. Open your Supabase Project Dashboard -> **SQL Editor**.
2. Run migration scripts sequentially starting from `001_extensions.sql` through `020_kpi_permissions.sql`.
3. Finally, execute `database/seeds/001_seed_demo_org.sql` to load demo farm entities.
