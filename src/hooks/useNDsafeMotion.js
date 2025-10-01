import { useState, useEffect } from 'react';

export function useNDsafeMotion(defaultIntensity = 0.3) {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [intensity, setIntensity] = useState(defaultIntensity);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) setMotionEnabled(false);
  }, []);

  return { motionEnabled, intensity, setIntensity };
}
