// engine/muse.js
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Muse Circuit Engine
 * Intelligent Inspiration Layer for the Codex Project
 * Pulls weighted random inspirations, logs sessions, enables cross-mode blending
 */

export class MuseCircuit {
  constructor(registryPath = '../registry/inspirations') {
    this.registryPath = join(__dirname, registryPath);
    this.registries = {};
    this.sessionLog = [];
    this.loadRegistries();
  }

  loadRegistries() {
    const domains = ['psyche', 'mystic', 'science', 'art'];
    
    domains.forEach(domain => {
      const filepath = join(this.registryPath, `${domain}.json`);
      if (existsSync(filepath)) {
        const data = JSON.parse(readFileSync(filepath, 'utf8'));
        this.registries[domain] = data;
      }
    });
  }

  /**
   * Get weighted random inspiration from specified mode(s)
   * @param {string|array} modes - One or more modes: 'mind', 'body', 'soul', 'tech'
   * @param {number} count - Number of inspirations to pull
   */
  pullInspiration(modes = ['mind', 'soul'], count = 1) {
    const modeArray = Array.isArray(modes) ? modes : [modes];
    const candidates = [];

    // Collect all nodes that match the requested modes
    Object.values(this.registries).forEach(registry => {
      registry.nodes.forEach(node => {
        const modeMatch = modeArray.some(mode => node.mode.includes(mode));
        if (modeMatch) {
          candidates.push(node);
        }
      });
    });

    // Weighted random selection
    const selected = [];
    for (let i = 0; i < Math.min(count, candidates.length); i++) {
      const weights = candidates.map(c => c.weight || 0.5);
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      
      let random = Math.random() * totalWeight;
      let selectedIndex = 0;
      
      for (let j = 0; j < weights.length; j++) {
        random -= weights[j];
        if (random <= 0) {
          selectedIndex = j;
          break;
        }
      }
      
      const inspiration = candidates[selectedIndex];
      selected.push(inspiration);
      candidates.splice(selectedIndex, 1);
    }

    // Log to session
    this.sessionLog.push({
      timestamp: new Date().toISOString(),
      modes: modeArray,
      inspirations: selected.map(s => s.id)
    });

    return selected;
  }

  /**
   * Cross-mode blending - merge multiple muses into composite inspiration
   */
  blendMuses(count = 3) {
    const domains = Object.keys(this.registries);
    const blend = [];

    domains.forEach(domain => {
      const nodes = this.registries[domain].nodes;
      if (nodes.length > 0) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        blend.push(randomNode);
      }
    });

    // Shuffle and limit
    blend.sort(() => Math.random() - 0.5);
    const selected = blend.slice(0, count);

    // Create composite
    const composite = {
      id: `blend_${Date.now()}`,
      name: selected.map(s => s.name).join(' + '),
      lineages: selected.map(s => s.lineage),
      keywords: [...new Set(selected.flatMap(s => s.keywords))],
      quotes: selected.map(s => s.quote),
      modes: [...new Set(selected.flatMap(s => s.mode))],
      colors: selected.map(s => s.color),
      geometries: selected.map(s => s.geometry),
      sounds: selected.map(s => s.sound),
      type: 'blend'
    };

    this.sessionLog.push({
      timestamp: new Date().toISOString(),
      type: 'blend',
      sources: selected.map(s => s.id),
      composite: composite.id
    });

    return composite;
  }

  /**
   * Export session muses for build provenance
   */
  exportSession(outputPath = './session_muses.json') {
    const session = {
      generated: new Date().toISOString(),
      engine: 'muse-circuit-v1',
      log: this.sessionLog,
      stats: {
        total_pulls: this.sessionLog.filter(l => l.inspirations).length,
        total_blends: this.sessionLog.filter(l => l.type === 'blend').length,
        domains_used: [...new Set(this.sessionLog.flatMap(l => l.domains || []))]
      }
    };

    writeFileSync(outputPath, JSON.stringify(session, null, 2));
    return session;
  }

  /**
   * Generate overlay data for visualization
   */
  generateOverlay(inspiration) {
    return {
      svg: this.geometryToSVG(inspiration.geometry),
      css: {
        '--muse-color': inspiration.color,
        '--muse-geometry': inspiration.geometry,
        '--muse-sound': inspiration.sound
      },
      metadata: {
        id: inspiration.id,
        name: inspiration.name,
        lineage: inspiration.lineage,
        quote: inspiration.quote
      }
    };
  }

  geometryToSVG(geometry) {
    const svgTemplates = {
      'circle': '<circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2"/>',
      'vesica piscis': '<path d="M30,50 A20,20 0 1,1 70,50 A20,20 0 1,1 30,50" fill="none" stroke="currentColor"/>',
      'mandala': '<g><circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="20"/></g>',
      'spiral': '<path d="M50,50 Q60,40 70,50 T90,50 Q80,60 70,50 T50,50" fill="none" stroke="currentColor"/>',
      'monas symbol': '<g><circle cx="50" cy="50" r="20"/><path d="M50,30 L50,70 M30,50 L70,50"/></g>',
      'geodesic dome': '<polygon points="50,10 90,40 70,90 30,90 10,40" fill="none" stroke="currentColor"/>',
      'coil': '<path d="M30,30 Q70,30 70,50 T30,70 Q70,70 70,90" fill="none" stroke="currentColor"/>',
      'default': '<rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor"/>'
    };

    const template = svgTemplates[geometry] || svgTemplates['default'];
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${template}</svg>`;
  }

  /**
   * Annotate code/functions with muse lineage
   */
  annotateCode(code, inspiration) {
    const annotation = `/**
 * @muse ${inspiration.id}
 * @lineage ${inspiration.lineage}
 * @quote "${inspiration.quote}"
 * @geometry ${inspiration.geometry}
 * @mode [${inspiration.mode.join(', ')}]
 */\n`;
    
    return annotation + code;
  }
}

// Export for use in build scripts
export default MuseCircuit;

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const muse = new MuseCircuit();
  
  const command = process.argv[2];
  const mode = process.argv[3] || 'soul';
  const count = parseInt(process.argv[4]) || 1;

  switch(command) {
    case 'pull':
      const inspirations = muse.pullInspiration(mode, count);
      console.log(JSON.stringify(inspirations, null, 2));
      break;
      
    case 'blend':
      const blend = muse.blendMuses(count);
      console.log(JSON.stringify(blend, null, 2));
      break;
      
    case 'export':
      const session = muse.exportSession();
      console.log('Session exported:', session);
      break;
      
    default:
      console.log(`Usage: node muse.js [pull|blend|export] [mode] [count]
        Examples:
          node muse.js pull soul 3
          node muse.js blend 3
          node muse.js export`);
  }
}