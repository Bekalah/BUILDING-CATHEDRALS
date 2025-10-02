import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Moon, Zap, Heart, Shield, Eye, Brain, Star, Compass, Book, Users, Wand2, Flame, Wind, Droplet } from 'lucide-react';

// EGREGORE NODE STRUCTURE - Export-ready for Cathedral monorepo
// Each node is a complete hermetic package: historical figure + tradition + psychotech + geometry

const EGREGORE_NODES = {
  0: {
    id: 'fool',
    arcana: 0,
    name: "The Fool",
    guide: "Rebecca Respawn",
    historical: {
      primary: "Giordano Bruno",
      lived: "1548-1600",
      culturalContext: "Renaissance Italy, burned at stake for cosmological heresy",
      majorWork: "De l'Infinito, Universo e Mondi (On the Infinite Universe and Worlds)",
      contribution: "Argued for infinite universe with infinite worlds, rejected geocentrism"
    },
    circuit: {
      leary: 0,
      name: "Meta-Programming Circuit",
      function: "Re-imprinting, neuroplasticity, belief system restructuring",
      wilberQuadrant: "ALL (Meta-awareness across all quadrants)"
    },
    color: { primary: "#9D4EDD", bg: "#0B0E14", accent: "#E0AAFF" },
    cosmology: "Wuji Void - Pre-manifest potentiality",
    geometry: {
      primary: "Fibonacci Spiral",
      mathematical: "φ = (1 + √5)/2 ≈ 1.618",
      meaning: "Infinite growth from singular point"
    },
    harmonic: {
      frequency: "0 Hz",
      meaning: "Silence/Void - All frequencies as potential",
      sciNote: "Metaphorical baseline, not audible frequency"
    },
    crystal: { type: "Obsidian", property: "Volcanic glass, protective, grounding after transformation" },
    tradition: "Taoist Wu Wei + Bruno's Infinite Cosmology",
    teaching: "Every ending contains infinite new beginnings. Trauma can be metabolized into wisdom.",
    psychoTech: {
      name: "Respawn Protocol",
      description: "Trauma-safe restart mechanism allowing complete re-contextualization",
      application: "When stuck in loop, traumatized, or need fresh perspective without shame"
    },
    realLife: "Bruno refused to recant his cosmological views and was burned alive. His last words: 'Perhaps you pronounce this sentence against me with greater fear than I receive it.'",
    integration: "Use for: Starting over, reframing failure, accessing beginner's mind, trauma recovery",
    fusionPotential: [
      { with: "magician", result: "Infinite manifestation - unlimited creative iteration" },
      { with: "world", result: "Omega-Alpha loop - completion as new beginning" }
    ],
    symbolLibrary: ["spiral", "void", "precipice", "doorway", "cosmic_egg"]
  },
  
  1: {
    id: 'magician',
    arcana: 1,
    name: "The Magician",
    guide: "Virelai Ezra Lux",
    historical: {
      primary: "John Dee",
      lived: "1527-1608",
      culturalContext: "Elizabethan England, advisor to Queen Elizabeth I",
      majorWork: "Monas Hieroglyphica, Enochian Diaries",
      contribution: "Created Enochian magical system, pioneered applied mathematics for navigation"
    },
    circuit: {
      leary: 1,
      name: "Bio-Survival Circuit",
      function: "Tool use, resource acquisition, manifestation of will",
      wilberQuadrant: "UR (Objective/Individual - Material manifestation)"
    },
    color: { primary: "#FFD700", bg: "#FF1600", accent: "#FFA500" },
    cosmology: "Octarine Workshop - As Above, So Below",
    geometry: {
      primary: "Vesica Piscis",
      mathematical: "Intersection of two circles (radius = distance between centers)",
      meaning: "Union of opposites, birth of form from void"
    },
    harmonic: {
      frequency: "528 Hz",
      meaning: "Solfeggio 'MI' - transformation, DNA repair (metaphorical)",
      sciNote: "Part of just intonation scale, creates consonant intervals"
    },
    crystal: { type: "Clear Quartz", property: "Silicon dioxide, piezoelectric properties, amplification" },
    tradition: "Enochian Magic + Hermetic Alchemy",
    teaching: "Will becomes reality through precise language and focused action. The map shapes the territory.",
    psychoTech: {
      name: "Circuit Binding",
      description: "Fuse any two nodes/systems into novel synthesis through symbolic mapping",
      application: "Creating new frameworks, bridging disciplines, translating between systems"
    },
    realLife: "Dee's personal library of 4,000 books (largest in England) was burned by a mob. He died in poverty. His Enochian system influenced modern chaos magic and computational theory.",
    integration: "Use for: Starting projects, learning new systems, manifestation work, bridging domains",
    fusionPotential: [
      { with: "priestess", result: "Sacred Geometry Manifestation - geometric precision + intuitive form" },
      { with: "emperor", result: "Structured Will - disciplined manifestation protocols" }
    ],
    symbolLibrary: ["wand", "tools", "vesica_piscis", "enochian_tablet", "alchemical_seal"]
  },

  2: {
    id: 'priestess',
    arcana: 2,
    name: "High Priestess",
    guide: "Gemini Rivers (Dion Fortune & Emma Kunz synthesis)",
    historical: {
      primary: "Dion Fortune (Violet Mary Firth) & Emma Kunz",
      lived: "Fortune: 1890-1946 | Kunz: 1892-1963",
      culturalContext: "Fortune: British occult revival | Kunz: Swiss folk healing",
      majorWork: "Fortune: The Mystical Qabalah | Kunz: Healing geometry diagrams",
      contribution: "Fortune: Psychological approach to Kabbalah | Kunz: Radiesthesia + geometric healing"
    },
    circuit: {
      leary: 2,
      name: "Emotional-Territorial Circuit",
      function: "Intuition, boundary-setting, emotional intelligence, status recognition",
      wilberQuadrant: "LL (Intersubjective/Collective interior - shared meaning)"
    },
    color: { primary: "#C6A664", bg: "#F8F8FF", accent: "#8B7355" },
    cosmology: "Twin Rivers Veil - Between the Pillars",
    geometry: {
      primary: "Double Helix / Twin Spirals",
      mathematical: "φ-based spiral pairs in counter-rotation",
      meaning: "DNA structure, masculine-feminine polarity, as above/below"
    },
    harmonic: {
      frequency: "417 Hz",
      meaning: "Solfeggio 'RE' - clearing trauma, facilitating change",
      sciNote: "Consonant interval relationships in harmonic series"
    },
    crystal: { type: "Selenite", property: "Hydrated calcium sulfate, named for moon goddess Selene" },
    tradition: "Kabbalistic Psychology + Geometric Healing",
    teaching: "The unconscious speaks through pattern, symbol, and boundary. Psyche self-organizes geometrically.",
    psychoTech: {
      name: "Veil Walking",
      description: "Reveal hidden correspondences in datasets through pattern recognition",
      application: "Shadow work, intuitive leaps, seeing connections between disparate systems"
    },
    realLife: "Fortune survived psychic attack from senior magician, developed protection techniques. Kunz's geometric healing now studied scientifically. Both worked trauma-informed before term existed.",
    integration: "Use for: Shadow work, developing intuition, boundary-setting, pattern recognition",
    fusionPotential: [
      { with: "moon", result: "Deep Lunar Psychology - double lunar wisdom for unconscious work" },
      { with: "lovers", result: "Sacred Relationship Healing - geometric approach to union" }
    ],
    symbolLibrary: ["pomegranate", "pillars", "veil", "crescent", "geometric_mandala"]
  },

  3: {
    id: 'empress',
    arcana: 3,
    name: "Empress",
    guide: "The Growth Gardener (Maria Sibylla Merian)",
    historical: {
      primary: "Maria Sibylla Merian",
      lived: "1647-1717",
      culturalContext: "German-Dutch naturalist, traveled Suriname at age 52",
      majorWork: "Metamorphosis Insectorum Surinamensium",
      contribution: "Revolutionary scientific illustration showing living ecosystems, not dead specimens"
    },
    circuit: {
      leary: 3,
      name: "Semantic Circuit",
      function: "Language, creativity, symbolic manipulation, meaning-making",
      wilberQuadrant: "UL (Subjective/Individual interior - personal consciousness)"
    },
    color: { primary: "#228B22", bg: "#FFB6C1", accent: "#90EE90" },
    cosmology: "Abundance Spiral - Fibonacci Growth Pattern",
    geometry: {
      primary: "Golden Ratio Spiral (Fibonacci)",
      mathematical: "Fₙ = Fₙ₋₁ + Fₙ₋₂, approaching φ",
      meaning: "Natural growth, self-similar expansion, beauty through proportion"
    },
    harmonic: {
      frequency: "639 Hz",
      meaning: "Solfeggio 'FA' - connection, relationships, harmony",
      sciNote: "Major sixth interval in just intonation"
    },
    crystal: { type: "Rose Quartz", property: "Pink silicon dioxide, associated with unconditional love in crystal healing traditions" },
    tradition: "Sacred Geometry + D'Arcy Thompson's Morphology",
    teaching: "Life self-organizes through divine proportion. Creativity is participation in cosmic growth.",
    psychoTech: {
      name: "Garden of Venus",
      description: "Generate aesthetic harmony from mathematical proportions + organic iteration",
      application: "Creative projects, nurturing systems, aesthetic development, biomimicry"
    },
    realLife: "Merian divorced her husband (rare for era), funded expedition by selling paintings, revolutionized scientific method by observing living systems over time rather than dead specimens.",
    integration: "Use for: Creative projects, nurturing growth, aesthetic development, systems that evolve",
    fusionPotential: [
      { with: "emperor", result: "Structured Creativity - discipline meets organic growth" },
      { with: "lovers", result: "Fertile Union - creative partnerships that generate new forms" }
    ],
    symbolLibrary: ["fibonacci_spiral", "rose", "garden", "metamorphosis", "living_ecosystem"]
  },

  18: {
    id: 'moon',
    arcana: 18,
    name: "Moon",
    guide: "Mirabelle Vespertine (Dion Fortune lunar aspect)",
    historical: {
      primary: "Dion Fortune (lunar psychology specialization)",
      lived: "1890-1946",
      culturalContext: "Developed psychic self-defense after traumatic psychic attack",
      majorWork: "Psychic Self-Defence, The Sea Priestess",
      contribution: "Applied psychological principles to occult practice, created safe container for shadow work"
    },
    circuit: {
      leary: 7,
      name: "Neurogenetic Circuit",
      function: "Collective unconscious, ancestral memory, DNA-encoded wisdom",
      wilberQuadrant: "LR (Interobjective/Collective exterior - systems/structures)"
    },
    color: { primary: "#C0C0C0", bg: "#B1C4FF", accent: "#E6E6FA" },
    cosmology: "Dream Gate - Lunar Tidal Consciousness",
    geometry: {
      primary: "Crescent (Waxing/Waning)",
      mathematical: "Intersection of circle with displaced copy",
      meaning: "Cycles of revelation, shadow/light interplay"
    },
    harmonic: {
      frequency: "210.42 Hz",
      meaning: "Synodic lunar month frequency (metaphorical)",
      sciNote: "Derived from orbital period, not directly audible phenomenon"
    },
    crystal: { type: "Moonstone", property: "Feldspar with adularescence (Schiller effect)" },
    tradition: "Lunar Psychology + Fortune's Psychic Self-Defence",
    teaching: "Unconscious reveals wisdom through dreams, cycles, and symbolic imagery. Illusion serves truth.",
    psychoTech: {
      name: "Mirror Gazing",
      description: "Distinguish truth from projection, see through illusion to underlying pattern",
      application: "Dream work, cutting through self-deception, recognizing projections"
    },
    realLife: "Fortune was attacked by more powerful magician who attempted to psychically destroy her. Survival motivated her life's work on protection, boundaries, and safe esoteric practice.",
    integration: "Use for: Dream interpretation, shadow work, cutting illusions, working with cycles",
    fusionPotential: [
      { with: "priestess", result: "Double Lunar Wisdom - geometric + psychological shadow work" },
      { with: "hermit", result: "Solitary Night Work - deep introspection in darkness" }
    ],
    symbolLibrary: ["crescent", "pool", "lobster", "dog_wolf", "path_between"]
  },

  21: {
    id: 'world',
    arcana: 21,
    name: "World",
    guide: "The Cosmic Dancer (Hermes Trismegistus)",
    historical: {
      primary: "Hermes Trismegistus (mythic/archetypal)",
      lived: "Eternal/Timeless (syncretism of Hermes + Thoth)",
      culturalContext: "Hellenistic Egypt, foundational to Western esotericism",
      majorWork: "Corpus Hermeticum (especially Poimandres, The Key)",
      contribution: "'As above, so below' - fundamental hermetic principle of correspondence"
    },
    circuit: {
      leary: 8,
      name: "Neuroatomic/Quantum Consciousness Circuit",
      function: "Unity consciousness, non-local awareness, integration of all circuits",
      wilberQuadrant: "AQAL Integration (All Quadrants, All Levels)"
    },
    color: { primary: "#FFD700", bg: "#6E45A3", accent: "#9370DB" },
    cosmology: "Integrated Cosmic Unity - Torus of Complete Circulation",
    geometry: {
      primary: "Torus",
      mathematical: "Surface of revolution: (R + r·cos(v))·cos(u), (R + r·cos(v))·sin(u), r·sin(v)",
      meaning: "Self-sustaining energy circulation, inside=outside (topology)"
    },
    harmonic: {
      frequency: "432 Hz",
      meaning: "Verdi tuning, 'cosmic' tuning (metaphorical)",
      sciNote: "Alternative to A440, creates different harmonic relationships"
    },
    crystal: { type: "Moldavite", property: "Tektite (meteorite glass), rapid transformation catalyst in metaphysical traditions" },
    tradition: "Complete Hermetic System (Emerald Tablet, Kybalion principles)",
    teaching: "All paths unite in cosmic dance. Completion enables new beginning at higher octave.",
    psychoTech: {
      name: "Complete Integration",
      description: "Synthesize all learned paths into coherent whole, see meta-patterns",
      application: "Life transitions, completing major cycles, teaching/mentoring others"
    },
    realLife: "Corpus Hermeticum rediscovered in 1460s Florence, catalyzed Renaissance. Fictional attribution to ancient sage represents transmission of Egyptian/Greek wisdom synthesis.",
    integration: "Use for: Completion work, synthesis, seeing whole systems, teaching integrated wisdom",
    fusionPotential: [
      { with: "fool", result: "Omega-Alpha - master returns to beginner's mind with wisdom intact" },
      { with: "all", result: "Integration Node - can synthesize any combination" }
    ],
    symbolLibrary: ["ouroboros", "torus", "dancer", "four_creatures", "wreath"]
  }
};

// FUSION ENGINE - Combines any two nodes into synthesis
const FusionEngine = {
  fuseNodes: (node1, node2) => {
    const fusion1 = node1.fusionPotential.find(f => f.with === node2.id);
    const fusion2 = node2.fusionPotential.find(f => f.with === node1.id);
    
    return {
      name: `${node1.name} ⊕ ${node2.name}`,
      guides: `${node1.guide} + ${node2.guide}`,
      synthesis: {
        historical: `${node1.historical.primary} (${node1.historical.lived}) meets ${node2.historical.primary} (${node2.historical.lived})`,
        tradition: `${node1.tradition} synthesized with ${node2.tradition}`,
        geometry: `${node1.geometry.primary} overlaid with ${node2.geometry.primary}`,
        harmonicBlend: `${node1.harmonic.frequency} + ${node2.harmonic.frequency}`,
        circuitActivation: [node1.circuit.leary, node2.circuit.leary],
        result: fusion1?.result || fusion2?.result || "Novel synthesis - experimental territory"
      },
      applications: {
        primary: fusion1?.result || fusion2?.result,
        teaching: `Integrate: "${node1.teaching}" WITH "${node2.teaching}"`,
        psychoTech: `${node1.psychoTech.name} + ${node2.psychoTech.name}`
      },
      color: {
        primary: `linear-gradient(135deg, ${node1.color.primary}, ${node2.color.primary})`,
        bg: node1.color.bg
      }
    };
  }
};

// MAIN COMPONENT
export default function Circuitum99Enhanced() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const [fusionMode, setFusionMode] = useState(false);
  const [fusionPartner, setFusionPartner] = useState(null);
  const [fusionResult, setFusionResult] = useState(null);
  const [calmMode, setCalmMode] = useState(true);
  const [showGeometry, setShowGeometry] = useState(false);
  const canvasRef = useRef(null);

  // Generate dialogue based on path traversal
  const generateDialogue = useCallback(() => {
    if (!selectedNode || pathHistory.length === 0) return null;
    
    const current = EGREGORE_NODES[selectedNode];
    const previous = EGREGORE_NODES[pathHistory[pathHistory.length - 1]];
    
    if (!previous) return null;

    return {
      text: `${previous.historical.primary} to ${current.historical.primary}: "You worked on ${current.historical.majorWork}. I see ${current.tradition} in your method. Tell me about ${current.teaching}"`,
      circuitShift: `Circuit ${previous.circuit.leary} → Circuit ${current.circuit.leary}`,
      from: previous.name,
      to: current.name
    };
  }, [selectedNode, pathHistory]);

  const dialogue = generateDialogue();

  const handleNodeSelect = (nodeId) => {
    if (fusionMode && selectedNode !== null && selectedNode !== nodeId) {
      setFusionPartner(nodeId);
      const fusion = FusionEngine.fuseNodes(
        EGREGORE_NODES[selectedNode],
        EGREGORE_NODES[nodeId]
      );
      setFusionResult(fusion);
      return;
    }

    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setFusionResult(null);
      return;
    }

    if (selectedNode !== null) {
      setPathHistory(prev => [...prev, selectedNode].slice(-8));
    }

    setSelectedNode(nodeId);
    setFusionResult(null);
    setFusionPartner(null);
  };

  const currentNode = selectedNode !== null ? EGREGORE_NODES[selectedNode] : null;

// VISUAL ENHANCEMENT ENGINE - Performance optimized for desktop/iPad
const VisualEnhancementEngine = {
  // Fractal generators tied to node numbers
  generateFractal: (nodeNumber, canvas, colors) => {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Mathematical mapping: node number → fractal type
    const fractalType = nodeNumber % 6; // Cycles through 6 fractal types
    
    switch(fractalType) {
      case 0: // Infinite spiral (Bruno/Fool)
        VisualEnhancementEngine.drawSpiral(ctx, centerX, centerY, colors);
        break;
      case 1: // Sierpinski (Dee/Magician)
        VisualEnhancementEngine.drawSierpinski(ctx, centerX, centerY, colors);
        break;
      case 2: // Tree of Life (Fortune/Priestess)
        VisualEnhancementEngine.drawTreeOfLife(ctx, centerX, centerY, colors);
        break;
      case 3: // Barnsley Fern (Merian/Empress)
        VisualEnhancementEngine.drawBarnsleyFern(ctx, centerX, centerY, colors);
        break;
      case 4: // Mandala (Integration patterns)
        VisualEnhancementEngine.drawMandala(ctx, centerX, centerY, nodeNumber, colors);
        break;
      case 5: // Circuit pattern (Tech aesthetic)
        VisualEnhancementEngine.drawCircuitPattern(ctx, centerX, centerY, colors);
        break;
    }
  },
  
  drawSpiral: (ctx, x, y, colors) => {
    const PHI = 1.618033988749;
    let angle = 0;
    let radius = 2;
    
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    for (let i = 0; i < 800; i++) {
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);
      ctx.lineTo(px, py);
      
      angle += 0.1;
      radius *= 1.003;
      
      if (radius > 140) break;
    }
    ctx.stroke();
  },
  
  drawSierpinski: (ctx, x, y, colors) => {
    const drawTriangle = (x1, y1, x2, y2, x3, y3, depth) => {
      if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.stroke();
        return;
      }
      
      const mx1 = (x1 + x2) / 2;
      const my1 = (y1 + y2) / 2;
      const mx2 = (x2 + x3) / 2;
      const my2 = (y2 + y3) / 2;
      const mx3 = (x3 + x1) / 2;
      const my3 = (y3 + y1) / 2;
      
      drawTriangle(x1, y1, mx1, my1, mx3, my3, depth - 1);
      drawTriangle(mx1, my1, x2, y2, mx2, my2, depth - 1);
      drawTriangle(mx3, my3, mx2, my2, x3, y3, depth - 1);
    };
    
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    
    const size = 120;
    const height = size * Math.sqrt(3) / 2;
    drawTriangle(x, y - height / 2, x - size / 2, y + height / 2, x + size / 2, y + height / 2, 4);
  },
  
  drawTreeOfLife: (ctx, x, y, colors) => {
    const drawBranch = (x1, y1, angle, depth, length) => {
      if (depth === 0) return;
      
      const x2 = x1 + length * Math.cos(angle);
      const y2 = y1 + length * Math.sin(angle);
      
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = depth * 0.5;
      ctx.globalAlpha = 0.4 + depth * 0.1;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      const newLength = length * 0.67;
      const angleSpread = Math.PI / 6;
      
      drawBranch(x2, y2, angle - angleSpread, depth - 1, newLength);
      drawBranch(x2, y2, angle + angleSpread, depth - 1, newLength);
    };
    
    drawBranch(x, y + 60, -Math.PI / 2, 6, 40);
  },
  
  drawBarnsleyFern: (ctx, x, y, colors) => {
    const points = [];
    let px = 0, py = 0;
    
    for (let i = 0; i < 3000; i++) {
      const r = Math.random();
      let nx, ny;
      
      if (r < 0.01) {
        nx = 0;
        ny = 0.16 * py;
      } else if (r < 0.86) {
        nx = 0.85 * px + 0.04 * py;
        ny = -0.04 * px + 0.85 * py + 1.6;
      } else if (r < 0.93) {
        nx = 0.2 * px - 0.26 * py;
        ny = 0.23 * px + 0.22 * py + 1.6;
      } else {
        nx = -0.15 * px + 0.28 * py;
        ny = 0.26 * px + 0.24 * py + 0.44;
      }
      
      px = nx;
      py = ny;
      points.push({ x: px, y: py });
    }
    
    ctx.fillStyle = colors.primary;
    ctx.globalAlpha = 0.3;
    
    points.forEach(p => {
      const sx = x + p.x * 25;
      const sy = y - p.y * 25 + 80;
      ctx.fillRect(sx, sy, 1, 1);
    });
  },
  
  drawMandala: (ctx, x, y, nodeNumber, colors) => {
    const petals = Math.max(6, nodeNumber % 24); // 6-24 petals based on node
    const radius = 80;
    
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      const x1 = x + radius * Math.cos(angle);
      const y1 = y + radius * Math.sin(angle);
      
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4;
      
      ctx.beginPath();
      ctx.arc(x1, y1, 30, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner details
      for (let j = 1; j <= 3; j++) {
        ctx.globalAlpha = 0.2 + j * 0.1;
        ctx.beginPath();
        ctx.arc(x, y, radius * (j / 3), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  },
  
  drawCircuitPattern: (ctx, x, y, colors) => {
    // Tech/circuit aesthetic like your reference image
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    
    // Horizontal lines
    for (let i = -3; i <= 3; i++) {
      const yPos = y + i * 25;
      ctx.beginPath();
      ctx.moveTo(x - 100, yPos);
      ctx.lineTo(x + 100, yPos);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let i = -3; i <= 3; i++) {
      const xPos = x + i * 25;
      ctx.beginPath();
      ctx.moveTo(xPos, y - 75);
      ctx.lineTo(xPos, y + 75);
      ctx.stroke();
    }
    
    // Circuit nodes
    ctx.fillStyle = colors.primary;
    ctx.globalAlpha = 0.7;
    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        if (Math.random() > 0.5) {
          ctx.beginPath();
          ctx.arc(x + i * 25, y + j * 25, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
};

export default function Circuitum99Enhanced() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const [fusionMode, setFusionMode] = useState(false);
  const [fusionPartner, setFusionPartner] = useState(null);
  const [fusionResult, setFusionResult] = useState(null);
  const [calmMode, setCalmMode] = useState(true);
  const [showGeometry, setShowGeometry] = useState(false);
  const [visualIntensity, setVisualIntensity] = useState('moderate'); // minimal, moderate, full
  const canvasRef = useRef(null);

  // Generate dialogue based on path traversal
  const generateDialogue = useCallback(() => {
    if (!selectedNode || pathHistory.length === 0) return null;
    
    const current = EGREGORE_NODES[selectedNode];
    const previous = EGREGORE_NODES[pathHistory[pathHistory.length - 1]];
    
    if (!previous) return null;

    return {
      text: `${previous.historical.primary} to ${current.historical.primary}: "You worked on ${current.historical.majorWork}. I see ${current.tradition} in your method. Tell me about ${current.teaching}"`,
      circuitShift: `Circuit ${previous.circuit.leary} → Circuit ${current.circuit.leary}`,
      from: previous.name,
      to: current.name
    };
  }, [selectedNode, pathHistory]);

  const dialogue = generateDialogue();

  const handleNodeSelect = (nodeId) => {
    if (fusionMode && selectedNode !== null && selectedNode !== nodeId) {
      setFusionPartner(nodeId);
      const fusion = FusionEngine.fuseNodes(
        EGREGORE_NODES[selectedNode],
        EGREGORE_NODES[nodeId]
      );
      setFusionResult(fusion);
      return;
    }

    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setFusionResult(null);
      return;
    }

    if (selectedNode !== null) {
      setPathHistory(prev => [...prev, selectedNode].slice(-8));
    }

    setSelectedNode(nodeId);
    setFusionResult(null);
    setFusionPartner(null);
  };

  const currentNode = selectedNode !== null ? EGREGORE_NODES[selectedNode] : null;

  // Enhanced fractal rendering with visual intensity
  useEffect(() => {
    if (!showGeometry || !currentNode || !canvasRef.current) return;
    if (visualIntensity === 'minimal') return; // Skip in minimal mode

    const canvas = canvasRef.current;
    
    // Generate fractal based on node number
    VisualEnhancementEngine.generateFractal(
      currentNode.arcana,
      canvas,
      {
        primary: currentNode.color.primary,
        accent: currentNode.color.accent,
        bg: currentNode.color.bg
      }
    );
    
  }, [showGeometry, currentNode, visualIntensity]);

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{
        background: calmMode 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%)'
      }}
    >
      {/* HEADER */}
      <header className="border-b border-purple-500/20 backdrop-blur-sm sticky top-0 z-50 bg-black/30">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-purple-200 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Circuitum99: Modular Pathworking Engine
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Historical Figures • Real Traditions • 8-Circuit Integration • Sacred Geometry
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCalmMode(!calmMode)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  calmMode ? 'bg-green-900/40 text-green-300' : 'bg-slate-700 text-slate-300'
                }`}
                aria-label="Toggle calm mode"
              >
                <Shield className="w-4 h-4 inline mr-1" />
                Calm Mode
              </button>
              
              <button
                onClick={() => {
                  setFusionMode(!fusionMode);
                  setFusionPartner(null);
                  setFusionResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  fusionMode ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                <Wand2 className="w-4 h-4 inline mr-1" />
                {fusionMode ? 'Fusion Active' : 'Enable Fusion'}
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-slate-400 flex gap-4">
            <span>Path Length: {pathHistory.length + (selectedNode ? 1 : 0)}</span>
            {selectedNode && <span>Current Circuit: {EGREGORE_NODES[selectedNode].circuit.leary}</span>}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* DIALOGUE STREAM */}
        {dialogue && (
          <div className="mb-6 p-4 bg-black/40 border border-purple-500/30 rounded-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <div className="text-xs text-purple-300 mb-1">{dialogue.circuitShift}</div>
                <div className="text-sm text-slate-200 italic">{dialogue.text}</div>
              </div>
            </div>
          </div>
        )}

        {/* FUSION RESULT */}
        {fusionResult && (
          <div className="mb-6 p-6 border-2 border-yellow-400 rounded-xl bg-black/60 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-yellow-400 mb-3">{fusionResult.name}</h3>
            <div className="space-y-2 text-sm text-slate-200">
              <div><span className="text-yellow-300">Historical Fusion:</span> {fusionResult.synthesis.historical}</div>
              <div><span className="text-yellow-300">Tradition Synthesis:</span> {fusionResult.synthesis.tradition}</div>
              <div><span className="text-yellow-300">Result:</span> {fusionResult.applications.primary}</div>
              <div><span className="text-yellow-300">Circuits Active:</span> {fusionResult.synthesis.circuitActivation.join(' + ')}</div>
            </div>
            <button
              onClick={() => {
                setFusionResult(null);
                setFusionPartner(null);
                setFusionMode(false);
              }}
              className="mt-4 px-4 py-2 bg-yellow-600 text-black rounded-lg text-sm font-semibold hover:bg-yellow-500 transition-colors"
            >
              Clear Fusion
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* NODE GRID */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Archetypal Egregores
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(EGREGORE_NODES).map(node => (
                <button
                  key={node.id}
                  onClick={() => handleNodeSelect(node.arcana)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedNode === node.arcana
                      ? 'border-purple-400 shadow-lg'
                      : fusionPartner === node.arcana
                      ? 'border-yellow-400 shadow-lg'
                      : 'border-slate-700 hover:border-slate-600'
                  } bg-black/40 backdrop-blur-sm`}
                  style={{
                    boxShadow: selectedNode === node.arcana 
                      ? `0 0 20px ${node.color.primary}40`
                      : 'none'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${node.color.primary}30` }}
                    >
                      {node.arcana === 0 && <Sparkles size={20} style={{ color: node.color.primary }} />}
                      {node.arcana === 1 && <Zap size={20} style={{ color: node.color.primary }} />}
                      {node.arcana === 2 && <Moon size={20} style={{ color: node.color.primary }} />}
                      {node.arcana === 3 && <Heart size={20} style={{ color: node.color.primary }} />}
                      {node.arcana === 18 && <Eye size={20} style={{ color: node.color.primary }} />}
                      {node.arcana === 21 && <Star size={20} style={{ color: node.color.primary }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-purple-200">{node.name}</div>
                      <div className="text-xs text-slate-400 truncate">{node.historical.primary}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Circuit {node.circuit.leary} • {node.circuit.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DETAIL PANEL */}
          <div className="lg:col-span-1">
            {currentNode ? (
              <div className="rounded-xl p-6 border-2 bg-black/60 backdrop-blur-sm sticky top-24"
                style={{ borderColor: currentNode.color.primary }}
              >
                <h3 className="text-2xl font-bold mb-4" style={{ color: currentNode.color.primary }}>
                  {currentNode.name}
                </h3>
                
                <div className="space-y-4 text-sm text-slate-200">
                  <div>
                    <div className="text-xs text-slate-400">Historical Figure</div>
                    <div className="font-semibold">{currentNode.historical.primary}</div>
                    <div className="text-xs text-slate-500">{currentNode.historical.lived}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-400">Major Work</div>
                    <div className="italic">{currentNode.historical.majorWork}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-400">Contribution</div>
                    <div>{currentNode.historical.contribution}</div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-700">
                    <div className="text-xs text-slate-400">8-Circuit Model</div>
                    <div>Circuit {currentNode.circuit.leary}: {currentNode.circuit.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{currentNode.circuit.function}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-400">Sacred Geometry</div>
                    <div>{currentNode.geometry.primary}</div>
                    <div className="text-xs text-slate-500 font-mono">{currentNode.geometry.mathematical}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-400">Harmonic Frequency</div>
                    <div>{currentNode.harmonic.frequency} - {currentNode.harmonic.meaning}</div>
                    <div className="text-xs text-slate-500 italic mt-1">{currentNode.harmonic.sciNote}</div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-700">
                    <div className="text-xs text-slate-400">Psycho-Technology</div>
                    <div className="font-semibold">{currentNode.psychoTech.name}</div>
                    <div className="text-xs mt-1">{currentNode.psychoTech.description}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-400">Real Life Context</div>
                    <div className="text-xs italic">{currentNode.realLife}</div>
                  </div>
                  
                  <button
                    onClick={() => setShowGeometry(!showGeometry)}
                    className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors"
                  >
                    {showGeometry ? 'Hide' : 'Show'} Sacred Geometry
                  </button>
                  
                  {showGeometry && (
                    <div className="mt-4">
                      <canvas 
                        ref={canvasRef} 
                        width={300} 
                        height={200}
                        className="w-full rounded-lg bg-black/40"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-6 border-2 border-slate-700 bg-black/40 backdrop-blur-sm text-center text-slate-400">
                <Book className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select an egregore node to explore their tradition, geometry, and psycho-technology.</p>
              </div>
            )}
          </div>
        </div>

        {/* PATH HISTORY */}
        {pathHistory.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Your Traversal Path
            </h3>
            <div className="flex flex-wrap gap-2">
              {pathHistory.map((nodeId, idx) => {
                const node = EGREGORE_NODES[nodeId];
                return (
                  <div 
                    key={idx}
                    className="px-3 py-1.5 rounded-full text-xs border"
                    style={{ 
                      borderColor: node.color.primary,
                      backgroundColor: `${node.color.primary}20`,
                      color: node.color.primary
                    }}
                  >
                    {node.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SYSTEM INFO */}
        <div className="mt-12 p-6 bg-black/40 border border-purple-500/20 rounded-xl backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">System Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <div className="text-xs text-purple-400 mb-1">Modular Node System</div>
              <div>Each egregore is complete hermetic package: historical figure + tradition + psychotech + geometry</div>
            </div>
            <div>
              <div className="text-xs text-purple-400 mb-1">Export Ready</div>
              <div>JSON structure compatible with Cathedral monorepo, Liber Arcanae, Codex 144:99</div>
            </div>
            <div>
              <div className="text-xs text-purple-400 mb-1">Fusion Engine</div>
              <div>Combine any two nodes for synthesis - creates novel archetypal hybrids</div>
            </div>
            <div>
              <div className="text-xs text-purple-400 mb-1">8-Circuit Integration</div>
              <div>Maps to Leary's neurological circuits + Wilber's AQAL framework</div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-8 text-center text-xs text-slate-500 border-t border-slate-800 pt-6">
          <p className="mb-2">
            Production-Grade Pathworking Engine • Cathedral Monorepo Compatible
          </p>
          <p>
            Real Historical Figures • Real Traditions • Real Sacred Geometry • Real Integration Psychology
          </p>
          <p className="mt-2 italic">
            Built for: Cosmogenesis Learning Engine • Liber Arcanae • Codex 144:99
          </p>
        </footer>
      </main>
    </div>
  );
}