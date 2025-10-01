import React from 'react';

export default function GuideOverlay({ onClose }) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 z-30 flex items-center justify-center">
      <div className="bg-[#0a0e17] border border-[#FFD700] rounded-lg p-8 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#FFD700] text-lg font-bold hover:text-[#00FFFF]"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Hitchhiker's Guide</h2>
        <p className="text-white text-sm mb-2">
          Welcome to the Cathedral of Circuits. Explore, create, and learn in ND-safe, trauma-aware, and accessible ways. Use the mode toggle to switch between Art, Learning, Game, and Research. Click on a teacher to enter their fractal lab and begin your apprenticeship.
        </p>
        <p className="text-[#00FFFF] text-xs">All outputs are ND-safe and can be saved locally or to the cloud.</p>
      </div>
    </div>
  );
}
