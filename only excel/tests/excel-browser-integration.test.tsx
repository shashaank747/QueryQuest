import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// Polyfill Worker and mock canvas-confetti for jsdom
if (typeof window !== 'undefined' && !window.Worker) {
  (window as any).Worker = class {
    postMessage = vi.fn();
    terminate = vi.fn();
    addEventListener = vi.fn();
    removeEventListener = vi.fn();
  };
}

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

import { App } from '../src/app/App';
import { useTrackStore } from '../src/stores/useTrackStore';
import { useExcelStore } from '../src/stores/useExcelStore';
import { useWorldStore } from '../src/stores/useWorldStore';
import { getExcelWorldById } from '../src/modules/excel/worlds';
import { ExcelWorkspaceLayout } from '../src/components/excel/ExcelWorkspaceLayout';

describe('Excel Browser Integration & Component Rendering', () => {
  beforeEach(() => {
    act(() => {
      useTrackStore.getState().setSelectedTrack(null);
      useExcelStore.getState().setActiveWorld(null);
      useWorldStore.getState().setActiveWorld(null);
    });
  });

  it('verifies track selection page renders and can launch Excel track', () => {
    render(<App />);

    // Check track selection page is displayed with Excel card
    const excelLaunchBtn = screen.getByRole('button', { name: /Launch Quest Query \(Excel\)/i });
    expect(excelLaunchBtn).toBeDefined();

    // Click Launch Excel Track
    act(() => {
      fireEvent.click(excelLaunchBtn);
    });

    expect(useTrackStore.getState().selectedTrack).toBe('excel');
  });

  it('verifies Excel worlds dashboard renders when Excel track is selected', () => {
    act(() => {
      useTrackStore.getState().setSelectedTrack('excel');
    });

    render(<App />);

    // Verify header of Excel Worlds Dashboard
    expect(screen.getByText(/Master Excel by Solving Real Business Outages/i)).toBeDefined();
    expect(screen.getByText(/Excel Track \(7 Worlds\)/i)).toBeDefined();

    // Verify all 7 Worlds render
    expect(screen.getByText('Supermarket Operations')).toBeDefined();
    expect(screen.getByText('Namma Metro — Transit Command')).toBeDefined();
    expect(screen.getByText('Query & Kaapi — Tiffin & Filter Coffee')).toBeDefined();
    expect(screen.getByText('Airport Operations')).toBeDefined();
    expect(screen.getByText('Warehouse Management')).toBeDefined();
    expect(screen.getByText('Hospital Administration')).toBeDefined();
    expect(screen.getByText('Bank Operations')).toBeDefined();
  });

  it('verifies Excel workspace renders Ribbon, Formula Bar, Grid, and Mission Panel correctly', () => {
    const supermarketWorld = getExcelWorldById('supermarket');
    expect(supermarketWorld).toBeDefined();

    act(() => {
      useExcelStore.getState().loadWorld(supermarketWorld!);
    });

    render(<ExcelWorkspaceLayout />);

    // 1. Mission Panel verification
    expect(screen.getByText('Supermarket Operations')).toBeDefined();
    expect(screen.getByText('Retail & Consumer Goods')).toBeDefined();
    expect(screen.getByText('Reconcile Total Stock Units')).toBeDefined();
    expect(screen.getByText(/Role: Operations Financial Analyst/i)).toBeDefined();
    expect(screen.getByText(/Verify Sheet & Submit Solution/i)).toBeDefined();
    expect(screen.getAllByText(/Cell E12/i).length).toBeGreaterThanOrEqual(1);

    // 2. Ribbon verification
    expect(screen.getByText(/home/i)).toBeDefined();
    expect(screen.getByText(/formulas/i)).toBeDefined();
    expect(screen.getAllByText(/AutoSum/i).length).toBeGreaterThanOrEqual(1);

    // 3. Formula Bar verification
    const nameBox = screen.getByTitle(/Name Box/i);
    expect(nameBox).toBeDefined();
    expect(screen.getByPlaceholderText(/Enter formula or value/i)).toBeDefined();

    // 4. Grid verification
    expect(screen.getByText('Item Name')).toBeDefined();
    expect(screen.getByText('Cost Price (₹)')).toBeDefined();
    expect(screen.getByText('Selling Price (₹)')).toBeDefined();

    // 5. Sheet Tabs verification
    expect(screen.getAllByText('Inventory & Sales').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Ready/i)).toBeDefined();
  });
});
