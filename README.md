# Layer Farm Recording & Management System (LFRMS)

**Sistem Pencatatan & Manajemen Ayam Petelur Komersial**

LFRMS is an enterprise poultry farm management web application engineered for commercial layer farm operations. It supports the end-to-end recording cycle including flock placements, daily mortality, egg collection & grading, feed logistics, health management, and operational KPI calculations (Hen-Day %, Hen-Housed %, FCR, Egg Mass).

---

## Architecture & Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, i18next (Default: Bahasa Indonesia, bilingual with English).
- **Backend:** Node.js, Express, TypeScript, Supabase Auth JWKS verification, RBAC permissions.
- **Database:** Supabase PostgreSQL with 26 migration files, automated population triggers, and Row Level Security (RLS).
- **Design System:** Professional Blue/Slate Enterprise UI with responsive desktop sidebar and mobile navigation.

---

## Directory Structure

```
layer-farm-record/
├── frontend/           # React + TypeScript + Vite SPA
├── backend/            # Express REST API
├── database/           # PostgreSQL migrations & seed files
│   ├── migrations/     # 26 schema & RLS migrations
│   └── seeds/          # Demo organization seeds
├── docs/               # System documentation & specifications
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-specification.md
│   ├── business-logic.md
│   ├── testing.md
│   └── deployment.md
└── package.json
```

---

## Getting Started

### 1. Configure Environment Variables

Copy the example environment files and update them with your Supabase credentials:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Run in Development Mode

```bash
# Terminal 1: Backend API (port 4000)
cd backend
npm run dev

# Terminal 2: Frontend App (port 5173)
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser. The default interface is displayed in **Bahasa Indonesia** with instant switching to **English**.

---

## Health & Status Check

- Backend health endpoint: `GET http://localhost:4000/api/health`
- API documentation: See `docs/api-specification.md`
