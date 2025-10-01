import React, { useState, useEffect, useRef } from 'react';
import { useMode } from '../hooks/useMode';
import artData from '../data/art-engine.json';
import azureAI from '../services/azure-ai';

export default function ArtEngine({ codexNode, therapeuticFocus, onArtGenerated }) {
  const { mode, config } = useMode();
  const [currentGenerator, setCurrentGenerator] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArt, setGeneratedArt] = useState(null);
  const [fractalParams, setFractalParams] = useState(null);
  const canvasRef = useRef(null);

  // Initialize art engine based on codex node
  useEffect(() => {
    if (codexNode) {
      initializeArtEngine(codexNode);
    }
  }, [codexNode]);

  const initializeArtEngine = (node) => {
    // Find appropriate art generator for the codex node
    const generator = findGeneratorForNode(node);
    if (generator) {
      setCurrentGenerator(generator);
    }
  };

  const findGeneratorForNode = (nodeId) => {
    // Find generator that matches the codex node
    for (const [generatorId, generator] of Object.entries(artData.artGenerators)) {
      if (generator.codexNode === nodeId) {
        return generator;
      }
    }
    // Return default generator if no match
    return Object.values(artData.artGenerators)[0];
  };

  const generateArtParameters = async () => {
    if (!currentGenerator || !therapeuticFocus) return;

    setIsGenerating(true);

    try {
      // Try Azure AI first, fall back to generator data if unavailable
      const result = await azureAI.generateArtParameters(
        currentGenerator.style,
        currentGenerator.codexNode,
        therapeuticFocus
      );

      const artParams = {
        ...currentGenerator,
        ...result,
        therapeuticFocus,
        generatedAt: new Date().toISOString()
      };

      setGeneratedArt(artParams);
      setFractalParams(artParams);

      if (onArtGenerated) {
        onArtGenerated(artParams);
      }
    } catch (error) {
      console.error('Art generation failed:', error);
      // Use generator data as fallback
      const fallbackParams = {
        ...currentGenerator,
        therapeuticFocus,
        generatedAt: new Date().toISOString(),
        metadata: { model: 'fallback', therapeutic: true, ndSafe: true }
      };
      setGeneratedArt(fallbackParams);
      setFractalParams(fallbackParams);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderFractal = (params) => {
    if (!canvasRef.current || !params) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with ND-safe background
    ctx.fillStyle = artData.colorPalettes['tara-21'].colors.obsidian;
    ctx.fillRect(0, 0, width, height);

    // Render fractal based on type
    switch (params.fractalType) {
      case 'mandelbulb':
        renderMandelbulb(ctx, width, height, params);
        break;
      case 'julia-set':
        renderJuliaSet(ctx, width, height, params);
        break;
      case 'l-system-dragon':
        renderDragonCurve(ctx, width, height, params);
        break;
      case 'vesica-piscis':
        renderVesicaPiscis(ctx, width, height, params);
        break;
      default:
        renderDefaultFractal(ctx, width, height, params);
    }
  };

  const renderMandelbulb = (ctx, width, height, params) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const px = (x - width / 2) / (width / 4);
        const py = (y - height / 2) / (height / 4);

        let zx = px, zy = py, zz = 0;
        let iteration = 0;
        const maxIterations = params.iterations || 12;

        while (zx * zx + zy * zy + zz * zz < 4 && iteration < maxIterations) {
          const temp = zx * zx - zy * zy - zz * zz + px;
          zy = 2 * zx * zy + py;
          zz = 2 * zx * zz;
          zx = temp;
          iteration++;
        }

        const index = (x + y * width) * 4;
        const color = getFractalColor(iteration, maxIterations, params.colors);

        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const renderJuliaSet = (ctx, width, height, params) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const px = (x - width / 2) / (width / 4);
        const py = (y - height / 2) / (height / 4);

        let zx = px, zy = py;
        let iteration = 0;
        const maxIterations = params.iterations || 15;
        const c = { real: -0.7, imag: 0.27015 }; // Classic Julia set constant

        while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
          const temp = zx * zx - zy * zy + c.real;
          zy = 2 * zx * zy + c.imag;
          zx = temp;
          iteration++;
        }

        const index = (x + y * width) * 4;
        const color = getFractalColor(iteration, maxIterations, params.colors);

        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const renderDragonCurve = (ctx, width, height, params) => {
    // Simple L-system dragon curve approximation
    ctx.strokeStyle = params.colors[0];
    ctx.lineWidth = 2;
    ctx.beginPath();

    const startX = width / 2;
    const startY = height / 2;
    const size = Math.min(width, height) / 8;

    // Draw dragon curve segments
    let x = startX, y = startY;
    ctx.moveTo(x, y);

    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      x += Math.cos(angle) * size;
      y += Math.sin(angle) * size;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  };

  const renderVesicaPiscis = (ctx, width, height, params) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    // Draw two overlapping circles
    ctx.strokeStyle = params.colors[0];
    ctx.lineWidth = 3;

    // Left circle
    ctx.beginPath();
    ctx.arc(centerX - radius/2, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Right circle
    ctx.beginPath();
    ctx.arc(centerX + radius/2, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw vesica piscis lens shape
    ctx.fillStyle = params.colors[1] + '40'; // Semi-transparent
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius/2, 0, 0, 2 * Math.PI);
    ctx.fill();
  };

  const renderDefaultFractal = (ctx, width, height, params) => {
    // Simple geometric pattern as fallback
    ctx.strokeStyle = params.colors[0];
    ctx.lineWidth = 2;

    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const angle = (i / 8) * 2 * Math.PI;
      const x = width / 2 + Math.cos(angle) * 100;
      const y = height / 2 + Math.sin(angle) * 100;
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const getFractalColor = (iteration, maxIterations, colors) => {
    if (iteration === maxIterations) {
      return { r: 0, g: 0, b: 0 }; // Black for points in the set
    }

    const colorIndex = Math.floor((iteration / maxIterations) * (colors.length - 1));
    const hexColor = colors[colorIndex] || colors[0];

    return {
      r: parseInt(hexColor.slice(1, 3), 16),
      g: parseInt(hexColor.slice(3, 5), 16),
      b: parseInt(hexColor.slice(5, 7), 16)
    };
  };

  const downloadArt = () => {
    if (!canvasRef.current || !generatedArt) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `cathedral-art-${codexNode}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Render fractal when parameters change
  useEffect(() => {
    if (fractalParams) {
      renderFractal(fractalParams);
    }
  }, [fractalParams]);

  if (!currentGenerator) {
    return (
      <div className="art-engine-placeholder">
        <div className="text-center p-8">
          <div className="text-[#FFD700] text-lg mb-4">Art Awaits</div>
          <div className="text-[#8888FF] text-sm">
            Connect with a codex node to unlock fractal creativity
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="art-engine bg-black bg-opacity-80 p-6 rounded-lg max-w-6xl mx-auto">
      {/* Art Header */}
      <div className="art-header mb-6">
        <h2 className="text-2xl text-[#FFD700] mb-2">{currentGenerator.name}</h2>
        <h3 className="text-lg text-[#8888FF] mb-4">Fractal Art Generator</h3>

        {/* Current Generator Info */}
        <div className="generator-info bg-[#1a1e27] p-4 rounded mb-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-[#00FFFF] mb-2">Fractal Type:</div>
              <div className="text-white">{currentGenerator.type}</div>
            </div>
            <div>
              <div className="text-sm text-[#00FFFF] mb-2">Style:</div>
              <div className="text-white">{currentGenerator.style}</div>
            </div>
            <div>
              <div className="text-sm text-[#00FFFF] mb-2">Iterations:</div>
              <div className="text-white">{currentGenerator.parameters?.iterations || 8}</div>
            </div>
            <div>
              <div className="text-sm text-[#00FFFF] mb-2">Colors:</div>
              <div className="flex gap-2">
                {currentGenerator.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded border border-white"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Therapeutic Information (in learning/research modes) */}
        {config.showOutputs && currentGenerator.therapeutic && (
          <div className="therapeutic-info bg-[#2a2e37] p-4 rounded mb-4">
            <div className="text-sm text-[#FFD700] mb-2">Therapeutic Focus:</div>
            <div className="text-white text-sm mb-2">
              {currentGenerator.therapeutic.focuses.join(', ')}
            </div>
            <div className="text-xs text-[#8888FF]">
              Motion: {currentGenerator.therapeutic.motion} |
              Duration: {currentGenerator.therapeutic.duration}
            </div>
          </div>
        )}
      </div>

      {/* Art Canvas */}
      <div className="art-canvas mb-6">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-[#FFD700] rounded bg-[#0a0e17] max-w-full h-auto"
          />
          {isGenerating && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded">
              <div className="text-center">
                <div className="text-[#FFD700] text-lg animate-pulse">Generating fractal art...</div>
                <div className="text-[#8888FF] text-sm mt-2">Weaving mathematical beauty</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Art Controls */}
      <div className="art-controls mb-6">
        <div className="flex gap-4 justify-center flex-wrap">
          {!generatedArt ? (
            <button
              onClick={generateArtParameters}
              disabled={isGenerating}
              className="bg-[#FFD700] text-[#0a0e17] px-6 py-3 rounded font-bold hover:bg-[#FFC400] disabled:opacity-50 transition-colors"
            >
              {isGenerating ? 'Generating Parameters...' : 'Generate Fractal Art'}
            </button>
          ) : (
            <>
              <button
                onClick={downloadArt}
                className="bg-[#2EA66F] text-white px-6 py-3 rounded font-bold hover:bg-[#258657] transition-colors"
              >
                Download Artwork
              </button>
              <button
                onClick={generateArtParameters}
                disabled={isGenerating}
                className="bg-[#4A90E2] text-white px-6 py-3 rounded font-bold hover:bg-[#3A70C2] disabled:opacity-50 transition-colors"
              >
                {isGenerating ? 'Regenerating...' : 'Generate New Variation'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generated Art Display */}
      {generatedArt && (
        <div className="generated-art bg-[#1a1e27] p-4 rounded">
          <h4 className="text-lg text-[#FFD700] mb-3">Generated Parameters</h4>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-[#00FFFF] mb-1">Fractal Algorithm:</div>
              <div className="text-white text-sm">
                {artData.fractalAlgorithms[generatedArt.fractalType]?.name || generatedArt.fractalType}
              </div>
              <div className="text-xs text-[#8888FF] mt-1">
                {artData.fractalAlgorithms[generatedArt.fractalType]?.description}
              </div>
            </div>
            <div>
              <div className="text-sm text-[#00FFFF] mb-1">Color Palette:</div>
              <div className="text-white text-sm">
                {generatedArt.colors?.length || currentGenerator.colors.length} therapeutic colors
              </div>
              <div className="text-xs text-[#8888FF] mt-1">
                ND-safe • Trauma-aware • TARA-21 compliant
              </div>
            </div>
          </div>

          {/* Art Theory Information (in learning mode) */}
          {mode === 'learning' && (
            <div className="art-theory mt-4 pt-4 border-t border-[#333]">
              <h5 className="text-md text-[#FFD700] mb-2">Fractal Mathematics</h5>
              <div className="text-sm text-white">
                <div className="mb-2">
                  <strong>Iterations:</strong> {generatedArt.parameters?.iterations || 8} -
                  Higher values create more detail but require more computation
                </div>
                <div className="mb-2">
                  <strong>Therapeutic Motion:</strong> {generatedArt.therapeutic?.motion} -
                  Gentle pulsing respects ND-safe standards
                </div>
                <div>
                  <strong>Color Safety:</strong> All colors from TARA-21 palette ensure neurological safety
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Art Gallery Preview (in art mode) */}
      {mode === 'art' && generatedArt && (
        <div className="art-gallery-preview mt-6 pt-4 border-t border-[#333]">
          <h4 className="text-lg text-[#FFD700] mb-3">Output Options</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {currentGenerator.outputs.map((output, i) => (
              <div key={i} className="bg-[#2a2e37] p-3 rounded">
                <div className="text-[#00FFFF] font-medium">{output}</div>
                <div className="text-[#8888FF] text-xs mt-1">
                  {artData.outputFormats[output]?.uses?.join(', ') || 'Digital artwork'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
