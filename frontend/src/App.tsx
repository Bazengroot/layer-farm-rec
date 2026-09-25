import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppShell } from '@/layouts/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OrganizationsPage } from '@/pages/OrganizationsPage';
import { FarmsPage } from '@/pages/FarmsPage';
import { SitesPage } from '@/pages/SitesPage';
import { HousesPage } from '@/pages/HousesPage';
import { GenericReferencePage } from '@/pages/GenericReferencePage';
import { UsersPage } from '@/pages/UsersPage';
import { DailyRecordingPage } from '@/pages/DailyRecordingPage';
import { ApprovalDashboard } from '@/pages/ApprovalDashboard';
import { CorrectionPage } from '@/pages/CorrectionPage';
import { EggGradeConfigPage } from '@/pages/EggGradeConfigPage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Construction } from 'lucide-react';

const PlaceholderModule: React.FC<{ title: string; phase: string }> = ({ title, phase }) => {
  const { t } = useTranslation();
  return (
    <Card className="max-w-2xl mx-auto my-12 text-center">
      <CardHeader>
        <div className="mx-auto w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-2">
          <Construction className="w-6 h-6" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 text-sm mb-4">
          {t('dashboard.phase0Note')}
        </p>
        <Badge variant="warning">{phase}</Badge>
      </CardContent>
    </Card>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Shell Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell>
              <HomePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizations"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <OrganizationsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <FarmsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sites"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <SitesPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/houses"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <HousesPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/breeds"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <GenericReferencePage tableName="breeds" titleKey="master_data.breeds" descKey="master_data.breedsDesc" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/strains"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <GenericReferencePage tableName="strains" titleKey="master_data.strains" descKey="master_data.strainsDesc" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <GenericReferencePage tableName="suppliers" titleKey="master_data.suppliers" descKey="master_data.suppliersDesc" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed-types"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <GenericReferencePage tableName="feed_types" titleKey="master_data.feedTypes" descKey="master_data.feedTypesDesc" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/medications"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <GenericReferencePage tableName="medication_products" titleKey="master_data.medications" descKey="master_data.medicationsDesc" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vaccines"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <GenericReferencePage tableName="vaccines" titleKey="master_data.vaccines" descKey="master_data.vaccinesDesc" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/egg-grades"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <GenericReferencePage tableName="egg_grades" titleKey="master_data.eggGrades" descKey="master_data.eggGradesDesc" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/warehouses"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <GenericReferencePage tableName="warehouses" titleKey="master_data.warehouses" descKey="master_data.warehousesDesc" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/units"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <GenericReferencePage tableName="units" titleKey="master_data.units" descKey="master_data.unitsDesc" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute requiredPermission="users:manage">
            <AppShell>
              <UsersPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/flocks"
        element={
          <ProtectedRoute requiredPermission="flock:create">
            <AppShell>
              <FlocksPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/egg-grading-config"
        element={
          <ProtectedRoute requiredPermission="master_data:manage">
            <AppShell>
              <EggGradeConfigPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/corrections"
        element={
          <ProtectedRoute requiredPermission="recording:create">
            <AppShell>
              <CorrectionPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/approvals"
        element={
          <ProtectedRoute requiredPermission="recording:approve">
            <AppShell>
              <ApprovalDashboard />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/daily-recording"
        element={
          <ProtectedRoute requiredPermission="recording:create">
            <AppShell>
              <DailyRecordingPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/egg-production"
        element={
          <ProtectedRoute>
            <AppShell>
              <PlaceholderModule title="Produksi & Grading Telur" phase="Tersedia di Phase 4" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <AppShell>
              <PlaceholderModule title="Manajemen & Konsumsi Pakan" phase="Tersedia di Phase 5" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/health"
        element={
          <ProtectedRoute>
            <AppShell>
              <PlaceholderModule title="Kesehatan, Bobot & Vaksinasi" phase="Tersedia di Phase 6" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <AppShell>
              <PlaceholderModule title="Laporan & Analisis KPI" phase="Tersedia di Phase 7" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppShell>
              <PlaceholderModule title="Pengaturan & Hak Akses" phase="Tersedia di Phase 1" />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
