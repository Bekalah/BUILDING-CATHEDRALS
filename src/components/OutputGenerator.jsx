import React, { useState } from 'react';
import { useMode } from '../hooks/useMode';

export function OutputGenerator({ teacherData, canvasRef }) {
  const { mode, config } = useMode();
  const [generating, setGenerating] = useState(false);
  const [outputs, setOutputs] = useState([]);

  const availableOutputs = {
    art: ['fractal art', 'geometric art'],
    learning: ['research notes', 'study guides'],
    game: ['artifacts', 'quest items'],
    research: ['data exports', 'analysis reports']
  };

  const handleCaptureFractal = async () => {
    setGenerating(true);
    try {
      const canvas = canvasRef.current?.children[0];
      if (!canvas) throw new Error('Canvas not found');
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${teacherData.id}_${mode}_${Date.now()}.png`;
      link.href = dataURL;
      link.click();
      const output = {
        id: Date.now(),
        type: availableOutputs[mode][0],
        teacher: teacherData.id,
        mode: mode,
        timestamp: new Date().toISOString()
      };
      setOutputs(prev => [...prev, output]);
      const existingOutputs = JSON.parse(localStorage.getItem('cathedral_outputs') || '[]');
      existingOutputs.push(output);
      localStorage.setItem('cathedral_outputs', JSON.stringify(existingOutputs));
    } catch (error) {
      console.error('Failed to generate output:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (!config.showOutputs) return null;

  return (
    <div className="bg-black bg-opacity-70 p-4 rounded text-white">
      <h4 className="text-sm text-[#8888FF] mb-2">Create in {mode.toUpperCase()} mode:</h4>
      <button
        onClick={handleCaptureFractal}
        disabled={generating}
        className="bg-[#FFD700] text-[#0a0e17] px-4 py-2 rounded font-bold hover:bg-[#FFC400] disabled:opacity-50 transition-colors text-sm"
      >
        {generating ? 'Generating...' : `Create ${availableOutputs[mode][0]}`}
      </button>
      {outputs.length > 0 && (
        <div className="mt-2 text-xs text-[#00FFFF]">
          Created: {outputs.length} outputs
        </div>
      )}
    </div>
  );
}
