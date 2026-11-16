import { describe, it, expect, beforeEach } from 'vitest';
import { useTrackStore } from '../src/stores/useTrackStore';
import { useWorldStore } from '../src/stores/useWorldStore';

describe('Quest Query Track Selection & Navigation', () => {
  beforeEach(() => {
    useTrackStore.getState().setSelectedTrack(null);
    useTrackStore.getState().setPreviewTrack(null);
  });

  it('should default to track selection landing page (selectedTrack is null)', () => {
    const { selectedTrack, previewTrack } = useTrackStore.getState();
    expect(selectedTrack).toBeNull();
    expect(previewTrack).toBeNull();
  });

  it('should switch to mysql track when selected', () => {
    useTrackStore.getState().setSelectedTrack('mysql');
    expect(useTrackStore.getState().selectedTrack).toBe('mysql');
  });

  it('should return to track selection landing page when resetting to null', () => {
    useTrackStore.getState().setSelectedTrack('mysql');
    expect(useTrackStore.getState().selectedTrack).toBe('mysql');

    useTrackStore.getState().setSelectedTrack(null);
    expect(useTrackStore.getState().selectedTrack).toBeNull();
  });

  it('should handle preview tracks for Excel and Power BI', () => {
    useTrackStore.getState().setPreviewTrack('excel');
    expect(useTrackStore.getState().previewTrack).toBe('excel');

    useTrackStore.getState().setPreviewTrack('powerbi');
    expect(useTrackStore.getState().previewTrack).toBe('powerbi');

    useTrackStore.getState().setPreviewTrack(null);
    expect(useTrackStore.getState().previewTrack).toBeNull();
  });

  it('should maintain all active worlds in the registry when on MySQL track', () => {
    useTrackStore.getState().setSelectedTrack('mysql');
    const { worlds } = useWorldStore.getState();
    expect(worlds).toHaveLength(7);
    expect(worlds.map((w) => w.id)).toEqual([
      'supermarket',
      'metro',
      'kaapi',
      'airport',
      'warehouse',
      'hospital',
      'bank',
    ]);
  });
});
