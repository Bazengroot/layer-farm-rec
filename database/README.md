# Database Architecture — LFRMS

This directory hosts all database assets for the **Layer Farm Recording & Management System (LFRMS)**.

## Structure

```
database/
├── migrations/         # 26 versioned PostgreSQL DDL & RLS migration files
│   └── README.md       # Migration sequence and execution instructions
└── seeds/              # Seed scripts for demonstration and baseline master data
    └── 001_seed_demo_org.sql
```

## Security & Row Level Security (RLS)

All primary tables in LFRMS enforce strict Row Level Security (RLS) scoped by `organization_id`:
- Users can only query and mutate records belonging to their affiliated organization.
- Audit logging triggers record user ID and timestamp on critical operational tables.
- System roles (`superadmin`, `farm_manager`, `site_supervisor`, `flock_officer`, `vet`, `operator`) control operational capabilities across modules.
