import { create } from 'zustand';

export type TrackId = 'mysql' | 'excel' | 'powerbi';

interface TrackState {
  selectedTrack: TrackId | null;
  previewTrack: TrackId | null;
  setSelectedTrack: (track: TrackId | null) => void;
  setPreviewTrack: (track: TrackId | null) => void;
}

export const useTrackStore = create<TrackState>((set) => ({
  selectedTrack: null,
  previewTrack: null,
  setSelectedTrack: (track) => set({ selectedTrack: track }),
  setPreviewTrack: (track) => set({ previewTrack: track }),
}));
