'use client';

import { unlockAudio } from '@/services/sound/sound.service';
import { useEffect } from 'react';

export function AudioUnlocker() {
  useEffect(() => {
    const unlock = () => {
      unlockAudio();

      // Remove listeners after first unlock attempt
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });

    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  return null;
}
