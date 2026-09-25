// backend/src/services/performanceKPIService.ts

import { supabaseAdmin } from '../utils/supabaseAdmin';

export interface KPIContext {
  dateRange: { startDate: string; endDate: string };
  flock: { id: string; name: string };
  house: { id: string; name: string };
  farm: { id: string; name: string };
}

export interface KPIResult {
  code: string;
  name: string;
  value: number | null;
  unit: string;
  formula: string;
  warnings: string[];
  completeness: string;
  missingData: boolean;
  context: KPIContext;
}

export class PerformanceKPIService {
  /**
   * Helper to calculate flock age metrics
   */
  public calculateFlockAge(placementDateStr: string, targetDateStr: string) {
    const placement = new Date(placementDateStr);
    const target = new Date(targetDateStr);
    const diffTime = Math.max(0, target.getTime() - placement.getTime());
    const ageDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const ageWeeks = Number((ageDays / 7).toFixed(1));
    const completedWeeks = Math.floor(ageDays / 7);

    // Production days assume laying starts around day 126 (week 18)
    const productionDays = Math.max(0, ageDays - 126);

    return {
      ageDays,
      ageWeeks,
      completedWeeks,
      productionDays,
    };
  }

  /**
   * Compute all comprehensive KPIs for a given flock and date range
   */
  public async computeFlockKPIs(
    flockId: string,
    startDateStr: string,
    endDateStr: string
  ): Promise<KPIResult[]> {
    const kpis: KPIResult[] = [];

    // 1. Fetch Flock details with House and Farm relations
    const { data: flock, error: flockErr } = await supabaseAdmin
      .from('flocks')
      .select('*, house:houses(id, name, farm:farms(id, name))')
      .eq('id', flockId)
      .single();

    if (flockErr || !flock) {
      throw new Error(`Flock not found with id: ${flockId}`);
    }

    const initialHens = flock.initial_count || flock.quantity || 0;
    const placementDate = flock.placement_date || flock.created_at;

    const houseObj = Array.isArray(flock.house) ? flock.house[0] : flock.house;
    const farmObj = houseObj?.farm ? (Array.isArray(houseObj.farm) ? houseObj.farm[0] : houseObj.farm) : null;

    const context: KPIContext = {
      dateRange: { startDate: startDateStr, endDate: endDateStr },
      flock: { id: flock.id, name: flock.name || `Flock ${flock.id}` },
      house: { id: houseObj?.id || '', name: houseObj?.name || 'N/A' },
      farm: { id: farmObj?.id || '', name: farmObj?.name || 'N/A' },
    };

    // Calculate age as of end date
    const ageInfo = this.calculateFlockAge(placementDate, endDateStr);

    kpis.push({
      code: 'flock_age_days',
      name: 'Flock Age (Days)',
      value: ageInfo.ageDays,
      unit: 'days',
      formula: 'End Date - Placement Date',
      warnings: [],
      completeness: '100%',
      missingData: false,
      context,
    });

    kpis.push({
      code: 'flock_age_weeks',
      name: 'Flock Age (Weeks)',
      value: ageInfo.ageWeeks,
      unit: 'weeks',
      formula: 'Age Days / 7',
      warnings: [],
      completeness: '100%',
      missingData: false,
      context,
    });

    kpis.push({
      code: 'flock_age_completed_weeks',
      name: 'Flock Age (Completed Weeks)',
      value: ageInfo.completedWeeks,
      unit: 'weeks',
      formula: 'Floor(Age Days / 7)',
      warnings: [],
      completeness: '100%',
      missingData: false,
      context,
    });

    kpis.push({
      code: 'flock_age_production_days',
      name: 'Age in Production Days',
      value: ageInfo.productionDays,
      unit: 'days',
      formula: 'Max(0, Age Days - 126)',
      warnings: [],
      completeness: '100%',
      missingData: false,
      context,
    });

    // 2. Fetch Aggregates from Database
    const { data: eggData } = await supabaseAdmin.rpc('get_flock_total_eggs', {
      p_flock_id: flockId,
      p_start_date: startDateStr,
      p_end_date: endDateStr,
    });
    const totalEggs = Number(eggData || 0);

    const { data: mortData } = await supabaseAdmin.rpc('get_flock_total_mortality', {
      p_flock_id: flockId,
      p_start_date: startDateStr,
      p_end_date: endDateStr,
    });
    const totalMortality = Number(mortData || 0);

    const { data: cullData } = await supabaseAdmin.rpc('get_flock_total_culling', {
      p_flock_id: flockId,
      p_start_date: startDateStr,
      p_end_date: endDateStr,
    });
    const totalCulling = Number(cullData || 0);

    const { data: feedKgData } = await supabaseAdmin.rpc('get_flock_total_feed_kg', {
      p_flock_id: flockId,
      p_start_date: startDateStr,
      p_end_date: endDateStr,
    });
    const totalFeedKg = Number(feedKgData || 0);

    const { data: eggWeightKgData } = await supabaseAdmin.rpc('get_flock_total_egg_weight_kg', {
      p_flock_id: flockId,
      p_start_date: startDateStr,
      p_end_date: endDateStr,
    });
    const totalEggWeightKg = Number(eggWeightKgData || 0);

    const { data: feedCostData } = await supabaseAdmin.rpc('get_flock_total_feed_cost', {
      p_flock_id: flockId,
      p_start_date: startDateStr,
      p_end_date: endDateStr,
    });
    const totalFeedCost = Number(feedCostData || 0);

    // Period days calculation
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const periodDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    // Live hen populations
    const currentLiveHens = Math.max(0, initialHens - totalMortality - totalCulling);
    const avgLiveHens = (initialHens + currentLiveHens) / 2;

    // HDP (Hen-Day Production)
    const hdpWarnings: string[] = [];
    let hdpValue: number | null = null;
    if (avgLiveHens <= 0) {
      hdpWarnings.push('Average live hens denominator is zero or negative.');
    } else {
      const expectedEggDays = avgLiveHens * periodDays;
      hdpValue = Number(((totalEggs / expectedEggDays) * 100).toFixed(2));
    }
    kpis.push({
      code: 'hdp',
      name: 'Hen-Day Egg Production',
      value: hdpValue,
      unit: '%',
      formula: 'Total eggs / (Average live hens × Days) × 100',
      warnings: hdpWarnings,
      completeness: '100%',
      missingData: totalEggs === 0 && avgLiveHens > 0,
      context,
    });

    // HHP (Hen-Housed Production)
    const hhpWarnings: string[] = [];
    let hhpValue: number | null = null;
    if (initialHens <= 0) {
      hhpWarnings.push('Initial hens housed denominator is zero.');
    } else {
      const expectedHousedEggDays = initialHens * periodDays;
      hhpValue = Number(((totalEggs / expectedHousedEggDays) * 100).toFixed(2));
    }
    kpis.push({
      code: 'hhp',
      name: 'Hen-Housed Egg Production',
      value: hhpValue,
      unit: '%',
      formula: 'Total eggs / (Initial hens housed × Days) × 100',
      warnings: hhpWarnings,
      completeness: '100%',
      missingData: totalEggs === 0 && initialHens > 0,
      context,
    });

    // Mortality (%)
    const mortWarnings: string[] = [];
    let mortValue: number | null = null;
    if (initialHens <= 0) {
      mortWarnings.push('Initial hens population denominator is zero.');
    } else {
      mortValue = Number(((totalMortality / initialHens) * 100).toFixed(2));
    }
    kpis.push({
      code: 'mortality_rate',
      name: 'Mortality Rate',
      value: mortValue,
      unit: '%',
      formula: 'Mortality quantity / Initial housed population × 100',
      warnings: mortWarnings,
      completeness: '100%',
      missingData: false,
      context,
    });

    // Culling (%)
    const cullWarnings: string[] = [];
    let cullValue: number | null = null;
    if (initialHens <= 0) {
      cullWarnings.push('Initial hens population denominator is zero.');
    } else {
      cullValue = Number(((totalCulling / initialHens) * 100).toFixed(2));
    }
    kpis.push({
      code: 'culling_rate',
      name: 'Culling Rate',
      value: cullValue,
      unit: '%',
      formula: 'Culling quantity / Initial housed population × 100',
      warnings: cullWarnings,
      completeness: '100%',
      missingData: false,
      context,
    });

    // Livability (%)
    const livabilityWarnings: string[] = [];
    let livabilityValue: number | null = null;
    if (initialHens <= 0) {
      livabilityWarnings.push('Initial housed population denominator is zero.');
    } else {
      livabilityValue = Number(((currentLiveHens / initialHens) * 100).toFixed(2));
    }
    kpis.push({
      code: 'livability',
      name: 'Livability',
      value: livabilityValue,
      unit: '%',
      formula: 'Current live population / Initial housed population × 100',
      warnings: livabilityWarnings,
      completeness: '100%',
      missingData: false,
      context,
    });

    // Average Egg Weight (g)
    const eggWeightWarnings: string[] = [];
    let avgEggWeightValue: number | null = null;
    if (totalEggs <= 0) {
      eggWeightWarnings.push('Total eggs produced denominator is zero.');
    } else {
      // (Total Egg Weight in kg * 1000) / total eggs -> grams
      avgEggWeightValue = Number(((totalEggWeightKg * 1000) / totalEggs).toFixed(2));
    }
    kpis.push({
      code: 'avg_egg_weight',
      name: 'Average Egg Weight',
      value: avgEggWeightValue,
      unit: 'g',
      formula: 'Total egg weight (g) / Total eggs',
      warnings: eggWeightWarnings,
      completeness: '100%',
      missingData: totalEggs === 0,
      context,
    });

    // Egg Mass (kg)
    kpis.push({
      code: 'egg_mass',
      name: 'Total Egg Mass',
      value: Number(totalEggWeightKg.toFixed(2)),
      unit: 'kg',
      formula: 'Total egg weight in kg',
      warnings: [],
      completeness: '100%',
      missingData: false,
      context,
    });

    // Feed per Bird (g/bird/day)
    const feedBirdWarnings: string[] = [];
    let feedPerBirdValue: number | null = null;
    if (avgLiveHens <= 0) {
      feedBirdWarnings.push('Average live birds denominator is zero.');
    } else {
      // (Total Feed Kg * 1000) / (Average Live Hens * periodDays)
      feedPerBirdValue = Number(((totalFeedKg * 1000) / (avgLiveHens * periodDays)).toFixed(2));
    }
    kpis.push({
      code: 'feed_per_bird',
      name: 'Feed Per Bird',
      value: feedPerBirdValue,
      unit: 'g/bird/day',
      formula: 'Feed consumed (g) / (Average live birds × Days)',
      warnings: feedBirdWarnings,
      completeness: '100%',
      missingData: totalFeedKg === 0 && avgLiveHens > 0,
      context,
    });

    // FCR (Feed Conversion Ratio = Feed Consumed kg / Egg Mass kg)
    const fcrWarnings: string[] = [];
    let fcrValue: number | null = null;
    if (totalEggWeightKg <= 0) {
      fcrWarnings.push('Total egg mass denominator is zero.');
    } else {
      fcrValue = Number((totalFeedKg / totalEggWeightKg).toFixed(3));
    }
    kpis.push({
      code: 'fcr',
      name: 'Feed Conversion Ratio (FCR)',
      value: fcrValue,
      unit: 'ratio',
      formula: 'Feed consumed (kg) / Egg mass (kg)',
      warnings: fcrWarnings,
      completeness: '100%',
      missingData: totalFeedKg === 0 || totalEggWeightKg === 0,
      context,
    });

    // Feed Cost per Egg
    const costEggWarnings: string[] = [];
    let costPerEggValue: number | null = null;
    if (totalEggs <= 0) {
      costEggWarnings.push('Total eggs denominator is zero.');
    } else {
      costPerEggValue = Number((totalFeedCost / totalEggs).toFixed(4));
    }
    kpis.push({
      code: 'feed_cost_per_egg',
      name: 'Feed Cost Per Egg',
      value: costPerEggValue,
      unit: 'currency/egg',
      formula: 'Total feed cost / Total eggs',
      warnings: costEggWarnings,
      completeness: '100%',
      missingData: totalFeedCost === 0 || totalEggs === 0,
      context,
    });

    // Feed Cost per kg Egg Mass
    const costMassWarnings: string[] = [];
    let costPerKgMassValue: number | null = null;
    if (totalEggWeightKg <= 0) {
      costMassWarnings.push('Total egg mass denominator is zero.');
    } else {
      costPerKgMassValue = Number((totalFeedCost / totalEggWeightKg).toFixed(2));
    }
    kpis.push({
      code: 'feed_cost_per_kg_egg_mass',
      name: 'Feed Cost Per Kg Egg Mass',
      value: costPerKgMassValue,
      unit: 'currency/kg',
      formula: 'Total feed cost / Total egg mass (kg)',
      warnings: costMassWarnings,
      completeness: '100%',
      missingData: totalFeedCost === 0 || totalEggWeightKg === 0,
      context,
    });

    return kpis;
  }
}

export const performanceService = new PerformanceKPIService();
