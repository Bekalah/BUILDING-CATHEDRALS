// Advanced Consciousness Engine - The Heart of the Cathedral System
// Integrates all systems (fractals, music, art, story) with consciousness-responsive AI

import * as THREE from 'three';
import * as Tone from 'tone';
import codexData from '../data/codex_144_99.json';
import realmData from '../data/realms.json';
import characterData from '../data/characters.json';

export class ConsciousnessEngine {
  constructor() {
    this.consciousnessField = 0.5;
    this.activeNodes = new Set();
    this.realmConnections = new Map();
    this.consciousnessHistory = [];
    this.therapeuticState = {
      ndSafe: true,
      traumaAware: true,
      currentMood: 'neutral',
      energyLevel: 0.5,
      integration: 0.5
    };

    this.initializeConsciousnessField();
  }

  async initializeConsciousnessField() {
    // Initialize the consciousness field with quantum-inspired algorithms
    this.consciousnessField = this.generateInitialConsciousness();

    // Set up consciousness monitoring
    this.startConsciousnessMonitoring();

    // Initialize realm connections
    this.initializeRealmConnections();

    console.log('🧠 Consciousness Engine initialized with field strength:', this.consciousnessField);
  }

  generateInitialConsciousness() {
    // Generate initial consciousness value using multiple factors
    const timeSeed = Date.now() % 1000;
    const nodeCount = Object.keys(codexData.nodes).length;
    const realmCount = Object.keys(realmData.realms).length;

    // Use golden ratio and fibonacci for natural consciousness baseline
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

    const baseConsciousness = (timeSeed * goldenRatio + nodeCount * realmCount) % 1.0;
    const fibonacciInfluence = fibonacci[nodeCount % fibonacci.length] / 144;

    return Math.max(0.1, Math.min(0.9, baseConsciousness + fibonacciInfluence * 0.1));
  }

  startConsciousnessMonitoring() {
    // Monitor consciousness field changes
    setInterval(() => {
      this.updateConsciousnessField();
      this.consciousnessHistory.push({
        timestamp: Date.now(),
        value: this.consciousnessField,
        therapeuticState: { ...this.therapeuticState }
      });

      // Keep history manageable
      if (this.consciousnessHistory.length > 1000) {
        this.consciousnessHistory.shift();
      }
    }, 100); // 10 FPS monitoring
  }

  updateConsciousnessField() {
    // Consciousness field evolves based on multiple factors
    const factors = [
      this.calculateNodeInfluence(),
      this.calculateRealmHarmony(),
      this.calculateTherapeuticResonance(),
      this.calculateTemporalFlow()
    ];

    // Weighted average with consciousness momentum
    const newField = factors.reduce((sum, factor, index) => {
      const weights = [0.3, 0.25, 0.25, 0.2];
      return sum + factor * weights[index];
    }, 0);

    // Apply consciousness momentum (field tends to stay stable)
    const momentum = 0.1;
    this.consciousnessField = this.consciousnessField * (1 - momentum) + newField * momentum;

    // Ensure bounds
    this.consciousnessField = Math.max(0.1, Math.min(0.9, this.consciousnessField));
  }

  calculateNodeInfluence() {
    // Calculate influence based on active nodes
    if (this.activeNodes.size === 0) return 0.5;

    let totalInfluence = 0;
    for (const nodeId of this.activeNodes) {
      const node = codexData.nodes[nodeId];
      if (node) {
        const nodePower = node.attributes ?
          Object.values(node.attributes).reduce((sum, val) => sum + val, 0) / Object.keys(node.attributes).length :
          0.5;
        totalInfluence += nodePower;
      }
    }

    return totalInfluence / this.activeNodes.size;
  }

  calculateRealmHarmony() {
    // Calculate harmony based on connected realms
    const connectedRealms = this.realmConnections.size;
    const totalRealms = Object.keys(realmData.realms).length;

    return connectedRealms / totalRealms;
  }

  calculateTherapeuticResonance() {
    // Calculate therapeutic resonance based on current state
    const { ndSafe, traumaAware, currentMood, energyLevel, integration } = this.therapeuticState;

    let resonance = 0.5;

    if (ndSafe) resonance += 0.1;
    if (traumaAware) resonance += 0.1;
    if (currentMood === 'positive') resonance += 0.1;
    if (energyLevel > 0.6) resonance += 0.1;
    if (integration > 0.6) resonance += 0.1;

    return Math.min(1.0, resonance);
  }

  calculateTemporalFlow() {
    // Calculate temporal flow based on consciousness history
    if (this.consciousnessHistory.length < 10) return 0.5;

    const recent = this.consciousnessHistory.slice(-10);
    const trend = recent.reduce((acc, curr, index) => {
      if (index === 0) return 0;
      return acc + (curr.value - recent[index - 1].value);
    }, 0) / recent.length;

    // Normalize trend to 0-1 range
    return Math.max(0, Math.min(1, 0.5 + trend * 10));
  }

  activateNode(nodeId) {
    this.activeNodes.add(nodeId);

    // Update consciousness based on node activation
    const node = codexData.nodes[nodeId];
    if (node) {
      const nodeInfluence = node.attributes ?
        Object.values(node.attributes).reduce((sum, val) => sum + val, 0) / Object.keys(node.attributes).length :
        0.5;

      // Consciousness responds to node activation
      this.consciousnessField = this.consciousnessField * 0.8 + nodeInfluence * 0.2;
    }

    console.log(`🧠 Node ${nodeId} activated. Consciousness field: ${this.consciousnessField.toFixed(3)}`);
  }

  deactivateNode(nodeId) {
    this.activeNodes.delete(nodeId);
    console.log(`🧠 Node ${nodeId} deactivated. Active nodes: ${this.activeNodes.size}`);
  }

  initializeRealmConnections() {
    // Initialize connections between realms
    for (const [realmId, realm] of Object.entries(realmData.realms)) {
      this.realmConnections.set(realmId, {
        connectedNodes: new Set(realm.codexNodes || []),
        harmony: 0.5,
        energyFlow: 0.5
      });
    }
  }

  connectRealms(realm1, realm2) {
    // Create connection between realms
    const connectionId = `${realm1}-${realm2}`;
    const connection = {
      id: connectionId,
      realm1,
      realm2,
      strength: 0.5,
      energyFlow: 0.3,
      lastActive: Date.now()
    };

    this.realmConnections.set(connectionId, connection);

    // Update consciousness based on realm connection
    this.consciousnessField += 0.05;
    this.consciousnessField = Math.min(0.9, this.consciousnessField);

    console.log(`🌌 Realms ${realm1} and ${realm2} connected. Consciousness enhanced.`);
  }

  // Generate consciousness-responsive parameters for different systems
  generateFractalParams(codexNode) {
    const node = codexData.nodes[codexNode];
    if (!node) return null;

    const baseIterations = Math.floor(30 + this.consciousnessField * 70);
    const consciousnessInfluence = this.consciousnessField;

    return {
      type: node.fractalType,
      iterations: baseIterations,
      power: 2 + consciousnessInfluence * 4,
      bailout: 4 + consciousnessInfluence * 8,
      consciousnessField: this.consciousnessField,
      therapeutic: this.therapeuticState.ndSafe,
      colors: this.generateConsciousnessColors(node.element, consciousnessInfluence),
      parameters: {
        timeScale: 0.5 + consciousnessInfluence * 0.5,
        amplitude: 0.3 + consciousnessInfluence * 0.4,
        frequency: 0.1 + consciousnessInfluence * 0.2
      }
    };
  }

  generateMusicParams(codexNode) {
    const node = codexData.nodes[codexNode];
    if (!node) return null;

    const consciousnessInfluence = this.consciousnessField;

    return {
      baseTone: node.harmonicTone,
      scale: this.getConsciousnessScale(consciousnessInfluence),
      tempo: Math.floor(50 + consciousnessInfluence * 40),
      instruments: this.getConsciousnessInstruments(node.element, consciousnessInfluence),
      pattern: this.getConsciousnessPattern(consciousnessInfluence),
      frequencies: {
        solfeggio: node.frequencies || [396, 417, 528, 639, 741, 852],
        binaural: this.getBinauralParams(consciousnessInfluence),
        consciousness: this.consciousnessField
      },
      therapeutic: {
        ...this.therapeuticState,
        consciousnessEnhanced: true
      }
    };
  }

  generateStoryParams(codexNode) {
    const node = codexData.nodes[codexNode];
    if (!node) return null;

    return {
      archetype: node.type,
      consciousness: this.consciousnessField,
      therapeutic: this.therapeuticState,
      narrativeStyle: this.getNarrativeStyle(this.consciousnessField),
      characterInfluence: this.getCharacterInfluence(node),
      plotStructure: this.getPlotStructure(this.consciousnessField),
      themes: this.getConsciousnessThemes(node, this.consciousnessField)
    };
  }

  // Consciousness-responsive helper methods
  generateConsciousnessColors(element, consciousness) {
    const baseColors = {
      water: ['#2EA66F', '#4A90E2', '#9370DB', '#E987A9'],
      fire: ['#FFD700', '#C7323B', '#E77A2E', '#F39B1A'],
      earth: ['#8B7500', '#2EA66F', '#1FA582', '#3BC6B8'],
      air: ['#EDEBE6', '#F4F0EA', '#9CC8F6', '#D8A46C']
    };

    const colors = baseColors[element] || baseColors.water;

    // Modify colors based on consciousness
    return colors.map(color => {
      const factor = 0.7 + consciousness * 0.3;
      return this.adjustColorBrightness(color, factor);
    });
  }

  adjustColorBrightness(hexColor, factor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const newR = Math.min(255, Math.floor(r * factor));
    const newG = Math.min(255, Math.floor(g * factor));
    const newB = Math.min(255, Math.floor(b * factor));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  getConsciousnessScale(consciousness) {
    const scales = ['aeolian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'harmonic-minor'];
    const index = Math.floor(consciousness * scales.length);
    return scales[Math.min(index, scales.length - 1)];
  }

  getConsciousnessInstruments(element, consciousness) {
    const instrumentSets = {
      water: ['crystal-bowls', 'soft-synth', 'water-chimes', 'ethereal-voices'],
      fire: ['deep-bass', 'brass-choir', 'celestial-harp', 'fire-drums'],
      earth: ['earth-drums', 'didgeridoo', 'bone-flutes', 'grounding-bass'],
      air: ['wisdom-bells', 'deep-ambience', 'metal-chimes', 'pure-tones']
    };

    const instruments = instrumentSets[element] || instrumentSets.water;
    const count = Math.floor(2 + consciousness * 3); // 2-5 instruments

    return instruments.slice(0, count);
  }

  getConsciousnessPattern(consciousness) {
    const patterns = ['cyclic-phases', 'ascending-build', 'flowing-intuition', 'grounding-pulse', 'lattice-resonance'];
    const index = Math.floor(consciousness * patterns.length);
    return patterns[Math.min(index, patterns.length - 1)];
  }

  getBinauralParams(consciousness) {
    const programs = [
      { carrier: 136.1, offset: 4 },   // Deep relaxation
      { carrier: 40, offset: 2 },      // Creativity
      { carrier: 432, offset: 8 },     // Manifestation
      { carrier: 7.83, offset: 1 },    // Grounding
      { carrier: 111, offset: 3 }      // Clarity
    ];

    const index = Math.floor(consciousness * programs.length);
    return programs[Math.min(index, programs.length - 1)];
  }

  getNarrativeStyle(consciousness) {
    if (consciousness < 0.3) return 'contemplative';
    if (consciousness < 0.6) return 'balanced';
    return 'expansive';
  }

  getCharacterInfluence(node) {
    // Find characters associated with this node
    const characters = Object.values(characterData.characters)
      .filter(char => char.codexNode === node.id);

    return characters.map(char => ({
      id: char.id,
      name: char.name,
      influence: char.personality ?
        Object.values(char.personality).reduce((sum, val) => sum + val, 0) / Object.keys(char.personality).length :
        0.5
    }));
  }

  getPlotStructure(consciousness) {
    if (consciousness < 0.4) return 'healing-journey';
    if (consciousness < 0.7) return 'transformation-arc';
    return 'manifestation-cycle';
  }

  getConsciousnessThemes(node, consciousness) {
    const baseThemes = ['consciousness', 'transformation', 'integration'];

    if (node.element === 'water') baseThemes.push('flow', 'intuition', 'emotional-intelligence');
    if (node.element === 'fire') baseThemes.push('will', 'manifestation', 'creative-power');
    if (node.element === 'earth') baseThemes.push('grounding', 'stability', 'ancient-wisdom');
    if (node.element === 'air') baseThemes.push('clarity', 'communication', 'higher-knowledge');

    if (consciousness > 0.7) baseThemes.push('transcendence', 'unity', 'cosmic-awareness');
    if (consciousness < 0.3) baseThemes.push('foundation', 'grounding', 'basic-integration');

    return baseThemes;
  }

  // Get current consciousness state for UI display
  getConsciousnessState() {
    return {
      field: this.consciousnessField,
      activeNodes: Array.from(this.activeNodes),
      connectedRealms: this.realmConnections.size,
      therapeuticState: this.therapeuticState,
      history: this.consciousnessHistory.slice(-50), // Last 5 seconds
      recommendations: this.getConsciousnessRecommendations()
    };
  }

  getConsciousnessRecommendations() {
    const recommendations = [];

    if (this.consciousnessField < 0.3) {
      recommendations.push('Consider grounding activities or earth element nodes');
    }

    if (this.consciousnessField > 0.8) {
      recommendations.push('High consciousness field - excellent for manifestation work');
    }

    if (this.therapeuticState.energyLevel < 0.4) {
      recommendations.push('Energy level low - consider rest or gentle activities');
    }

    if (this.activeNodes.size === 0) {
      recommendations.push('Activate a codex node to begin consciousness exploration');
    }

    return recommendations;
  }

  // Export consciousness data for analysis
  exportConsciousnessData() {
    return {
      consciousnessField: this.consciousnessField,
      history: this.consciousnessHistory,
      activeNodes: Array.from(this.activeNodes),
      therapeuticState: this.therapeuticState,
      realmConnections: Array.from(this.realmConnections.entries()),
      metadata: {
        exportedAt: new Date().toISOString(),
        sessionDuration: this.consciousnessHistory.length * 0.1, // seconds
        averageConsciousness: this.calculateAverageConsciousness()
      }
    };
  }

  calculateAverageConsciousness() {
    if (this.consciousnessHistory.length === 0) return 0.5;

    const sum = this.consciousnessHistory.reduce((acc, curr) => acc + curr.value, 0);
    return sum / this.consciousnessHistory.length;
  }

  // Reset consciousness field (for new sessions)
  resetConsciousness() {
    this.consciousnessField = this.generateInitialConsciousness();
    this.activeNodes.clear();
    this.consciousnessHistory = [];
    this.therapeuticState = {
      ndSafe: true,
      traumaAware: true,
      currentMood: 'neutral',
      energyLevel: 0.5,
      integration: 0.5
    };

    console.log('🧠 Consciousness field reset');
  }
}

// Export singleton instance
export const consciousnessEngine = new ConsciousnessEngine();

// Auto-initialize
consciousnessEngine.initializeConsciousnessField().catch(console.error);

export default consciousnessEngine;
