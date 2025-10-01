# Example Test: ND-Safe Motion Hook

import { renderHook, act } from '@testing-library/react';
import { useNDsafeMotion } from '../packages/hooks/useNDsafeMotion';

describe('useNDsafeMotion', () => {
  it('respects prefers-reduced-motion', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }));
    const { result } = renderHook(() => useNDsafeMotion());
    expect(result.current.motionEnabled).toBe(false);
  });

  it('allows manual intensity adjustment', () => {
    const { result } = renderHook(() => useNDsafeMotion(0.5));
    act(() => {
      result.current.setIntensity(0.8);
    });
    expect(result.current.intensity).toBe(0.8);
  });
});
