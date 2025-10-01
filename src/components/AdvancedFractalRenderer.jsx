// Advanced Fractal Rendering Engine - Steve Jobs Level Sophistication
// GPU-accelerated, mathematically precise, consciousness-responsive fractals

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMode } from '../hooks/useMode';
import azureAI from '../services/azure-ai';
import codexData from '../data/codex_144_99.json';

export default function AdvancedFractalRenderer({
  codexNode,
  width = 1024,
  height = 768,
  quality = 'ultra',
  consciousness = 0.5
}) {
  const { mode, config } = useMode();
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport, camera } = useThree();

  const [fractalParams, setFractalParams] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [consciousnessField, setConsciousnessField] = useState(consciousness);

  // Advanced shader uniforms based on codex node and consciousness
  const uniforms = useMemo(() => ({
    time: { value: 0.0 },
    resolution: { value: new THREE.Vector2(width, height) },
    consciousness: { value: consciousnessField },
    codexNode: { value: codexNode || 'C144N-001' },
    quality: { value: quality === 'ultra' ? 3.0 : quality === 'high' ? 2.0 : 1.0 },
    therapeutic: { value: mode === 'learning' ? 1.0 : 0.0 },
    ndSafe: { value: 1.0 }, // Always ND-safe
    mouse: { value: new THREE.Vector2(0.5, 0.5) },
    cameraPosition: { value: camera.position.clone() },
    viewport: { value: new THREE.Vector2(viewport.width, viewport.height) }
  }), [codexNode, width, height, quality, consciousnessField, mode, camera, viewport]);

  // Generate fractal parameters based on codex node and consciousness
  useEffect(() => {
    generateAdvancedFractalParams();
  }, [codexNode, consciousnessField]);

  const generateAdvancedFractalParams = async () => {
    setIsGenerating(true);

    try {
      // Get node data from codex
      const node = codexData.nodes[codexNode] || codexData.nodes['C144N-001'];

      // Generate sophisticated parameters with Azure AI
      const aiParams = await azureAI.generateArtParameters(
        node.fractalType,
        codexNode,
        'consciousness-manifestation'
      );

      // Create advanced fractal configuration
      const params = {
        type: node.fractalType,
        iterations: Math.floor(50 + consciousnessField * 100), // 50-150 iterations
        power: 2 + consciousnessField * 6, // Power 2-8
        bailout: 4 + consciousnessField * 12, // Bailout 4-16
        juliaConstant: {
          real: -0.7 + consciousnessField * 0.4,
          imag: 0.27015 + consciousnessField * 0.2
        },
        colorPalette: generateConsciousnessPalette(node.element, consciousnessField),
        therapeuticFrequencies: node.frequencies || [396, 417, 528, 639, 741, 852],
        quantumField: consciousnessField,
        sacredGeometry: node.geometry || 'mandelbulb',
        consciousnessResonance: consciousnessField,
        ...aiParams
      };

      setFractalParams(params);
    } catch (error) {
      console.error('Advanced fractal generation failed:', error);
      // Fallback to sophisticated defaults
      setFractalParams(getFallbackFractalParams(codexNode));
    } finally {
      setIsGenerating(false);
    }
  };

  const generateConsciousnessPalette = (element, consciousness) => {
    const baseColors = {
      water: ['#2EA66F', '#4A90E2', '#9370DB', '#E987A9'],
      fire: ['#FFD700', '#C7323B', '#E77A2E', '#F39B1A'],
      earth: ['#8B7500', '#2EA66F', '#1FA582', '#3BC6B8'],
      air: ['#EDEBE6', '#F4F0EA', '#9CC8F6', '#D8A46C']
    };

    const colors = baseColors[element] || baseColors.water;

    // Modify colors based on consciousness level
    return colors.map(color => {
      // Adjust brightness and saturation based on consciousness
      const consciousnessFactor = 0.5 + consciousness * 0.5;
      return adjustColorBrightness(color, consciousnessFactor);
    });
  };

  const adjustColorBrightness = (hexColor, factor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Adjust brightness
    const newR = Math.min(255, Math.floor(r * factor));
    const newG = Math.min(255, Math.floor(g * factor));
    const newB = Math.min(255, Math.floor(b * factor));

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const getFallbackFractalParams = (nodeId) => {
    const node = codexData.nodes[nodeId] || codexData.nodes['C144N-001'];
    return {
      type: node.fractalType,
      iterations: 80,
      power: 5,
      bailout: 8,
      juliaConstant: { real: -0.7, imag: 0.27015 },
      colorPalette: generateConsciousnessPalette(node.element, 0.5),
      therapeuticFrequencies: node.frequencies || [396, 417, 528],
      quantumField: 0.5,
      sacredGeometry: node.geometry,
      consciousnessResonance: 0.5
    };
  };

  // Advanced vertex shader for consciousness-responsive geometry
  const vertexShader = `
    uniform float time;
    uniform float consciousness;
    uniform vec2 resolution;
    uniform vec3 cameraPosition;

    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vConsciousness;
    varying vec3 vNormal;

    // Advanced noise function for consciousness field
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      vConsciousness = consciousness;

      // Consciousness-responsive vertex displacement
      vec3 pos = position;

      // Add consciousness field distortion
      float consciousnessWave = consciousness * snoise(position * 2.0 + time * 0.5);
      pos += normal * consciousnessWave * 0.1;

      // Sacred geometry influence
      float sacredRatio = (1.0 + sqrt(5.0)) / 2.0; // Golden ratio
      pos *= 1.0 + consciousness * sacredRatio * 0.01;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  // Ultra-sophisticated fragment shader
  const fragmentShader = `
    uniform float time;
    uniform vec2 resolution;
    uniform float consciousness;
    uniform string codexNode;
    uniform float quality;
    uniform float therapeutic;
    uniform vec2 mouse;
    uniform vec3 cameraPosition;

    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vConsciousness;
    varying vec3 vNormal;

    // Advanced complex number operations
    vec2 complexSquare(vec2 z) {
      return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
    }

    vec2 complexMultiply(vec2 a, vec2 b) {
      return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
    }

    float complexMagnitude(vec2 z) {
      return sqrt(z.x * z.x + z.y * z.y);
    }

    // Advanced distance estimation for 3D fractals
    float mandelbulbDE(vec3 pos, float power, int iterations) {
      vec3 z = pos;
      float dr = 1.0;
      float r = 0.0;

      for (int i = 0; i < iterations; i++) {
        r = length(z);
        if (r > 2.0) break;

        // Convert to polar coordinates
        float theta = acos(z.z / r);
        float phi = atan(z.y, z.x);
        dr = pow(r, power - 1.0) * power * dr + 1.0;

        // Scale and rotate the point
        float zr = pow(r, power);
        theta = theta * power;
        phi = phi * power;

        // Convert back to cartesian coordinates
        z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
        z += pos;
      }

      return 0.5 * log(r) * r / dr;
    }

    // Julia set with consciousness modulation
    vec3 juliaSet(vec2 uv, float time, float consciousness) {
      vec2 c = vec2(-0.7 + consciousness * 0.3, 0.27015 + sin(time * 0.5) * 0.1);
      vec2 z = uv * 2.0 - 1.0;

      float iteration = 0.0;
      const float maxIterations = 100.0;

      for (float i = 0.0; i < maxIterations; i++) {
        z = complexSquare(z) + c;
        if (complexMagnitude(z) > 2.0) break;
        iteration = i;
      }

      // Consciousness-responsive coloring
      float consciousnessFactor = consciousness * 0.5 + 0.5;
      vec3 color = vec3(
        0.5 + 0.5 * sin(iteration * 0.1 + consciousnessFactor),
        0.5 + 0.5 * sin(iteration * 0.15 + consciousnessFactor * 1.3),
        0.5 + 0.5 * sin(iteration * 0.2 + consciousnessFactor * 0.7)
      );

      return color;
    }

    // Advanced color mapping with therapeutic frequencies
    vec3 getTherapeuticColor(float iteration, float maxIterations, float consciousness) {
      float ratio = iteration / maxIterations;
      float consciousnessShift = consciousness * 0.3;

      // Solfeggio frequency color mapping
      float freq1 = 396.0; // Liberation
      float freq2 = 528.0; // Transformation
      float freq3 = 741.0; // Intuition

      vec3 color1 = vec3(0.8, 0.2, 0.1); // Red-orange
      vec3 color2 = vec3(0.1, 0.8, 0.2); // Green
      vec3 color3 = vec3(0.2, 0.1, 0.8); // Blue-violet

      vec3 color = mix(
        mix(color1, color2, smoothstep(freq1/1000.0, freq2/1000.0, ratio + consciousnessShift)),
        color3,
        smoothstep(freq2/1000.0, freq3/1000.0, ratio + consciousnessShift)
      );

      return color;
    }

    // Main fragment shader
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= resolution.x / resolution.y;

      // Consciousness field effect
      float consciousnessField = vConsciousness * (0.5 + 0.5 * sin(time * 0.3));

      // Mouse interaction for therapeutic control
      vec2 mouseUV = (mouse * 2.0 - 1.0) * 0.1;
      uv += mouseUV * consciousnessField;

      // Generate fractal based on codex node type
      vec3 color = vec3(0.0);

      if (codexNode == "C144N-001") {
        // Moonchild - Mandelbulb with lunar phases
        float phase = sin(time * 0.1) * 0.5 + 0.5;
        vec3 pos = vec3(uv * 2.0, phase * 2.0 - 1.0);
        float de = mandelbulbDE(pos, 8.0, 50);
        color = getTherapeuticColor(de * 10.0, 10.0, consciousnessField);
      } else if (codexNode == "C144N-002") {
        // Magician - Julia set with manifestation patterns
        color = juliaSet(uv, time, consciousnessField);
      } else if (codexNode == "C144N-003") {
        // High Priestess - Vesica Piscis wisdom patterns
        float d1 = length(uv - vec2(-0.5, 0.0)) - 0.5;
        float d2 = length(uv - vec2(0.5, 0.0)) - 0.5;
        float vesica = max(d1, d2);
        color = getTherapeuticColor(abs(vesica) * 20.0, 20.0, consciousnessField);
      } else {
        // Default advanced fractal
        color = juliaSet(uv, time, consciousnessField);
      }

      // Apply therapeutic frequency modulation
      if (therapeutic > 0.5) {
        float frequencyModulation = sin(time * 0.1) * 0.5 + 0.5;
        color *= 0.8 + 0.2 * frequencyModulation;
      }

      // ND-safe brightness limiting
      float brightness = (color.r + color.g + color.b) / 3.0;
      if (brightness > 0.8) {
        color *= 0.8 / brightness;
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Create shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
      transparent: true
    });
  }, [vertexShader, fragmentShader, uniforms]);

  // Animation loop with consciousness responsiveness
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.consciousness.value = consciousnessField;
      materialRef.current.uniforms.cameraPosition.value.copy(camera.position);
    }

    // Gentle consciousness field animation
    setConsciousnessField(prev => {
      const target = 0.3 + 0.4 * Math.sin(state.clock.elapsedTime * 0.2);
      return prev + (target - prev) * 0.02; // Smooth interpolation
    });
  });

  // Handle mouse interaction for therapeutic control
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = 1.0 - event.clientY / window.innerHeight; // Flip Y coordinate
      shaderMaterial.uniforms.mouse.value.set(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shaderMaterial]);

  if (isGenerating) {
    return (
      <mesh>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color="#1a1e27" transparent opacity={0.8} />
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.1}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          Generating Advanced Fractal...
        </Text>
        <Text
          position={[0, -0.1, 0]}
          fontSize={0.05}
          color="#8888FF"
          anchorX="center"
          anchorY="middle"
        >
          Consciousness Field Initializing
        </Text>
      </mesh>
    );
  }

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <planeGeometry args={[width / 512, height / 512]} />
    </mesh>
  );
}
