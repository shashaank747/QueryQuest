import { useState, useCallback } from 'react';
import { soundService } from '../services/sound/sound-effects';

export const useAudio = () => {
  const [isMuted, setIsMuted] = useState(soundService.isMuted);

  const toggleSound = useCallback(() => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
    return muted;
  }, []);

  return {
    isMuted,
    toggleSound,
    soundService,
  };
};
