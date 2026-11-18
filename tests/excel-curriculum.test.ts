import { describe, it, expect } from 'vitest';
import {
  EXCEL_MODULES,
  EXCEL_TIERS,
  TOTAL_EXCEL_MODULES,
  TOTAL_EXCEL_TIERS,
  EXCEL_CURRICULUM_STATS,
  getAllTiers,
  getTier,
  getModulesByTier,
  getModuleByNumber,
  getModuleById,
  getCurriculumStats,
  type ExcelTierNumber,
  type ExcelTierSlug,
} from '../src/modules/excel/curriculum';

describe('Excel Curriculum Architecture & Data Integrity', () => {
  describe('Module Sequence & Counts', () => {
    it('should have exactly 16 modules defined in EXCEL_MODULES', () => {
      expect(EXCEL_MODULES).toHaveLength(16);
      expect(TOTAL_EXCEL_MODULES).toBe(16);
    });

    it('should number modules strictly 1 through 16 in exact ascending sequence', () => {
      EXCEL_MODULES.forEach((mod, index) => {
        expect(mod.number).toBe(index + 1);
      });
    });

    it('should assign a unique ID to every module following the excel-mod-N format', () => {
      const ids = EXCEL_MODULES.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(16);

      EXCEL_MODULES.forEach((mod) => {
        expect(mod.id).toBe(`excel-mod-${mod.number}`);
      });
    });

    it('should have valid titles, focuses, and descriptions for all modules', () => {
      EXCEL_MODULES.forEach((mod) => {
        expect(mod.title.trim().length).toBeGreaterThan(0);
        expect(mod.focus.trim().length).toBeGreaterThan(0);
        expect(mod.description.trim().length).toBeGreaterThan(20);
      });
    });
  });

  describe('Tier Structure & Segmentation', () => {
    it('should define exactly 4 tiers in EXCEL_TIERS', () => {
      expect(EXCEL_TIERS).toHaveLength(4);
      expect(TOTAL_EXCEL_TIERS).toBe(4);
      expect(EXCEL_TIERS.map((t) => t.tier)).toEqual([1, 2, 3, 4]);
    });

    it('should have correct slug and metadata for all 4 tiers', () => {
      const expectedSlugs: ExcelTierSlug[] = ['beginner', 'intermediate', 'advanced', 'endgame'];
      EXCEL_TIERS.forEach((tier, idx) => {
        expect(tier.slug).toBe(expectedSlugs[idx]);
        expect(tier.name).toBeTruthy();
        expect(tier.tabLabel).toBeTruthy();
        expect(tier.badgeColor).toBeTruthy();
        expect(tier.accentColor).toBeTruthy();
        expect(tier.description).toBeTruthy();
        expect(tier.moduleRange).toBeTruthy();
      });
    });

    it('should properly distribute modules across the 4 tiers (Tier 1: 1-4, Tier 2: 5-8, Tier 3: 9-13, Tier 4: 14-16)', () => {
      const tier1 = EXCEL_MODULES.filter((m) => m.tier === 1);
      const tier2 = EXCEL_MODULES.filter((m) => m.tier === 2);
      const tier3 = EXCEL_MODULES.filter((m) => m.tier === 3);
      const tier4 = EXCEL_MODULES.filter((m) => m.tier === 4);

      expect(tier1).toHaveLength(4);
      expect(tier1.map((m) => m.number)).toEqual([1, 2, 3, 4]);

      expect(tier2).toHaveLength(4);
      expect(tier2.map((m) => m.number)).toEqual([5, 6, 7, 8]);

      expect(tier3).toHaveLength(5);
      expect(tier3.map((m) => m.number)).toEqual([9, 10, 11, 12, 13]);

      expect(tier4).toHaveLength(3);
      expect(tier4.map((m) => m.number)).toEqual([14, 15, 16]);
    });

    it('should have consistent tierName and tierSlug matching parent tier definitions', () => {
      EXCEL_MODULES.forEach((mod) => {
        const parentTier = EXCEL_TIERS.find((t) => t.tier === mod.tier);
        expect(parentTier).toBeDefined();
        expect(mod.tierName).toBe(parentTier!.name);
        expect(mod.tierSlug).toBe(parentTier!.slug);
      });
    });
  });

  describe('Curriculum Content & Arrays Full Population', () => {
    it('should have coreConcepts fully populated for every module', () => {
      EXCEL_MODULES.forEach((mod) => {
        expect(Array.isArray(mod.coreConcepts)).toBe(true);
        expect(mod.coreConcepts.length).toBeGreaterThanOrEqual(3);
        mod.coreConcepts.forEach((concept) => {
          expect(typeof concept).toBe('string');
          expect(concept.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('should have functions fully populated for every module', () => {
      EXCEL_MODULES.forEach((mod) => {
        expect(Array.isArray(mod.functions)).toBe(true);
        expect(mod.functions.length).toBeGreaterThanOrEqual(1);
        mod.functions.forEach((fn) => {
          expect(typeof fn).toBe('string');
          expect(fn.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('should have shortcuts fully populated for every module', () => {
      EXCEL_MODULES.forEach((mod) => {
        expect(Array.isArray(mod.shortcuts)).toBe(true);
        expect(mod.shortcuts.length).toBeGreaterThanOrEqual(3);
        mod.shortcuts.forEach((sc) => {
          expect(typeof sc).toBe('string');
          expect(sc.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('should have gameMechanics fully populated for every module', () => {
      EXCEL_MODULES.forEach((mod) => {
        expect(Array.isArray(mod.gameMechanics)).toBe(true);
        expect(mod.gameMechanics.length).toBeGreaterThanOrEqual(3);
        mod.gameMechanics.forEach((mech) => {
          expect(typeof mech).toBe('string');
          expect(mech.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Key Topics & Pedagogical Checkpoints', () => {
    it('should include signature Excel modules across tiers', () => {
      const mod1 = getModuleByNumber(1);
      expect(mod1?.title).toContain('Grid Navigation');

      const mod5 = getModuleByNumber(5);
      expect(mod5?.title).toContain('Logical Gates');

      const mod8 = getModuleByNumber(8);
      expect(mod8?.title).toContain('Lookup');
      expect(mod8?.functions).toContain('XLOOKUP');

      const mod9 = getModuleByNumber(9);
      expect(mod9?.title).toContain('Dynamic Array');
      expect(mod9?.functions).toContain('FILTER');

      const mod10 = getModuleByNumber(10);
      expect(mod10?.title).toContain('LET & LAMBDA');
      expect(mod10?.functions).toContain('LAMBDA');

      const mod12 = getModuleByNumber(12);
      expect(mod12?.title).toContain('Power Query');

      const mod15 = getModuleByNumber(15);
      expect(mod15?.title).toContain('Macros & VBA');

      const mod16 = getModuleByNumber(16);
      expect(mod16?.title).toContain('Formula Auditing');
    });
  });

  describe('Helper Functions & Query API', () => {
    it('getAllTiers should return all 4 tiers as an array copy', () => {
      const tiers = getAllTiers();
      expect(tiers).toHaveLength(4);
      expect(tiers).not.toBe(EXCEL_TIERS); // Should be a shallow copy
      expect(tiers).toEqual(EXCEL_TIERS);
    });

    it('getTier should fetch tier by number or slug', () => {
      expect(getTier(1)?.name).toBe('Tier 1: The Grid & Foundations');
      expect(getTier(2)?.name).toBe('Tier 2: Logic, Text & Lookups');
      expect(getTier(3)?.name).toBe('Tier 3: Modern Arrays & Business Intelligence');
      expect(getTier(4)?.name).toBe('Tier 4: Optimization, Automation & Mastery');

      expect(getTier('beginner')?.tier).toBe(1);
      expect(getTier('intermediate')?.tier).toBe(2);
      expect(getTier('advanced')?.tier).toBe(3);
      expect(getTier('endgame')?.tier).toBe(4);

      // Invalid tier
      expect(getTier(5 as ExcelTierNumber)).toBeUndefined();
      expect(getTier('invalid' as ExcelTierSlug)).toBeUndefined();
    });

    it('getModulesByTier should filter correctly by tier number and slug', () => {
      const tier1ByNum = getModulesByTier(1);
      const tier1BySlug = getModulesByTier('beginner');
      expect(tier1ByNum).toHaveLength(4);
      expect(tier1ByNum).toEqual(tier1BySlug);
      expect(tier1ByNum.map((m) => m.number)).toEqual([1, 2, 3, 4]);

      const tier2ByNum = getModulesByTier(2);
      const tier2BySlug = getModulesByTier('intermediate');
      expect(tier2ByNum).toHaveLength(4);
      expect(tier2ByNum).toEqual(tier2BySlug);
      expect(tier2ByNum.map((m) => m.number)).toEqual([5, 6, 7, 8]);

      const tier3ByNum = getModulesByTier(3);
      const tier3BySlug = getModulesByTier('advanced');
      expect(tier3ByNum).toHaveLength(5);
      expect(tier3ByNum).toEqual(tier3BySlug);
      expect(tier3ByNum.map((m) => m.number)).toEqual([9, 10, 11, 12, 13]);

      const tier4ByNum = getModulesByTier(4);
      const tier4BySlug = getModulesByTier('endgame');
      expect(tier4ByNum).toHaveLength(3);
      expect(tier4ByNum).toEqual(tier4BySlug);
      expect(tier4ByNum.map((m) => m.number)).toEqual([14, 15, 16]);
    });

    it('getModuleByNumber should retrieve specific module or undefined', () => {
      for (let i = 1; i <= 16; i++) {
        const mod = getModuleByNumber(i);
        expect(mod).toBeDefined();
        expect(mod?.number).toBe(i);
      }

      expect(getModuleByNumber(0)).toBeUndefined();
      expect(getModuleByNumber(17)).toBeUndefined();
    });

    it('getModuleById should retrieve specific module or undefined', () => {
      for (let i = 1; i <= 16; i++) {
        const mod = getModuleById(`excel-mod-${i}`);
        expect(mod).toBeDefined();
        expect(mod?.id).toBe(`excel-mod-${i}`);
        expect(mod?.number).toBe(i);
      }

      expect(getModuleById('non-existent')).toBeUndefined();
    });

    it('getCurriculumStats should calculate comprehensive statistics matching constants', () => {
      const stats = getCurriculumStats();

      expect(stats.totalModules).toBe(16);
      expect(stats.totalTiers).toBe(4);
      expect(stats.tierBreakdown).toEqual({
        1: 4,
        2: 4,
        3: 5,
        4: 3,
      });

      expect(stats.totalFunctions).toBeGreaterThan(40);
      expect(stats.totalShortcuts).toBeGreaterThan(30);

      expect(EXCEL_CURRICULUM_STATS).toEqual(stats);
    });
  });
});
