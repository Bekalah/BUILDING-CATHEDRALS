import React from 'react';
import { useMode } from '../hooks/useMode';

export function ModeToggle() {
  const { mode, setMode } = useMode();
  const modes = ['art', 'learning', 'game', 'research'];

  return (
    <div className="flex gap-2">
      {modes.map(m => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`px-3 py-1 rounded font-bold transition-colors text-xs ${
            mode === m 
              ? 'bg-[#FFD700] text-[#0a0e17]' 
              : 'bg-[#1a1e27] text-[#8888FF] hover:bg-[#2a2e37]'
          }`}
        >
          {m.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
