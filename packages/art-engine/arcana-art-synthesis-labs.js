/**
 * 🎨🎵 ARCANA ART + SYNTHESIS LABS
 * Interactive 3D art environments with unique synthesis modes for all 78 Tarot cards
 * Each Arcana gets its own immersive laboratory with custom visuals and sound
 *
 * Integrates with:
 * - ArcanaMusicModes (synthesis engine)
 * - MagicalMysteryHouseCodexMirror (sacred mathematics)
 * - Three.js (3D visualization)
 * - Web Audio API (real-time synthesis)
 *
 * @author Rebecca Respawn
 * @business THE CATHEDRAL OF CIRCUITS
 * @system 144:99 Fusion Kink Heaven
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

class ArcanaArtSynthesisLabs {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.controls = null;
    this.currentLab = null;
    this.activeLabs = new Map();
    this.synthesisEngine = null;
    this.mirrorSystem = null;

    // Lab configurations for all 78 Arcana
    this.labConfigurations = this.initializeLabConfigurations();

    // Art generation parameters
    this.artParameters = {
      geometryComplexity: 0.7,
      colorSaturation: 0.8,
      animationSpeed: 0.5,
      particleCount: 1000,
      bloomStrength: 1.5,
    };

    this.initializeThreeJS();
    this.setupEventListeners();
  }

  // 🎨 Initialize lab configurations for all 78 Arcana
  initializeLabConfigurations() {
    return {
      // 🌟 MAJOR ARCANA LABS (22 unique environments)
      "00_fool": {
        name: "Cosmic Void Journey Lab",
        environment: "infinite_starfield_void",
        geometry: "portal_rings_expanding",
        colors: ["#000011", "#1a0033", "#330066", "#6600cc", "#9900ff"],
        lighting: "minimal_starlight_with_portal_glow",
        particles: "void_sparkles_drifting",
        interaction: "step_through_portal_rings",
        synthesis: {
          mode: "ambient_drone_with_crystalline_bells",
          frequency: 396,
          harmonics: [528, 639, 741],
          effects: ["cosmic_reverb", "void_echo", "crystal_chimes"],
        },
        art_features: {
          sacred_geometry: "expanding_spirals",
          fractal_depth: 7,
          golden_ratio_scaling: true,
          breath_animation: "slow_expansion_contraction",
        },
      },

      "01_magician": {
        name: "Enochian Sacred Geometry Lab",
        environment: "floating_geometric_constructs",
        geometry: "enochian_tablets_rotating",
        colors: ["#ffd700", "#ff6600", "#cc3300", "#990000", "#660000"],
        lighting: "divine_golden_illumination",
        particles: "geometric_light_fragments",
        interaction: "manipulate_sacred_symbols",
        synthesis: {
          mode: "complex_oscillator_with_fibonacci_patterns",
          frequency: 528,
          harmonics: [396, 741, 852],
          effects: [
            "harmonic_distortion",
            "sacred_echo",
            "manifestation_surge",
          ],
        },
        art_features: {
          sacred_geometry: "platonic_solids_dance",
          fractal_depth: 9,
          golden_ratio_scaling: true,
          breath_animation: "power_pulse_rhythm",
        },
      },

      "02_high_priestess": {
        name: "Lunar Silver Temple Lab",
        environment: "moonlit_temple_interior",
        geometry: "lunar_crescents_flowing",
        colors: ["#e6e6fa", "#d3d3d3", "#c0c0c0", "#808080", "#4a4a4a"],
        lighting: "soft_moonbeam_filtering",
        particles: "silver_mist_swirling",
        interaction: "scry_lunar_reflections",
        synthesis: {
          mode: "ethereal_pads_with_ancient_chanting",
          frequency: 852,
          harmonics: [528, 963, 174],
          effects: ["temple_reverb", "lunar_chorus", "wisdom_whispers"],
        },
        art_features: {
          sacred_geometry: "vesica_piscis_mandala",
          fractal_depth: 6,
          golden_ratio_scaling: true,
          breath_animation: "lunar_tide_rhythm",
        },
      },

      "03_empress": {
        name: "Verdant Garden Palace Lab",
        environment: "living_garden_sanctuary",
        geometry: "organic_flowing_forms",
        colors: ["#228b22", "#32cd32", "#90ee90", "#98fb98", "#f0fff0"],
        lighting: "natural_sunlight_filtering_through_leaves",
        particles: "pollen_and_light_sparkles",
        interaction: "tend_magical_plants",
        synthesis: {
          mode: "organic_flowing_textures_with_nature_sounds",
          frequency: 639,
          harmonics: [528, 417, 285],
          effects: ["forest_reverb", "wind_chorus", "growth_harmonics"],
        },
        art_features: {
          sacred_geometry: "fibonacci_spirals_in_nature",
          fractal_depth: 8,
          golden_ratio_scaling: true,
          breath_animation: "growth_pulse_organic",
        },
      },

      "06_lovers": {
        name: "Alchemical Wedding Chamber Lab",
        environment: "dual_reality_fusion_space",
        geometry: "interlaced_union_symbols",
        colors: ["#ff69b4", "#ffd700", "#ffffff", "#ff1493", "#dc143c"],
        lighting: "twin_flame_illumination",
        particles: "fusion_energy_swirls",
        interaction: "perform_sacred_union_ritual",
        synthesis: {
          mode: "dual_oscillator_fusion_with_heart_harmonics",
          frequency: 963,
          harmonics: [639, 528, 417],
          effects: [
            "fusion_harmonizer",
            "love_frequency_amplifier",
            "union_resonance",
          ],
        },
        art_features: {
          sacred_geometry: "infinity_symbols_interlaced",
          fractal_depth: 11,
          golden_ratio_scaling: true,
          breath_animation: "heartbeat_synchronization",
        },
      },

      "21_world": {
        name: "Mandala Universe Center Lab",
        environment: "cosmic_completion_mandala",
        geometry: "universal_mandala_rotating",
        colors: ["#4b0082", "#8a2be2", "#9400d3", "#9932cc", "#dda0dd"],
        lighting: "omnidirectional_cosmic_radiance",
        particles: "completion_light_spirals",
        interaction: "dance_cosmic_completion",
        synthesis: {
          mode: "full_spectrum_harmony_with_completion_resolution",
          frequency: 963,
          harmonics: [528, 639, 741, 852],
          effects: [
            "cosmic_harmonizer",
            "completion_resonance",
            "universal_chorus",
          ],
        },
        art_features: {
          sacred_geometry: "sri_yantra_cosmic_mandala",
          fractal_depth: 12,
          golden_ratio_scaling: true,
          breath_animation: "cosmic_completion_pulse",
        },
      },

      // TODO: Add remaining 16 Major Arcana + 56 Minor Arcana configurations
      // Each will have unique art, synthesis, and interaction modes
    };
  }

  // 🎮 Initialize Three.js environment
  initializeThreeJS() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000011);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 10);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // Add to DOM
    const container = document.getElementById("arcana-lab-container");
    if (container) {
      container.appendChild(this.renderer.domElement);
    } else {
      document.body.appendChild(this.renderer.domElement);
    }

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Setup post-processing
    this.setupPostProcessing();

    // Start render loop
    this.startRenderLoop();

    console.log("🎮 Three.js environment initialized for Arcana Labs");
  }

  // ✨ Setup post-processing effects
  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.artParameters.bloomStrength,
      0.4,
      0.85
    );
    this.composer.addPass(bloomPass);
  }

  // 🎨 Enter specific Arcana lab
  async enterArcanaLab(arcanaKey) {
    const labConfig = this.labConfigurations[arcanaKey];
    if (!labConfig) {
      console.error(`❌ Lab configuration for "${arcanaKey}" not found`);
      return false;
    }

    // Exit current lab if active
    if (this.currentLab) {
      this.exitCurrentLab();
    }

    console.log(`🎨 Entering ${labConfig.name}`);
    this.currentLab = arcanaKey;

    // Clear scene
    this.clearScene();

    // Create lab environment
    await this.createLabEnvironment(labConfig);

    // Initialize synthesis engine for this lab
    if (window.ArcanaMusicModes) {
      await window.ArcanaMusicModes.enterArcanaMode(arcanaKey);
    }

    // Update mirror system
    if (window.MagicalMysteryHouseCodexMirror) {
      this.updateMirrorSystem(arcanaKey, labConfig);
    }

    // Update UI
    this.updateLabUI(labConfig);

    return true;
  }

  // 🏗️ Create lab environment
  async createLabEnvironment(labConfig) {
    // Create main geometry
    const mainGeometry = await this.createMainGeometry(labConfig);
    this.scene.add(mainGeometry);

    // Add lighting
    const lighting = this.createLighting(labConfig);
    lighting.forEach((light) => this.scene.add(light));

    // Add particle systems
    const particles = this.createParticleSystem(labConfig);
    this.scene.add(particles);

    // Add interactive elements
    const interactives = await this.createInteractiveElements(labConfig);
    interactives.forEach((element) => this.scene.add(element));

    // Apply sacred geometry
    const sacredGeometry = this.createSacredGeometry(labConfig);
    this.scene.add(sacredGeometry);

    // Start animations
    this.startLabAnimations(labConfig);
  }

  // 📐 Create main geometry for lab
  async createMainGeometry(labConfig) {
    const group = new THREE.Group();

    switch (labConfig.environment) {
      case "infinite_starfield_void":
        return this.createVoidStarfield(labConfig);

      case "floating_geometric_constructs":
        return this.createGeometricConstructs(labConfig);

      case "moonlit_temple_interior":
        return this.createMoonlitTemple(labConfig);

      case "living_garden_sanctuary":
        return this.createLivingGarden(labConfig);

      case "dual_reality_fusion_space":
        return this.createFusionSpace(labConfig);

      case "cosmic_completion_mandala":
        return this.createCosmicMandala(labConfig);

      default:
        return this.createDefaultLab(labConfig);
    }
  }

  // 🌌 Create void starfield
  createVoidStarfield(labConfig) {
    const group = new THREE.Group();

    // Create expanding portal rings
    const ringCount = 7;
    for (let i = 0; i < ringCount; i++) {
      const radius = 2 + i * 1.5;
      const geometry = new THREE.TorusGeometry(radius, 0.1, 16, 32);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(labConfig.colors[i % labConfig.colors.length]),
        transparent: true,
        opacity: 0.7 - i * 0.1,
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2;
      ring.userData.animationType = "portal_ring";
      ring.userData.baseRadius = radius;
      ring.userData.ringIndex = i;
      group.add(ring);
    }

    // Add void sparkles
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparkleCount = 500;
    const positions = new Float32Array(sparkleCount * 3);

    for (let i = 0; i < sparkleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    sparkleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const sparkleMaterial = new THREE.PointsMaterial({
      color: 0x6600cc,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
    });

    const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    sparkles.userData.animationType = "void_sparkles";
    group.add(sparkles);

    return group;
  }

  // 🔷 Create geometric constructs
  createGeometricConstructs(labConfig) {
    const group = new THREE.Group();

    // Platonic solids arrangement
    const solids = [
      { geometry: new THREE.TetrahedronGeometry(1), position: [0, 3, 0] },
      { geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5), position: [-3, 0, 0] },
      { geometry: new THREE.OctahedronGeometry(1), position: [3, 0, 0] },
      { geometry: new THREE.DodecahedronGeometry(1), position: [0, -3, 0] },
      { geometry: new THREE.IcosahedronGeometry(1), position: [0, 0, 3] },
    ];

    solids.forEach((solid, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(
          labConfig.colors[index % labConfig.colors.length]
        ),
        transparent: true,
        opacity: 0.8,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(solid.geometry, material);
      mesh.position.set(...solid.position);
      mesh.userData.animationType = "platonic_rotation";
      mesh.userData.rotationSpeed = 0.02 + index * 0.005;
      group.add(mesh);

      // Add wireframe overlay
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const wireframe = new THREE.Mesh(solid.geometry, wireframeMaterial);
      wireframe.position.set(...solid.position);
      wireframe.scale.multiplyScalar(1.01);
      group.add(wireframe);
    });

    return group;
  }

  // 🌙 Create moonlit temple
  createMoonlitTemple(labConfig) {
    const group = new THREE.Group();

    // Temple pillars
    const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8, 12);
    const pillarMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(labConfig.colors[1]),
      transparent: true,
      opacity: 0.9,
    });

    const pillarPositions = [
      [-4, 0, -4],
      [4, 0, -4],
      [-4, 0, 4],
      [4, 0, 4],
      [-4, 0, 0],
      [4, 0, 0],
      [0, 0, -4],
      [0, 0, 4],
    ];

    pillarPositions.forEach((pos) => {
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(...pos);
      group.add(pillar);
    });

    // Central altar with lunar symbols
    const altarGeometry = new THREE.CylinderGeometry(1.5, 1.8, 1, 16);
    const altarMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(labConfig.colors[0]),
    });
    const altar = new THREE.Mesh(altarGeometry, altarMaterial);
    altar.position.y = -3.5;
    group.add(altar);

    // Floating lunar crescents
    const crescentCount = 12;
    for (let i = 0; i < crescentCount; i++) {
      const angle = (i / crescentCount) * Math.PI * 2;
      const radius = 6;

      const crescentGeometry = new THREE.TorusGeometry(
        0.5,
        0.1,
        8,
        16,
        Math.PI
      );
      const crescentMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(labConfig.colors[2]),
        transparent: true,
        opacity: 0.6,
      });

      const crescent = new THREE.Mesh(crescentGeometry, crescentMaterial);
      crescent.position.x = Math.cos(angle) * radius;
      crescent.position.z = Math.sin(angle) * radius;
      crescent.position.y = Math.sin(i * 0.5) * 2;
      crescent.rotation.y = angle + Math.PI / 2;
      crescent.userData.animationType = "lunar_orbit";
      crescent.userData.angle = angle;
      crescent.userData.baseY = crescent.position.y;
      group.add(crescent);
    }

    return group;
  }

  // 🌿 Create living garden
  createLivingGarden(labConfig) {
    const group = new THREE.Group();

    // Ground plane with organic texture
    const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    const groundMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(labConfig.colors[0]),
      transparent: true,
      opacity: 0.8,
    });

    // Displace vertices for organic ground
    const positions = groundGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const noise = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.5;
      positions.setY(i, noise);
    }
    groundGeometry.computeVertexNormals();

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -4;
    group.add(ground);

    // Growing plant structures
    const plantCount = 15;
    for (let i = 0; i < plantCount; i++) {
      const plant = this.createPlantStructure(labConfig, i);
      const angle = (i / plantCount) * Math.PI * 2;
      const radius = 3 + Math.random() * 4;
      plant.position.x = Math.cos(angle) * radius;
      plant.position.z = Math.sin(angle) * radius;
      plant.position.y = -4;
      group.add(plant);
    }

    return group;
  }

  // 🌱 Create individual plant structure
  createPlantStructure(labConfig, index) {
    const group = new THREE.Group();

    // Stem
    const stemHeight = 2 + Math.random() * 3;
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.1, stemHeight, 8);
    const stemMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(labConfig.colors[1]),
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = stemHeight / 2;
    group.add(stem);

    // Flower/leaves
    const petalCount = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalGeometry = new THREE.SphereGeometry(0.3, 8, 6);
      const petalMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(labConfig.colors[2 + (i % 2)]),
        transparent: true,
        opacity: 0.8,
      });

      const petal = new THREE.Mesh(petalGeometry, petalMaterial);
      petal.position.x = Math.cos(angle) * 0.4;
      petal.position.z = Math.sin(angle) * 0.4;
      petal.position.y = stemHeight;
      petal.scale.y = 0.3;
      petal.userData.animationType = "petal_sway";
      petal.userData.baseAngle = angle;
      group.add(petal);
    }

    group.userData.animationType = "plant_growth";
    group.userData.plantIndex = index;
    return group;
  }

  // 💕 Create fusion space
  createFusionSpace(labConfig) {
    const group = new THREE.Group();

    // Dual reality chambers
    const leftChamber = this.createFusionChamber(
      labConfig,
      -3,
      labConfig.colors[0]
    );
    const rightChamber = this.createFusionChamber(
      labConfig,
      3,
      labConfig.colors[1]
    );

    group.add(leftChamber);
    group.add(rightChamber);

    // Central fusion core
    const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(labConfig.colors[2]),
      transparent: true,
      opacity: 0.7,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.userData.animationType = "fusion_core";
    group.add(core);

    // Energy bridges connecting chambers
    const bridgeCount = 8;
    for (let i = 0; i < bridgeCount; i++) {
      const angle = (i / bridgeCount) * Math.PI * 2;
      const bridge = this.createEnergyBridge(angle, labConfig.colors[3]);
      group.add(bridge);
    }

    return group;
  }

  // 🏛️ Create fusion chamber
  createFusionChamber(labConfig, xOffset, color) {
    const group = new THREE.Group();

    const chamberGeometry = new THREE.CylinderGeometry(
      1.5,
      1.5,
      4,
      16,
      1,
      true
    );
    const chamberMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
    chamber.position.x = xOffset;
    group.add(chamber);

    return group;
  }

  // ⚡ Create energy bridge
  createEnergyBridge(angle, color) {
    const bridgeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 6, 8);
    const bridgeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
    });

    const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
    bridge.rotation.z = Math.PI / 2;
    bridge.rotation.y = angle;
    bridge.userData.animationType = "energy_bridge";
    bridge.userData.angle = angle;

    return bridge;
  }

  // 🌌 Create cosmic mandala
  createCosmicMandala(labConfig) {
    const group = new THREE.Group();

    // Central Sri Yantra structure
    const layers = 9;
    for (let layer = 0; layer < layers; layer++) {
      const radius = 0.5 + layer * 0.3;
      const triangleCount = 3 + layer;

      for (let i = 0; i < triangleCount; i++) {
        const angle = (i / triangleCount) * Math.PI * 2;
        const triangle = this.createYantraTriangle(
          radius,
          angle,
          layer,
          labConfig
        );
        group.add(triangle);
      }
    }

    // Outer mandala rings
    const ringCount = 12;
    for (let ring = 0; ring < ringCount; ring++) {
      const radius = 4 + ring * 0.8;
      const elementCount = 8 + ring * 2;

      for (let i = 0; i < elementCount; i++) {
        const angle = (i / elementCount) * Math.PI * 2;
        const element = this.createMandalaElement(
          radius,
          angle,
          ring,
          labConfig
        );
        group.add(element);
      }
    }

    group.userData.animationType = "cosmic_mandala_rotation";
    return group;
  }

  // 🔺 Create yantra triangle
  createYantraTriangle(radius, angle, layer, labConfig) {
    const triangleGeometry = new THREE.ConeGeometry(0.2, 0.4, 3);
    const triangleMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(labConfig.colors[layer % labConfig.colors.length]),
      transparent: true,
      opacity: 0.8,
    });

    const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
    triangle.position.x = Math.cos(angle) * radius;
    triangle.position.z = Math.sin(angle) * radius;
    triangle.rotation.y = angle;
    triangle.rotation.x = layer % 2 === 0 ? 0 : Math.PI;
    triangle.userData.animationType = "yantra_triangle";
    triangle.userData.layer = layer;
    triangle.userData.angle = angle;

    return triangle;
  }

  // 🕸️ Create mandala element
  createMandalaElement(radius, angle, ring, labConfig) {
    const elementGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const elementMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(labConfig.colors[ring % labConfig.colors.length]),
      transparent: true,
      opacity: 0.9,
    });

    const element = new THREE.Mesh(elementGeometry, elementMaterial);
    element.position.x = Math.cos(angle) * radius;
    element.position.z = Math.sin(angle) * radius;
    element.userData.animationType = "mandala_element";
    element.userData.ring = ring;
    element.userData.angle = angle;

    return element;
  }

  // 💡 Create lighting for lab
  createLighting(labConfig) {
    const lights = [];

    switch (labConfig.lighting) {
      case "minimal_starlight_with_portal_glow":
        // Dim ambient light
        lights.push(new THREE.AmbientLight(0x1a0033, 0.3));

        // Portal glow lights
        for (let i = 0; i < 3; i++) {
          const light = new THREE.PointLight(0x6600cc, 1, 10);
          light.position.set(0, 0, i * 2 - 2);
          lights.push(light);
        }
        break;

      case "divine_golden_illumination":
        lights.push(new THREE.AmbientLight(0x332200, 0.4));

        const directionalLight = new THREE.DirectionalLight(0xffd700, 1);
        directionalLight.position.set(5, 10, 5);
        lights.push(directionalLight);

        const spotLight = new THREE.SpotLight(0xffaa00, 1, 20, Math.PI / 6);
        spotLight.position.set(0, 8, 0);
        spotLight.target.position.set(0, 0, 0);
        lights.push(spotLight);
        break;

      case "soft_moonbeam_filtering":
        lights.push(new THREE.AmbientLight(0x404040, 0.5));

        const moonLight = new THREE.DirectionalLight(0xe6e6fa, 0.8);
        moonLight.position.set(-5, 10, 3);
        lights.push(moonLight);
        break;

      case "natural_sunlight_filtering_through_leaves":
        lights.push(new THREE.AmbientLight(0x304020, 0.6));

        const sunLight = new THREE.DirectionalLight(0xffffcc, 1);
        sunLight.position.set(8, 15, 8);
        lights.push(sunLight);

        // Dappled light effect
        for (let i = 0; i < 5; i++) {
          const dappleLight = new THREE.SpotLight(
            0x90ee90,
            0.5,
            8,
            Math.PI / 8
          );
          dappleLight.position.set(
            (Math.random() - 0.5) * 10,
            5 + Math.random() * 3,
            (Math.random() - 0.5) * 10
          );
          lights.push(dappleLight);
        }
        break;

      default:
        lights.push(new THREE.AmbientLight(0x404040, 0.5));
        lights.push(new THREE.DirectionalLight(0xffffff, 0.8));
    }

    return lights;
  }

  // ✨ Create particle system
  createParticleSystem(labConfig) {
    const particleCount = this.artParameters.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Color based on lab configuration
      const colorIndex = Math.floor(Math.random() * labConfig.colors.length);
      color.set(labConfig.colors[colorIndex]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Size
      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData.animationType = labConfig.particles;

    return particles;
  }

  // 🎮 Create interactive elements
  async createInteractiveElements(labConfig) {
    const interactives = [];

    switch (labConfig.interaction) {
      case "step_through_portal_rings":
        // Create invisible trigger zones
        for (let i = 0; i < 7; i++) {
          const triggerGeometry = new THREE.RingGeometry(
            1.8 + i * 1.5,
            2.2 + i * 1.5,
            16
          );
          const triggerMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
          });
          const trigger = new THREE.Mesh(triggerGeometry, triggerMaterial);
          trigger.rotation.x = Math.PI / 2;
          trigger.userData.interactionType = "portal_step";
          trigger.userData.ringIndex = i;
          interactives.push(trigger);
        }
        break;

      case "manipulate_sacred_symbols":
        // Create draggable geometric symbols
        const symbols = [
          "tetrahedron",
          "cube",
          "octahedron",
          "dodecahedron",
          "icosahedron",
        ];
        symbols.forEach((symbol, index) => {
          const geometry = this.getSymbolGeometry(symbol);
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(labConfig.colors[index]),
            transparent: true,
            opacity: 0.8,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set((index - 2) * 2, 0, 0);
          mesh.userData.interactionType = "symbol_manipulation";
          mesh.userData.symbol = symbol;
          interactives.push(mesh);
        });
        break;

      // Add more interaction types...
    }

    return interactives;
  }

  // 📐 Get geometry for sacred symbols
  getSymbolGeometry(symbol) {
    switch (symbol) {
      case "tetrahedron":
        return new THREE.TetrahedronGeometry(1);
      case "cube":
        return new THREE.BoxGeometry(1.5, 1.5, 1.5);
      case "octahedron":
        return new THREE.OctahedronGeometry(1);
      case "dodecahedron":
        return new THREE.DodecahedronGeometry(1);
      case "icosahedron":
        return new THREE.IcosahedronGeometry(1);
      default:
        return new THREE.SphereGeometry(1);
    }
  }

  // 🕉️ Create sacred geometry overlays
  createSacredGeometry(labConfig) {
    const group = new THREE.Group();

    switch (labConfig.art_features.sacred_geometry) {
      case "expanding_spirals":
        group.add(this.createExpandingSpirals(labConfig));
        break;

      case "platonic_solids_dance":
        group.add(this.createPlatonicSolidsDance(labConfig));
        break;

      case "vesica_piscis_mandala":
        group.add(this.createVesicaPiscis(labConfig));
        break;

      case "fibonacci_spirals_in_nature":
        group.add(this.createFibonacciSpirals(labConfig));
        break;

      case "infinity_symbols_interlaced":
        group.add(this.createInfinitySymbols(labConfig));
        break;

      case "sri_yantra_cosmic_mandala":
        group.add(this.createSriYantra(labConfig));
        break;
    }

    return group;
  }

  // 🌀 Create expanding spirals
  createExpandingSpirals(labConfig) {
    const group = new THREE.Group();
    const spiralCount = 3;

    for (let s = 0; s < spiralCount; s++) {
      const points = [];
      const pointCount = 100;

      for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 4;
        const radius = (i / pointCount) * 5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (i / pointCount) * 2 - 1;
        points.push(new THREE.Vector3(x, y, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(labConfig.colors[s]),
        transparent: true,
        opacity: 0.8,
      });

      const spiral = new THREE.Line(geometry, material);
      spiral.rotation.z = s * ((Math.PI * 2) / spiralCount);
      spiral.userData.animationType = "expanding_spiral";
      spiral.userData.spiralIndex = s;
      group.add(spiral);
    }

    return group;
  }

  // 💎 Create platonic solids dance
  createPlatonicSolidsDance(labConfig) {
    const group = new THREE.Group();
    // Implementation for dancing platonic solids
    return group;
  }

  // 🔄 Create vesica piscis
  createVesicaPiscis(labConfig) {
    const group = new THREE.Group();
    // Implementation for vesica piscis sacred geometry
    return group;
  }

  // 🌀 Create fibonacci spirals
  createFibonacciSpirals(labConfig) {
    const group = new THREE.Group();
    // Implementation for fibonacci spirals in nature
    return group;
  }

  // ∞ Create infinity symbols
  createInfinitySymbols(labConfig) {
    const group = new THREE.Group();
    // Implementation for interlaced infinity symbols
    return group;
  }

  // 🕉️ Create Sri Yantra
  createSriYantra(labConfig) {
    const group = new THREE.Group();
    // Implementation for Sri Yantra cosmic mandala
    return group;
  }

  // 🎬 Start lab animations
  startLabAnimations(labConfig) {
    this.animationCallbacks = this.animationCallbacks || [];

    // Clear previous animations
    this.animationCallbacks = [];

    // Start breath animation
    this.startBreathAnimation(labConfig);

    // Start element-specific animations
    this.scene.traverse((object) => {
      if (object.userData.animationType) {
        this.startObjectAnimation(object, labConfig);
      }
    });
  }

  // 🫁 Start breath animation
  startBreathAnimation(labConfig) {
    const breathCallback = (time) => {
      const breathCycle = Math.sin(time * 0.001) * 0.1 + 1;

      switch (labConfig.art_features.breath_animation) {
        case "slow_expansion_contraction":
          this.scene.scale.setScalar(breathCycle);
          break;

        case "power_pulse_rhythm":
          this.scene.children.forEach((child) => {
            if (child.userData.animationType === "platonic_rotation") {
              child.scale.setScalar(breathCycle);
            }
          });
          break;

        case "lunar_tide_rhythm":
          this.scene.children.forEach((child) => {
            if (child.userData.animationType === "lunar_orbit") {
              child.position.y =
                child.userData.baseY + Math.sin(time * 0.002) * 0.5;
            }
          });
          break;

        case "growth_pulse_organic":
          this.scene.children.forEach((child) => {
            if (child.userData.animationType === "plant_growth") {
              child.scale.y = breathCycle;
            }
          });
          break;

        case "heartbeat_synchronization":
          const heartbeat = Math.sin(time * 0.005) * 0.05 + 1;
          this.scene.children.forEach((child) => {
            if (child.userData.animationType === "fusion_core") {
              child.scale.setScalar(heartbeat);
            }
          });
          break;

        case "cosmic_completion_pulse":
          this.scene.children.forEach((child) => {
            if (child.userData.animationType === "cosmic_mandala_rotation") {
              child.rotation.y = time * 0.001;
              child.scale.setScalar(breathCycle);
            }
          });
          break;
      }
    };

    this.animationCallbacks.push(breathCallback);
  }

  // 🎯 Start object-specific animation
  startObjectAnimation(object, labConfig) {
    const animCallback = (time) => {
      switch (object.userData.animationType) {
        case "portal_ring":
          const pulseScale =
            Math.sin(time * 0.002 + object.userData.ringIndex) * 0.1 + 1;
          object.scale.setScalar(pulseScale);
          object.rotation.z = time * 0.001 * (object.userData.ringIndex + 1);
          break;

        case "void_sparkles":
          object.rotation.y = time * 0.0005;
          const positions = object.geometry.attributes.position;
          for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            positions.setY(i, y + Math.sin(time * 0.001 + i) * 0.01);
          }
          positions.needsUpdate = true;
          break;

        case "platonic_rotation":
          object.rotation.x = time * object.userData.rotationSpeed;
          object.rotation.y = time * object.userData.rotationSpeed * 0.7;
          break;

        case "lunar_orbit":
          const angle = object.userData.angle + time * 0.0003;
          object.position.x = Math.cos(angle) * 6;
          object.position.z = Math.sin(angle) * 6;
          break;

        case "petal_sway":
          const sway = Math.sin(time * 0.002 + object.userData.baseAngle) * 0.1;
          object.rotation.z = sway;
          break;

        case "fusion_core":
          object.rotation.x = time * 0.002;
          object.rotation.y = time * 0.003;
          break;

        case "energy_bridge":
          const pulse =
            Math.sin(time * 0.004 + object.userData.angle) * 0.5 + 1;
          object.material.opacity = pulse * 0.8;
          break;

        case "yantra_triangle":
          object.rotation.y =
            object.userData.angle + time * 0.001 * (object.userData.layer + 1);
          break;

        case "mandala_element":
          const orbit =
            object.userData.angle + time * 0.0005 * (object.userData.ring + 1);
          const radius = 4 + object.userData.ring * 0.8;
          object.position.x = Math.cos(orbit) * radius;
          object.position.z = Math.sin(orbit) * radius;
          break;

        case "expanding_spiral":
          object.rotation.z = time * 0.001 * (object.userData.spiralIndex + 1);
          break;
      }
    };

    this.animationCallbacks.push(animCallback);
  }

  // 🔄 Main render loop
  startRenderLoop() {
    const renderLoop = (time) => {
      requestAnimationFrame(renderLoop);

      // Update controls
      this.controls.update();

      // Run animations
      if (this.animationCallbacks) {
        this.animationCallbacks.forEach((callback) => callback(time));
      }

      // Update synthesis visualization if available
      if (window.ArcanaMusicModes) {
        this.updateSynthesisVisualization();
      }

      // Render scene
      this.composer.render();
    };

    renderLoop();
  }

  // 🎵 Update synthesis visualization based on audio analysis
  updateSynthesisVisualization() {
    const analysisData = window.ArcanaMusicModes.getAnalysisData();
    if (!analysisData) return;

    const { frequencyData, bufferLength } = analysisData;

    // Update particles based on audio frequency data
    this.scene.traverse((object) => {
      if (
        object.userData.animationType === "void_sparkles" ||
        object.userData.animationType === "silver_mist_swirling"
      ) {
        const material = object.material;
        if (material && frequencyData) {
          // Use frequency data to modulate particle behavior
          const avgFrequency =
            frequencyData.reduce((a, b) => a + b) / bufferLength;
          material.opacity = 0.3 + (avgFrequency / 255) * 0.7;

          // Modulate particle size based on frequency
          if (material.size !== undefined) {
            material.size = 0.2 + (avgFrequency / 255) * 0.8;
          }
        }
      }
    });

    // Update post-processing bloom based on audio intensity
    if (this.composer && this.composer.passes) {
      const bloomPass = this.composer.passes.find(
        (pass) => pass.constructor.name === "UnrealBloomPass"
      );
      if (bloomPass && frequencyData) {
        const intensity = frequencyData.reduce((a, b) => a + b) / bufferLength;
        bloomPass.strength =
          this.artParameters.bloomStrength + (intensity / 255) * 2;
      }
    }
  }

  // 🔧 Update mirror system integration
  updateMirrorSystem(arcanaKey, labConfig) {
    const mirrorData = {
      currentLab: arcanaKey,
      artEnvironment: {
        style: labConfig.environment,
        colors: labConfig.colors,
        geometry: labConfig.geometry,
        lighting: labConfig.lighting,
      },
      synthesisParameters: labConfig.synthesis,
    };

    window.dispatchEvent(
      new CustomEvent("arcana-lab-change", {
        detail: mirrorData,
      })
    );
  }

  // 🖥️ Update lab UI
  updateLabUI(labConfig) {
    // Update lab name display
    const labNameElement = document.getElementById("current-lab-name");
    if (labNameElement) {
      labNameElement.textContent = labConfig.name;
    }

    // Update synthesis info
    const synthInfoElement = document.getElementById("synthesis-info");
    if (synthInfoElement) {
      synthInfoElement.innerHTML = `
        <div class="synthesis-mode">${labConfig.synthesis.mode}</div>
        <div class="base-frequency">${labConfig.synthesis.frequency} Hz</div>
        <div class="harmonics">${labConfig.synthesis.harmonics.join(", ")} Hz</div>
      `;
    }

    // Update art parameters display
    const artInfoElement = document.getElementById("art-info");
    if (artInfoElement) {
      artInfoElement.innerHTML = `
        <div class="sacred-geometry">${labConfig.art_features.sacred_geometry}</div>
        <div class="fractal-depth">Depth: ${labConfig.art_features.fractal_depth}</div>
        <div class="breath-animation">${labConfig.art_features.breath_animation}</div>
      `;
    }
  }

  // 🗑️ Clear scene
  clearScene() {
    while (this.scene.children.length > 0) {
      const object = this.scene.children[0];
      this.scene.remove(object);

      // Dispose of geometries and materials
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    }

    // Clear animation callbacks
    this.animationCallbacks = [];
  }

  // 🚪 Exit current lab
  exitCurrentLab() {
    if (!this.currentLab) return;

    console.log(`🚪 Exiting ${this.currentLab} lab`);

    // Clear scene
    this.clearScene();

    // Stop synthesis
    if (window.ArcanaMusicModes) {
      window.ArcanaMusicModes.exitCurrentMode();
    }

    // Reset camera
    this.camera.position.set(0, 0, 10);
    this.controls.reset();

    this.currentLab = null;
  }

  // 📋 Get available labs
  getAvailableLabs() {
    return Object.keys(this.labConfigurations).map((key) => {
      const config = this.labConfigurations[key];
      return {
        key: key,
        name: config.name,
        environment: config.environment,
        synthesis: config.synthesis.mode,
        interaction: config.interaction,
      };
    });
  }

  // 🎚️ Control methods
  setArtParameter(parameter, value) {
    if (this.artParameters.hasOwnProperty(parameter)) {
      this.artParameters[parameter] = value;

      // Apply parameter changes
      switch (parameter) {
        case "bloomStrength":
          const bloomPass = this.composer.passes.find(
            (pass) => pass.constructor.name === "UnrealBloomPass"
          );
          if (bloomPass) bloomPass.strength = value;
          break;

        case "animationSpeed":
          // Update animation speeds
          break;
      }
    }
  }

  // 📤 Export lab state for publication
  exportForPublication() {
    return {
      currentLab: this.currentLab,
      labConfigurations: this.labConfigurations,
      artParameters: this.artParameters,
      availableLabs: this.getAvailableLabs(),
      integrationStatus: {
        synthesisEngine: !!window.ArcanaMusicModes,
        mirrorSystem: !!window.MagicalMysteryHouseCodexMirror,
      },
    };
  }

  // 📱 Setup event listeners
  setupEventListeners() {
    // Listen for Arcana mode requests
    window.addEventListener("arcana-lab-request", (event) => {
      const { arcanaKey } = event.detail;
      this.enterArcanaLab(arcanaKey);
    });

    // Listen for art parameter changes
    window.addEventListener("art-parameter-change", (event) => {
      const { parameter, value } = event.detail;
      this.setArtParameter(parameter, value);
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.composer.setSize(window.innerWidth, window.innerHeight);
    });

    // Handle mouse/touch interactions
    this.setupInteractionHandlers();
  }

  // 🖱️ Setup interaction handlers
  setupInteractionHandlers() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObjects(this.scene.children, true);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        this.handleObjectInteraction(object, intersects[0].point);
      }
    };

    this.renderer.domElement.addEventListener("click", onMouseClick);
  }

  // 🎯 Handle object interactions
  handleObjectInteraction(object, point) {
    if (!object.userData.interactionType) return;

    switch (object.userData.interactionType) {
      case "portal_step":
        console.log(`Stepped through portal ring ${object.userData.ringIndex}`);
        this.triggerPortalEffect(object.userData.ringIndex);
        break;

      case "symbol_manipulation":
        console.log(`Manipulating ${object.userData.symbol}`);
        this.triggerSymbolEffect(object);
        break;

      // Add more interaction handlers...
    }
  }

  // ✨ Trigger portal effect
  triggerPortalEffect(ringIndex) {
    // Create portal effect animation
    // Trigger frequency change in synthesis engine
    if (window.ArcanaMusicModes) {
      const newFrequency = 396 + ringIndex * 66; // Sacred frequency progression
      window.ArcanaMusicModes.setModulationDepth(ringIndex / 7);
    }
  }

  // 🔮 Trigger symbol effect
  triggerSymbolEffect(symbolObject) {
    // Animate symbol
    const originalScale = symbolObject.scale.clone();
    symbolObject.scale.multiplyScalar(1.2);

    setTimeout(() => {
      symbolObject.scale.copy(originalScale);
    }, 300);

    // Trigger synthesis effect
    if (window.ArcanaMusicModes) {
      // Modulate based on symbol type
      const symbolFrequencies = {
        tetrahedron: 174,
        cube: 285,
        octahedron: 396,
        dodecahedron: 528,
        icosahedron: 741,
      };

      // Temporarily modulate frequency
      // Implementation depends on synthesis engine API
    }
  }
}

// Initialize and export
const arcanaArtLabs = new ArcanaArtSynthesisLabs();

// Auto-initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎨🎵 Arcana Art + Synthesis Labs initialized");

  // Expose global API
  window.ArcanaArtSynthesisLabs = arcanaArtLabs;
});

export default ArcanaArtSynthesisLabs;
