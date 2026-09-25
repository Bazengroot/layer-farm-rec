import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Egg,
  TrendingUp,
  AlertTriangle,
  Wheat,
  PlusCircle,
  BarChart2,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const todayFormatted = new Intl.DateTimeFormat(i18n.language === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const summaryCards = [
    {
      title: t('dashboard.activeFlocks'),
      value: '4',
      unit: 'Flock',
      trend: '+1 flock aktif',
      icon: Boxes,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: t('dashboard.totalBirds'),
      value: '48,250',
      unit: 'ekor',
      trend: '98.5% kapasitas',
      icon: Layers,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: t('dashboard.todayEggProduction'),
      value: '43,907',
      unit: 'butir',
      trend: '+2.4% vs standar',
      icon: Egg,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: t('dashboard.henDayProduction'),
      value: '91.0%',
      unit: 'HD%',
      trend: 'Standar: 89.5%',
      icon: TrendingUp,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: t('dashboard.feedConsumption'),
      value: '5,355',
      unit: 'kg',
      trend: '111 g/ekor/hari',
      icon: Wheat,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      title: t('dashboard.mortalityRate'),
      value: '0.04%',
      unit: '18 ekor',
      trend: 'Batas toleransi: 0.05%',
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-200 text-xs sm:text-sm font-medium mb-1">
            <Calendar className="h-4 w-4" />
            <span>{todayFormatted}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t('dashboard.welcome')}, {user?.email?.split('@')[0] || 'Operator'}
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            {t('app.name')} — {t('app.tagline')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/daily-recording">
            <Button variant="secondary" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              {t('dashboard.recordToday')}
            </Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <BarChart2 className="h-4 w-4 mr-2" />
              {t('dashboard.viewReports')}
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            {t('dashboard.overview')}
          </h2>
          <Badge variant="info">Phase 0 Initialized</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {card.title}
                    </span>
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {card.value}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {card.unit}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 font-medium flex items-center">
                    {card.trend}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Phase 0 System Status & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-800">
              {t('dashboard.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-slate-800">Inisialisasi Sistem Selesai (Phase 0)</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Modul fondasi, arsitektur database Supabase, konfigurasi i18n multi-bahasa, dan sistem keamanan telah siap.
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Baru saja</span>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-slate-800">Skema Database Siap</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    26 berkas migrasi SQL siap diaplikasikan pada Supabase PostgreSQL (Organisasi, Kandang, Flock, Pakan, Telur, Kesehatan, KPI).
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">v0.1.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-800">
              Status Sistem & Lisensi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Versi Aplikasi</span>
              <span className="font-semibold text-slate-800">{t('app.version')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Bahasa Default</span>
              <span className="font-semibold text-slate-800">Bahasa Indonesia (id)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Backend API</span>
              <span className="font-semibold text-emerald-600">Terhubung</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Lingkungan</span>
              <Badge variant="default">Development</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
