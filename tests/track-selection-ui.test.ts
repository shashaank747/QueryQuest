import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useTrackStore, TrackId } from '../src/stores/useTrackStore';
import { useWorldStore } from '../src/stores/useWorldStore';
import { TrackSelectionPage } from '../src/components/dashboard/TrackSelectionPage';

const ROOT_DIR = process.cwd();
const TRACKS_DIR = path.resolve(ROOT_DIR, 'public/images/tracks');
const EXCEL_SVG_PATH = path.join(TRACKS_DIR, 'excel-track-banner.svg');
const MYSQL_SVG_PATH = path.join(TRACKS_DIR, 'mysql-track-banner.svg');
const POWERBI_SVG_PATH = path.join(TRACKS_DIR, 'powerbi-track-banner.svg');
const TRACK_SELECTION_PAGE_PATH = path.resolve(ROOT_DIR, 'src/components/dashboard/TrackSelectionPage.tsx');

/**
 * Utility helper to safely load and verify file existence and non-empty content
 */
function readSvgFile(filePath: string): string {
  expect(fs.existsSync(filePath), `Asset file should exist at ${filePath}`).toBe(true);
  const content = fs.readFileSync(filePath, 'utf-8');
  expect(content.length).toBeGreaterThan(0);
  return content;
}

/**
 * Utility helper to parse SVG XML and ensure zero syntax errors
 */
function parseSvgXml(content: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'image/svg+xml');
  const parserError = doc.querySelector('parsererror');
  expect(parserError, `SVG XML must not have parse errors: ${parserError?.textContent}`).toBeNull();
  return doc;
}

describe('Track Selection UI & Visual Banner Verification Suite', () => {
  beforeEach(() => {
    useTrackStore.getState().setSelectedTrack(null);
    useTrackStore.getState().setPreviewTrack(null);
  });

  // =========================================================================
  // Tier 1 - Asset Existence, Format & XML Validity Verification
  // =========================================================================
  describe('Tier 1 - Asset Existence & Format Verification', () => {
    it('should verify excel-track-banner.svg exists, is non-empty, and has valid SVG root tags', () => {
      const content = readSvgFile(EXCEL_SVG_PATH);
      expect(content).toMatch(/<svg[\s\S]*?>/);
      expect(content).toMatch(/<\/svg>\s*$/);
      expect(content.length).toBeGreaterThan(500);

      const doc = parseSvgXml(content);
      expect(doc.documentElement.tagName.toLowerCase()).toBe('svg');
      expect(doc.documentElement.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
    });

    it('should verify mysql-track-banner.svg exists, is non-empty, and has valid SVG root tags', () => {
      const content = readSvgFile(MYSQL_SVG_PATH);
      expect(content).toMatch(/<svg[\s\S]*?>/);
      expect(content).toMatch(/<\/svg>\s*$/);
      expect(content.length).toBeGreaterThan(500);

      const doc = parseSvgXml(content);
      expect(doc.documentElement.tagName.toLowerCase()).toBe('svg');
      expect(doc.documentElement.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
    });

    it('should verify powerbi-track-banner.svg exists, is non-empty, and has valid SVG root tags', () => {
      const content = readSvgFile(POWERBI_SVG_PATH);
      expect(content).toMatch(/<svg[\s\S]*?>/);
      expect(content).toMatch(/<\/svg>\s*$/);
      expect(content.length).toBeGreaterThan(500);

      const doc = parseSvgXml(content);
      expect(doc.documentElement.tagName.toLowerCase()).toBe('svg');
      expect(doc.documentElement.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
    });

    it('should verify all 3 SVG files are free from dangerous executable scripts and inline handlers', () => {
      const paths = [EXCEL_SVG_PATH, MYSQL_SVG_PATH, POWERBI_SVG_PATH];
      for (const p of paths) {
        const content = readSvgFile(p);
        const doc = parseSvgXml(content);

        // Security check: no <script> tags
        expect(doc.querySelectorAll('script')).toHaveLength(0);

        // Security check: no inline event handlers (onload, onerror, onclick)
        expect(content).not.toMatch(/\bon[a-z]+\s*=/i);

        // Security check: no javascript pseudo-protocols
        expect(content).not.toMatch(/href\s*=\s*["']javascript:/i);

        // Adversarial check: no null bytes
        expect(content).not.toContain('\0');
      }
    });

    it('should verify all 3 SVG files are sized within bounded production limits (1KB - 500KB)', () => {
      const paths = [EXCEL_SVG_PATH, MYSQL_SVG_PATH, POWERBI_SVG_PATH];
      for (const p of paths) {
        const stats = fs.statSync(p);
        expect(stats.size).toBeGreaterThan(1024); // at least 1 KB
        expect(stats.size).toBeLessThan(500 * 1024); // under 500 KB to avoid asset bloat
      }
    });

    it('should verify all 3 SVG files adhere to UTF-8 encoding integrity without corruption', () => {
      const paths = [EXCEL_SVG_PATH, MYSQL_SVG_PATH, POWERBI_SVG_PATH];
      for (const p of paths) {
        const rawBuffer = fs.readFileSync(p);
        const text = rawBuffer.toString('utf-8');

        // Verify valid round-trip UTF-8 encoding without Unicode replacement chars
        expect(text).not.toContain('\uFFFD');
        expect(Buffer.from(text, 'utf-8').equals(rawBuffer)).toBe(true);
      }
    });
  });

  // =========================================================================
  // Tier 2 - Visual Specifications & Motif Integrity
  // =========================================================================
  describe('Tier 2 - Visual Specifications & Motif Integrity', () => {
    it('should verify all 3 SVG files specify viewBox="0 0 640 320" (2:1 aspect ratio)', () => {
      const paths = [EXCEL_SVG_PATH, MYSQL_SVG_PATH, POWERBI_SVG_PATH];
      for (const p of paths) {
        const content = readSvgFile(p);
        const doc = parseSvgXml(content);
        const viewBox = doc.documentElement.getAttribute('viewBox');
        expect(viewBox).toBe('0 0 640 320');
      }
    });

    it('should verify Excel banner contains spreadsheet and financial modeling motifs', () => {
      const content = readSvgFile(EXCEL_SVG_PATH);

      // Formula bar motif with XLOOKUP
      expect(content).toMatch(/XLOOKUP/i);

      // Financial indicator motifs (FY26 Forecast, Revenue, EBITDA)
      const hasRevenue = /Revenue/i.test(content);
      const hasEbitda = /EBITDA/i.test(content);
      const hasForecast = /Forecast/i.test(content);
      expect(hasRevenue || hasEbitda || hasForecast).toBe(true);

      // Emerald palette references (e.g. #10B981, #059669, #047857, #22C55E, #34D399, etc.)
      const hasEmeraldColor = /#10B981|#059669|#047857|#22C55E|#34D399|#042116|#062A1D|#064E3B|#6EE7B7/i.test(content);
      expect(hasEmeraldColor).toBe(true);

      // Spreadsheet grid elements (grid lines, cells, rects/lines)
      const doc = parseSvgXml(content);
      expect(doc.querySelectorAll('rect, line, path').length).toBeGreaterThan(10);
    });

    it('should verify MySQL banner contains relational and database motifs', () => {
      const content = readSvgFile(MYSQL_SVG_PATH);

      // Relational tables (orders and customers)
      expect(content).toMatch(/orders/i);
      expect(content).toMatch(/customers/i);

      // Primary and Foreign Key notations (PK, FK)
      expect(content).toMatch(/\bPK\b/);
      expect(content).toMatch(/\bFK\b/);

      // Query terminal chip with SELECT keyword
      expect(content).toMatch(/\bSELECT\b/i);

      // Telemetry or engine chip with WASM reference
      expect(content).toMatch(/WASM/i);

      // Cyan / Orange palette references (e.g. #00F0FF, #38BDF8, #FB923C, #F97316, etc.)
      const hasCyanOrange = /#00F0FF|#38BDF8|#0284C7|#FB923C|#F97316|#EA580C/i.test(content);
      expect(hasCyanOrange).toBe(true);

      // Dynamic connector line / bezier curve linking tables
      const doc = parseSvgXml(content);
      expect(doc.querySelectorAll('path').length).toBeGreaterThan(5);
    });

    it('should verify Power BI banner contains executive analytics motifs', () => {
      const content = readSvgFile(POWERBI_SVG_PATH);

      // Executive analytics metrics (REVENUE, KPI, Target, $4,892,100 / $4.89M)
      expect(content).toMatch(/REVENUE/i);
      const hasKpiOrRevenueValue = /\$4[,.]892[,.]100|\$4\.89M|KPI/i.test(content);
      expect(hasKpiOrRevenueValue).toBe(true);
      expect(content).toMatch(/Target/i);

      // Donut chart motif (explicit label, gradient id, or circular path)
      const hasDonut = /donut/i.test(content);
      expect(hasDonut).toBe(true);

      // DAX calculation or expression motif
      const hasDax = /DAX/i.test(content);
      expect(hasDax).toBe(true);

      // Gold / Amber palette references (e.g. #F59E0B, #EAB308, #FBBF24, #D97706, #FDE68A, etc.)
      const hasGoldAmber = /#F59E0B|#EAB308|#FBBF24|#D97706|#FDE68A|#78350F|#B45309/i.test(content);
      expect(hasGoldAmber).toBe(true);

      // Visual components (donut segments, bar charts, cards)
      const doc = parseSvgXml(content);
      expect(doc.querySelectorAll('path, rect').length).toBeGreaterThan(10);
    });
  });

  // =========================================================================
  // Tier 3 - Track Selection State & Contract Compatibility
  // =========================================================================
  describe('Tier 3 - Track Selection State & Contract Compatibility', () => {
    it('should initialize with null selectedTrack and previewTrack', () => {
      const state = useTrackStore.getState();
      expect(state.selectedTrack).toBeNull();
      expect(state.previewTrack).toBeNull();
    });

    it('should set and reset selectedTrack for all valid track IDs', () => {
      const tracks: TrackId[] = ['mysql', 'excel', 'powerbi'];

      for (const track of tracks) {
        useTrackStore.getState().setSelectedTrack(track);
        expect(useTrackStore.getState().selectedTrack).toBe(track);

        // Reset to null
        useTrackStore.getState().setSelectedTrack(null);
        expect(useTrackStore.getState().selectedTrack).toBeNull();
      }
    });

    it('should set and reset previewTrack for all valid track IDs', () => {
      const tracks: TrackId[] = ['excel', 'powerbi', 'mysql'];

      for (const track of tracks) {
        useTrackStore.getState().setPreviewTrack(track);
        expect(useTrackStore.getState().previewTrack).toBe(track);

        // Reset to null
        useTrackStore.getState().setPreviewTrack(null);
        expect(useTrackStore.getState().previewTrack).toBeNull();
      }
    });

    it('should maintain independent state isolation between selectedTrack and previewTrack', () => {
      // Setting preview should not alter selectedTrack
      useTrackStore.getState().setSelectedTrack('mysql');
      useTrackStore.getState().setPreviewTrack('excel');
      expect(useTrackStore.getState().selectedTrack).toBe('mysql');
      expect(useTrackStore.getState().previewTrack).toBe('excel');

      // Clearing preview should preserve selectedTrack
      useTrackStore.getState().setPreviewTrack(null);
      expect(useTrackStore.getState().selectedTrack).toBe('mysql');
      expect(useTrackStore.getState().previewTrack).toBeNull();

      // Setting preview should preserve selectedTrack null state
      useTrackStore.getState().setSelectedTrack(null);
      useTrackStore.getState().setPreviewTrack('powerbi');
      expect(useTrackStore.getState().selectedTrack).toBeNull();
      expect(useTrackStore.getState().previewTrack).toBe('powerbi');
    });

    it('should execute rapid state transition sequences idempotently', () => {
      const store = useTrackStore.getState();

      store.setSelectedTrack('mysql');
      store.setSelectedTrack('mysql'); // idempotent duplicate
      expect(useTrackStore.getState().selectedTrack).toBe('mysql');

      store.setSelectedTrack('excel');
      store.setPreviewTrack('powerbi');
      store.setSelectedTrack('powerbi');
      expect(useTrackStore.getState().selectedTrack).toBe('powerbi');
      expect(useTrackStore.getState().previewTrack).toBe('powerbi');

      store.setPreviewTrack(null);
      store.setSelectedTrack(null);
      expect(useTrackStore.getState().selectedTrack).toBeNull();
      expect(useTrackStore.getState().previewTrack).toBeNull();
    });

    it('should verify world registry consistency when MySQL track is selected', () => {
      useTrackStore.getState().setSelectedTrack('mysql');
      const { worlds } = useWorldStore.getState();

      expect(worlds).toBeDefined();
      expect(worlds.length).toBe(5);

      const worldIds = worlds.map((w) => w.id);
      expect(worldIds).toEqual([
        'supermarket',
        'airport',
        'warehouse',
        'hospital',
        'bank',
      ]);

      // Verify each world has valid metadata structure
      for (const world of worlds) {
        expect(world.id).toBeTruthy();
        expect(world.name).toBeTruthy();
        expect(world.description).toBeTruthy();
        expect(world.initialSchemaSql).toBeDefined();
        expect(world.initialDatasetSql).toBeDefined();
        expect(Array.isArray(world.missions)).toBe(true);
        expect(world.missions.length).toBeGreaterThan(0);
      }
    });

    it('should trigger track selection and preview actions from TrackSelectionPage UI', () => {
      render(React.createElement(TrackSelectionPage));

      // Find MySQL button ("Launch Quest Query (MySQL)") and click it
      const startButton = screen.getByRole('button', { name: /launch quest query/i });
      expect(startButton).toBeInTheDocument();
      act(() => {
        fireEvent.click(startButton);
      });
      expect(useTrackStore.getState().selectedTrack).toBe('mysql');

      // Reset
      act(() => {
        useTrackStore.getState().setSelectedTrack(null);
      });

      // Find preview curriculum buttons for Excel and Power BI
      const previewButtons = screen.getAllByRole('button', { name: /preview curriculum/i });
      expect(previewButtons.length).toBeGreaterThanOrEqual(2);

      // First preview button is Excel
      act(() => {
        fireEvent.click(previewButtons[0]);
      });
      expect(useTrackStore.getState().previewTrack).toBe('excel');

      // Second preview button is Power BI
      act(() => {
        fireEvent.click(previewButtons[1]);
      });
      expect(useTrackStore.getState().previewTrack).toBe('powerbi');
    });
  });

  // =========================================================================
  // Tier 4 - Layout & Non-Clipping Contract Compliance
  // =========================================================================
  describe('Tier 4 - Layout & Architectural Contract Compliance', () => {
    it('should verify TrackSelectionPage source preserves non-clipping of MySQL floating badge', () => {
      expect(fs.existsSync(TRACK_SELECTION_PAGE_PATH)).toBe(true);
      const source = fs.readFileSync(TRACK_SELECTION_PAGE_PATH, 'utf-8');

      // Confirm presence of the floating active highlight badge on Card 2
      expect(source).toMatch(/-top-3\.5 left-1\/2 -translate-x-1\/2/);
      expect(source).toMatch(/Playable Now/i);

      // Verify Card 2 container maintains non-clipping (does not have overflow-hidden on outer card)
      const card2Section = source.slice(source.indexOf('CARD 2: MYSQL'), source.indexOf('CARD 3: POWER BI'));
      expect(card2Section).toBeDefined();
      expect(card2Section.length).toBeGreaterThan(100);

      // Check outer card element doesn't specify overflow-hidden
      const outerCardMatch = card2Section.match(/<div[\s\S]*?className=\{`([\s\S]*?)`\}/);
      if (outerCardMatch) {
        expect(outerCardMatch[1]).not.toContain('overflow-hidden');
      }
    });

    it('should verify all 3 track banner hero images are integrated into TrackSelectionPage UI', () => {
      render(React.createElement(TrackSelectionPage));

      // Verify all 3 banner images are rendered in the DOM with proper alt tags
      const excelImg = screen.getByAltText(/excel track banner/i);
      const mysqlImg = screen.getByAltText(/mysql track banner/i);
      const powerbiImg = screen.getByAltText(/power bi track banner/i);

      expect(excelImg).toBeInTheDocument();
      expect(mysqlImg).toBeInTheDocument();
      expect(powerbiImg).toBeInTheDocument();

      // Verify image src attributes point to the correct public paths
      expect(excelImg).toHaveAttribute('src', '/images/tracks/excel-track-banner.svg');
      expect(mysqlImg).toHaveAttribute('src', '/images/tracks/mysql-track-banner.svg');
      expect(powerbiImg).toHaveAttribute('src', '/images/tracks/powerbi-track-banner.svg');

      // Verify image classes include transition and hover scaling
      expect(excelImg.className).toContain('group-hover:scale-105');
      expect(mysqlImg.className).toContain('group-hover:scale-105');
      expect(powerbiImg.className).toContain('group-hover:scale-105');
    });
  });
});
