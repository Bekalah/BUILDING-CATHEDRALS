// ND-safe motion hook
// Provides motionEnabled respecting prefers-reduced-motion and adjustable intensity.
// Future extension: incorporate user profile, persisted preferences, accessibility overrides.

import { useEffect, useState, useCallback } from 'react';

export function useNDsafeMotion(defaultIntensity = 1) {
  const [reduced, setReduced] = useState(false);
  const [intensity, setIntensity] = useState(clamp(defaultIntensity));

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setIntensitySafe = useCallback((val) => {
    setIntensity(clamp(val));
  }, []);

  return {
    motionEnabled: !reduced,
    intensity: reduced ? 0 : intensity,
    setIntensity: setIntensitySafe,
    meta: {
      source: 'useNDsafeMotion',
      reduced,
      baseIntensity: intensity
    }
  };
}

function clamp(v) {
  if (typeof v !== 'number' || Number.isNaN(v)) return 1;
  return Math.min(1, Math.max(0, v));
}
