// backend/src/services/dashboardService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';

export class DashboardService {
  /**
   * Farm Manager Dashboard metrics
   */
  public async getFarmManagerDashboard(farmId?: string) {
    let flockQuery = supabaseAdmin.from('flocks').select('id, name, initial_count, current_count, status');
    if (farmId) flockQuery = flockQuery.eq('farm_id', farmId);

    const { data: flocks } = await flockQuery;
    const activeFlocks = (flocks || []).filter((f) => f.status === 'active' || !f.status);
    const totalPopulation = activeFlocks.reduce((sum, f) => sum + (f.current_count || f.initial_count || 0), 0);

    // Egg production today / overall
    const { data: eggRecords } = await supabaseAdmin
      .from('daily_egg_production')
      .select('good_eggs_count, cracked_eggs_count, dirty_eggs_count, broken_eggs_count')
      .limit(100);

    const totalEggs = (eggRecords || []).reduce(
      (sum, r) => sum + (r.good_eggs_count + r.cracked_eggs_count + r.dirty_eggs_count + r.broken_eggs_count),
      0
    );

    // Mortality & Feed
    const { data: healthRecords } = await supabaseAdmin.from('daily_health_records').select('mortality_count').limit(100);
    const totalMortality = (healthRecords || []).reduce((sum, r) => sum + (r.mortality_count || 0), 0);

    const { data: feedRecords } = await supabaseAdmin.from('daily_feed_consumption').select('quantity_kg').limit(100);
    const totalFeedKg = (feedRecords || []).reduce((sum, r) => sum + Number(r.quantity_kg || 0), 0);

    return {
      activeFlocksCount: activeFlocks.length,
      currentPopulation: totalPopulation,
      totalEggProduction: totalEggs,
      hdp: totalPopulation > 0 ? Number(((totalEggs / totalPopulation) * 100).toFixed(2)) : 0,
      totalMortality,
      totalFeedConsumptionKg: totalFeedKg,
      feedStockKg: 12500, // sample stock
      waterConsumptionLiters: 4800,
      eggQualityGradeAShare: '92.5%',
      alertsCount: 2,
      pendingApprovalsCount: 3,
    };
  }

  /**
   * Site Manager Dashboard metrics
   */
  public async getSiteManagerDashboard(siteId?: string) {
    const { data: houses } = await supabaseAdmin.from('houses').select('id, name, farm_id').limit(10);
    const { data: flocks } = await supabaseAdmin.from('flocks').select('id, name, initial_count').limit(10);

    return {
      housesComparison: (houses || []).map((h) => ({ houseId: h.id, houseName: h.name, hdp: 89.2, mortality: 0.15 })),
      flocksComparison: (flocks || []).map((f) => ({ flockId: f.id, flockName: f.name, hdp: 90.1, fcr: 1.95 })),
      recordingCompleteness: '98.5%',
      mortalityTrend: [
        { date: '2026-09-18', mortality: 4 },
        { date: '2026-09-19', mortality: 2 },
        { date: '2026-09-20', mortality: 5 },
        { date: '2026-09-21', mortality: 3 },
        { date: '2026-09-22', mortality: 1 },
      ],
      feedUsageTrend: [
        { date: '2026-09-18', feedKg: 1200 },
        { date: '2026-09-19', feedKg: 1220 },
        { date: '2026-09-20', feedKg: 1190 },
        { date: '2026-09-21', feedKg: 1210 },
        { date: '2026-09-22', feedKg: 1205 },
      ],
      productionTrend: [
        { date: '2026-09-18', hdp: 88.0 },
        { date: '2026-09-19', hdp: 89.5 },
        { date: '2026-09-20', hdp: 89.1 },
        { date: '2026-09-21', hdp: 90.2 },
        { date: '2026-09-22', hdp: 90.8 },
      ],
    };
  }

  /**
   * Technical / Veterinarian Dashboard metrics
   */
  public async getVetDashboard() {
    return {
      recentHealthEventsCount: 1,
      mortalityCauses: [
        { cause: 'Sudden Death Syndrome', count: 8 },
        { cause: 'Heat Stress', count: 3 },
        { cause: 'Egg Peritonitis', count: 2 },
      ],
      medicationStatus: { activeAdministrations: 2, completedThisMonth: 5 },
      vaccinationStatus: { scheduledThisWeek: 1, completedThisWeek: 3 },
      biosecurityScore: '96%',
    };
  }

  /**
   * Inventory Staff Dashboard metrics
   */
  public async getInventoryDashboard() {
    return {
      feedStockSummary: [
        { item: 'Layer Phase 1 Feed', stockKg: 8500, minThresholdKg: 2000, status: 'Normal' },
        { item: 'Layer Phase 2 Feed', stockKg: 1200, minThresholdKg: 2500, status: 'Low Stock' },
      ],
      pendingRequestsCount: 4,
      batchTracking: [
        { batchNo: 'BATCH-2026-09A', product: 'Layer Phase 1', expiry: '2026-12-31' },
      ],
    };
  }

  /**
   * BOD / Organization Admin Dashboard metrics
   */
  public async getBODDashboard() {
    return {
      farmComparison: [
        { farmName: 'North Layer Farm', hdp: 91.2, mortality: 0.12, fcr: 1.92 },
        { farmName: 'South Layer Farm', hdp: 88.7, mortality: 0.18, fcr: 2.01 },
      ],
      productionTrend: [
        { month: 'Jun', eggs: 450000 },
        { month: 'Jul', eggs: 468000 },
        { month: 'Aug', eggs: 482000 },
        { month: 'Sep', eggs: 495000 },
      ],
      costTrend: [
        { month: 'Jun', feedCost: 32000 },
        { month: 'Jul', feedCost: 33100 },
        { month: 'Aug', feedCost: 33800 },
        { month: 'Sep', feedCost: 34200 },
      ],
      overallCompleteness: '99.1%',
      operationalAlerts: 1,
    };
  }
}

export const dashboardService = new DashboardService();
