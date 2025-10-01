import { createContext, useContext, useState } from 'react';

const ModeContext = createContext();

const modeConfig = {
  art: {
    motionIntensity: 0.5,
    showTeachings: false,
    showOutputs: true,
    palette: 'vibrant',
    soundEnabled: true
  },
  learning: {
    motionIntensity: 0.2,
    showTeachings: true,
    showOutputs: true,
    palette: 'muted',
    soundEnabled: true
  },
  game: {
    motionIntensity: 0.7,
    showTeachings: false,
    showOutputs: false,
    palette: 'vibrant',
    soundEnabled: true
  },
  research: {
    motionIntensity: 0.1,
    showTeachings: true,
    showOutputs: true,
    palette: 'neutral',
    soundEnabled: false
  }
};

export function ModeProvider({ children }) {
  const [mode, setMode] = useState('art');
  return (
    <ModeContext.Provider value={{ mode, setMode, config: modeConfig[mode] }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
