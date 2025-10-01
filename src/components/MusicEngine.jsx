import React, { useState, useEffect, useRef } from 'react';
import { useMode } from '../hooks/useMode';
import musicData from '../data/music-engine.json';
import azureAI from '../services/azure-ai';

export default function MusicEngine({ codexNode, therapeuticFocus, onMusicGenerated }) {
  const { mode, config } = useMode();
  const [currentPreset, setCurrentPreset] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);

  // Initialize music engine based on codex node
  useEffect(() => {
    if (codexNode) {
      initializeMusicEngine(codexNode);
    }
    return () => {
      // Cleanup oscillators
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      oscillatorsRef.current = [];
    };
  }, [codexNode]);

  const initializeMusicEngine = (node) => {
    // Find appropriate music preset for the codex node
    const preset = findPresetForNode(node);
    if (preset) {
      setCurrentPreset(preset);
    }
  };

  const findPresetForNode = (nodeId) => {
    // Find preset that matches the codex node
    for (const [presetId, preset] of Object.entries(musicData.harmonicPresets)) {
      if (preset.codexNode === nodeId) {
        return preset;
      }
    }
    // Return default preset if no match
    return Object.values(musicData.harmonicPresets)[0];
  };

  const generateMusicParameters = async () => {
    if (!currentPreset || !therapeuticFocus) return;

    setIsGenerating(true);

    try {
      // Try Azure AI first, fall back to preset data if unavailable
      const result = await azureAI.generateMusicParameters(
        currentPreset.mood,
        currentPreset.codexNode,
        therapeuticFocus
      );

      const musicParams = {
        ...currentPreset,
        ...result,
        therapeuticFocus,
        generatedAt: new Date().toISOString()
      };

      setGeneratedMusic(musicParams);

      if (onMusicGenerated) {
        onMusicGenerated(musicParams);
      }
    } catch (error) {
      console.error('Music generation failed:', error);
      // Use preset data as fallback
      const fallbackParams = {
        ...currentPreset,
        therapeuticFocus,
        generatedAt: new Date().toISOString(),
        metadata: { model: 'fallback', therapeutic: true, ndSafe: true }
      };
      setGeneratedMusic(fallbackParams);
    } finally {
      setIsGenerating(false);
    }
  };

  const playGeneratedMusic = async () => {
    if (!generatedMusic) return;

    try {
      // Initialize Web Audio API context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = audioContextRef.current;

      // Resume context if suspended (required by some browsers)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      setIsPlaying(true);

      // Stop any existing oscillators
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      oscillatorsRef.current = [];

      // Create oscillators based on solfeggio frequencies
      const frequencies = generatedMusic.frequencies?.solfeggio || [396, 417, 528];

      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

        // Create gentle amplitude modulation for therapeutic effect
        const modulation = ctx.createOscillator();
        const modGain = ctx.createGain();

        modulation.frequency.setValueAtTime(0.1, ctx.currentTime); // 0.1 Hz for slow modulation
        modGain.gain.setValueAtTime(0.3, ctx.currentTime); // 30% modulation depth

        modulation.connect(modGain);
        modGain.connect(gainNode.gain);
        modulation.start();

        // Set overall volume (gentle for ND safety)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime + index * 0.5); // Stagger starts

        oscillatorsRef.current.push(oscillator);
      });

      // Auto-stop after therapeutic duration
      const duration = (generatedMusic.therapeutic?.duration || '20 minutes')
        .match(/\d+/)[0] * 60 * 1000; // Convert to milliseconds

      setTimeout(() => {
        stopMusic();
      }, duration);

    } catch (error) {
      console.error('Music playback failed:', error);
      setIsPlaying(false);
    }
  };

  const stopMusic = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
    setIsPlaying(false);
  };

  if (!currentPreset) {
    return (
      <div className="music-engine-placeholder">
        <div className="text-center p-8">
          <div className="text-[#FFD700] text-lg mb-4">Music Awaits</div>
          <div className="text-[#8888FF] text-sm">
            Connect with a codex node to unlock harmonic potential
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="music-engine bg-black bg-opacity-80 p-6 rounded-lg max-w-4xl mx-auto">
      {/* Music Header */}
      <div className="music-header mb-6">
        <h2 className="text-2xl text-[#FFD700] mb-2">{currentPreset.name}</h2>
        <h3 className="text-lg text-[#8888FF] mb-4">Harmonic Therapy Engine</h3>

        {/* Current Preset Info */}
        <div className="preset-info bg-[#1a1e27] p-4 rounded mb-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-[#00FFFF] mb-2">Base Tone:</div>
              <div className="text-white font-mono">{currentPreset.baseTone} ({musicData.toneMappings[currentPreset.baseTone]?.frequency} Hz)</div>
            </div>
            <div>
              <div className="text-sm text-[#00FFFF] mb-2">Scale:</div>
              <div className="text-white">{currentPreset.scale}</div>
            </div>
            <div>
              <div className="text-sm text-[#00FFFF] mb-2">Tempo:</div>
              <div className="text-white">{currentPreset.tempo} BPM</div>
            </div>
            <div>
              <div className="text-sm text-[#00FFFF] mb-2">Mood:</div>
              <div className="text-white">{currentPreset.mood}</div>
            </div>
          </div>
        </div>

        {/* Therapeutic Information (in learning/research modes) */}
        {config.showOutputs && currentPreset.therapeutic && (
          <div className="therapeutic-info bg-[#2a2e37] p-4 rounded mb-4">
            <div className="text-sm text-[#FFD700] mb-2">Therapeutic Focus:</div>
            <div className="text-white text-sm mb-2">
              {currentPreset.therapeutic.focuses.join(', ')}
            </div>
            <div className="text-xs text-[#8888FF]">
              Duration: {currentPreset.therapeutic.duration} |
              Contraindications: {currentPreset.therapeutic.contraindications.join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* Music Controls */}
      <div className="music-controls mb-6">
        <div className="flex gap-4 justify-center">
          {!generatedMusic ? (
            <button
              onClick={generateMusicParameters}
              disabled={isGenerating}
              className="bg-[#FFD700] text-[#0a0e17] px-6 py-3 rounded font-bold hover:bg-[#FFC400] disabled:opacity-50 transition-colors"
            >
              {isGenerating ? 'Generating Parameters...' : 'Generate Music Therapy'}
            </button>
          ) : (
            <>
              <button
                onClick={isPlaying ? stopMusic : playGeneratedMusic}
                className={`px-6 py-3 rounded font-bold transition-colors ${
                  isPlaying
                    ? 'bg-[#C7323B] text-white hover:bg-[#B72A33]'
                    : 'bg-[#2EA66F] text-white hover:bg-[#258657]'
                }`}
              >
                {isPlaying ? 'Stop Music' : 'Play Therapeutic Music'}
              </button>
              <button
                onClick={generateMusicParameters}
                disabled={isGenerating}
                className="bg-[#4A90E2] text-white px-6 py-3 rounded font-bold hover:bg-[#3A70C2] disabled:opacity-50 transition-colors"
              >
                {isGenerating ? 'Regenerating...' : 'Generate New Variation'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generated Music Display */}
      {generatedMusic && (
        <div className="generated-music bg-[#1a1e27] p-4 rounded">
          <h4 className="text-lg text-[#FFD700] mb-3">Generated Parameters</h4>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-[#00FFFF] mb-1">Frequencies:</div>
              <div className="text-white text-sm">
                Solfeggio: {generatedMusic.frequencies?.solfeggio?.join(', ')} Hz
              </div>
              <div className="text-white text-sm">
                Binaural: {generatedMusic.frequencies?.binaural?.carrier} Hz ± {generatedMusic.frequencies?.binaural?.offset} Hz
              </div>
            </div>
            <div>
              <div className="text-sm text-[#00FFFF] mb-1">Instruments:</div>
              <div className="text-white text-sm">
                {generatedMusic.instruments?.join(', ') || currentPreset.instruments.join(', ')}
              </div>
            </div>
          </div>

          {/* Playback Status */}
          {isPlaying && (
            <div className="playback-status bg-[#2a2e37] p-3 rounded">
              <div className="text-sm text-[#FFD700]">Now Playing:</div>
              <div className="text-white text-sm">
                Therapeutic {currentPreset.mood} music for {therapeuticFocus}
              </div>
              <div className="text-xs text-[#8888FF] mt-1">
                ND-safe • Trauma-aware • {generatedMusic.therapeutic?.duration} session
              </div>
            </div>
          )}
        </div>
      )}

      {/* Music Theory Information (in learning mode) */}
      {mode === 'learning' && (
        <div className="music-theory mt-6 pt-4 border-t border-[#333]">
          <h4 className="text-lg text-[#FFD700] mb-3">Harmonic Theory</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[#00FFFF] mb-1">Solfeggio Frequencies:</div>
              <div className="text-white">
                {currentPreset.frequencies?.solfeggio?.map(freq =>
                  `${freq} Hz - ${musicData.solfeggioFrequencies[freq]?.name}`
                ).join('<br />')}
              </div>
            </div>
            <div>
              <div className="text-[#00FFFF] mb-1">Binaural Program:</div>
              <div className="text-white">
                {musicData.binauralPrograms[therapeuticFocus] ?
                  `${musicData.binauralPrograms[therapeuticFocus].purpose} (${musicData.binauralPrograms[therapeuticFocus].duration})` :
                  'Custom therapeutic program'
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
