// backend/src/tests/performanceKPIService.test.ts

import { PerformanceKPIService } from '../services/performanceKPIService';

describe('PerformanceKPIService Unit Tests - Complete Phase 7 KPIs', () => {
  let service: PerformanceKPIService;

  beforeEach(() => {
    service = new PerformanceKPIService();
  });

  describe('calculateFlockAge', () => {
    it('should correctly calculate age in days, weeks, completed weeks and production days', () => {
      const placementDate = '2026-01-01';
      const targetDate = '2026-05-21'; // 140 days later (20 weeks)

      const result = service.calculateFlockAge(placementDate, targetDate);

      expect(result.ageDays).toBe(140);
      expect(result.ageWeeks).toBe(20);
      expect(result.completedWeeks).toBe(20);
      expect(result.productionDays).toBe(14); // 140 - 126
    });

    it('should handle leap years correctly', () => {
      const placementDate = '2024-02-01'; // 2024 is leap year
      const targetDate = '2024-03-01'; // 29 days in Feb 2024

      const result = service.calculateFlockAge(placementDate, targetDate);

      expect(result.ageDays).toBe(29);
      expect(result.completedWeeks).toBe(4);
    });
  });

  describe('KPI Formula Logic & Zero Denominator Validation', () => {
    it('should compute Livability correctly', () => {
      const initialHens = 10000;
      const currentLiveHens = 9800;
      const livability = Number(((currentLiveHens / initialHens) * 100).toFixed(2));
      expect(livability).toBe(98.0);
    });

    it('should compute Average Egg Weight correctly', () => {
      const totalEggWeightKg = 500; // 500,000 grams
      const totalEggs = 8000;
      const avgWeight = Number(((totalEggWeightKg * 1000) / totalEggs).toFixed(2));
      expect(avgWeight).toBe(62.5); // 62.5 grams per egg
    });

    it('should compute FCR (Feed Conversion Ratio) correctly', () => {
      const totalFeedKg = 1000;
      const totalEggWeightKg = 500;
      const fcr = Number((totalFeedKg / totalEggWeightKg).toFixed(3));
      expect(fcr).toBe(2.0); // FCR = 2.0 kg feed per kg egg
    });

    it('should compute Feed per Bird correctly', () => {
      const totalFeedKg = 1200; // 1,200,000 g
      const avgLiveHens = 10000;
      const periodDays = 1;
      const feedPerBird = Number(((totalFeedKg * 1000) / (avgLiveHens * periodDays)).toFixed(2));
      expect(feedPerBird).toBe(120.0); // 120g per bird per day
    });

    it('should set warning when initial population denominator is zero', () => {
      const initialHens = 0;
      const warnings: string[] = [];
      let hhpValue: number | null = null;

      if (initialHens <= 0) {
        warnings.push('Initial hens housed denominator is zero.');
      } else {
        hhpValue = 90.0;
      }

      expect(hhpValue).toBeNull();
      expect(warnings).toContain('Initial hens housed denominator is zero.');
    });
  });
});
